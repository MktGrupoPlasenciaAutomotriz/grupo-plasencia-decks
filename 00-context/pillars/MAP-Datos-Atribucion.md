# Pillar — Datos y Atribución

> Visión panorámica de **cómo viaja un lead desde el form hasta Meta/GA4 y cómo se reconcilia**. Cubre el folio (join key), GA4 dims, Meta CAPI, GA4 MP, dedup y conciliación. Es índice. Para detalle, abre los docs hijos.

---

## El "spine" de atribución

```
[Browser]
  │ submit form → genera FOLIO en JS: GP-{MARCA}-YYMMDD-HHMMSS (hora GDL)
  │
  ├─► gtag dispara generate_lead (browser-side)
  │       └─ GA4 con sessionSource real (Meta/Paid, google/cpc, direct…)
  │
  ├─► Meta Pixel dispara Lead con event_id = {folio}_Lead
  │
  └─► POST /api/lead/:marca al Worker
          │
          ├─► INSERT D1 (leads + pipeline)
          │
          ├─► Meta CAPI server-side con event_id = {folio}_Lead
          │       └─ Dedup contra Pixel browser-side (mismo event_id)
          │
          └─► GA4 Measurement Protocol server-side
                  └─ sessionSource = (not set), sessions = 0 (esperado)
                     downstream de D1, no es medición independiente

[Cron 7:03 AM GDL diario]
  └─► Conciliación: D1 vs GA4 browser vs GA4 server vs lead_intake_log
        └─ Detecta fugas direccionales por delta
```

**Ground truth = D1.** GA4 browser = medición independiente. Meta CAPI = canal a optimización. GA4 server = audit del MP fire del Worker.

---

## El folio — join key universal

**Formato:** `GP-{MARCA-CODE}-YYMMDD-HHMMSS` (hora GDL).

**Ejemplo:** `GP-SEM-260425-023219` = Seminuevos, 25-abr-2026, 02:32:19 GDL.

**Marca code:** `SEM`, `HYU`, `STL`.

**Por qué importa:** sin folio compartido, GA4 vs D1 vs CAPI solo se comparan a nivel agregado (counts) → confunde tests con conversiones reales. Con folio: JOIN exacto cita por cita.

**Equivalencia con D1:** `leads.fecha_registro` se persiste UTC. Reconstrucción del folio = restar 6h, formatear `YYMMDD-HHMMSS`, prefijar `GP-{CODE}-`.

**Markers TEST/QA:** cualquier registro con `pipeline.etapa = 'TEST/QA'`, `leads.pipeline_etapa = 'TEST/QA'`, o `leads.fuente = 'TEST/QA'` se excluye de métricas de negocio. Convención fijada el 26-abr.

### Doc hijo
- `03-tech/Folio-Cita.md` — formato canónico, especiales (tests), heurísticas de exclusión

---

## GA4 — 69 custom dimensions

3 properties × 23 dims event-scoped. Margen actual: 27 vs tope 50 por property.

**Categorías:**

| Tipo | Dims (×3 properties) | Para qué |
|---|---|---|
| Core | folio, cash_only, down_pct, term_months, sede, vehicle_brand, vehicle_year | Join + segmentación financiamiento + sucursal |
| Tracking | fbclid, meta_ad_id, meta_placement | Atribución Meta (no Google — gclid es nativa) |
| Form | vehicle_version, monthly_payment, tipo_persona, busca_financiamiento, comprueba_ingresos, auto_a_cuenta, appointment_date, appointment_time, accept_marketing | Comportamiento del form |
| Promo | promo_id, promo_label, promo_value, promo_type | Tracking de oferta vigente |

**`gclid` viene como dim nativa** vía integración Google Ads ↔ GA4 auto-tag — no se puede crear manualmente.

**`user_id = folio`** en GTM tag GA4 Event v14 — cierra el loop cross-session.

---

## Meta CAPI — server-side desde Worker

**Conversiones que envía el Worker:**

| Evento | Cuándo dispara | event_id (dedup) |
|---|---|---|
| `Lead` | Al recibir POST /api/lead/:marca (1ra ingestión) | `{folio}_Lead` |
| `VISITA` (custom event vía CAPI) | Frontend kanban al mover a "Visita Realizada" | `{FOLIO}-VISITA` |
| `Compra` | Frontend kanban al mover a "Ganada" + VIN + valor cierre | `{FOLIO}-COMPRA` |

**Dedup:** Meta combina Pixel browser + CAPI por event_id. Reenviar con mismo event_id se descarta (no duplica). Con event_id distinto, duplica (BUG).

**Token CAPI:** 1 token compartido (System User del BM corporativo `313259579011657`). Acceso a los 3 pixels.

---

## GA4 Measurement Protocol — server-side desde Worker

Mismo trigger que CAPI: dispara `generate_lead` server-side al INSERT exitoso en D1.

**Limitación de diseño:** GA4 server-side reporta:
- `sessionSource = (not set)`
- `sessions = 0`
- `page = (not set)`

Es downstream de D1, no medición independiente. Solo audita salud del MP fire — no se compara contra browser.

---

## Conciliación diaria (el watchdog)

**Qué cruza:**

1. D1 `leads` (ground truth backend)
2. D1 `lead_intake_log` (failsafe — incluye errores)
3. GA4 `generate_lead` browser-side (medición independiente)
4. GA4 `generate_lead` server-side (downstream de D1)

**Deltas direccionales:**

| Delta | Fórmula | Si > 0 | Si < 0 |
|---|---|---|---|
| `delta_server` | D1 − GA4 server | Worker dejó de disparar MP (cruzar con `ga4mp_fail`) | MP server extra fuera de flow (curl, tests) |
| `delta_browser` | D1 − GA4 browser | 🔴 **Fuga gtag** (adblocker, JS error, FB In-App) | 🔴 **Fuga backend** (CORS, POST falla, dual-fire gtag) |

**Por qué split server/browser:** comparar D1 vs GA4 *total* mide lo mismo dos veces (Worker dispara MP server después de cada insert). La fuga real solo se detecta con browser-side.

**Output:** JSON snapshot committed al repo + Slack/email con flags rojos.

### Doc hijo
- `03-tech/Conciliacion-Diaria-Citas.md`

---

## Reglas de métricas: Plataforma vs Negocio

**Vigente desde 28-abr-2026.** Las dos vistas NUNCA se mezclan en la misma sección sin etiqueta.

| Vista | Audiencia | Métrica clave | Fuente | Etiqueta |
|---|---|---|---|---|
| **Plataforma** | MKT operativo, agencias, Meta/Google account managers | **Costo por Conversión** | Meta Ads / Google Ads / GA4 | "Costo por Conversión", "CPC plataforma", "Costo por lead Meta" |
| **Negocio** | Consejo, dirección, RevOps | **Costo por Deal / Cita** | D1 | "Costo por Deal", "Costo por Cita", "CPA real" |

**Filtros del negocio:** se excluye `etapa = 'TEST/QA'` y `fuente = 'TEST/QA'` siempre. Timestamp = `leads.fecha_registro` (NO `pipeline.fecha_creacion`, que fue overrideado por el cutover D1 del 24-abr).

### Doc hijo
- `03-tech/Reglas-Metricas-Plataforma-vs-Negocio.md`

---

## URL parameter template (Meta Ads)

**Crítico** porque las 3 marcas corren en paralelo con Meta + Google. Sin template:
- `meta_ad_id` y `meta_placement` llegan vacíos en GA4
- Atribución se contamina con auto-tag de Google

**Params dinámicos:** `{{campaign.name}}`, `{{ad.id}}`, `{{placement}}`.

**Status:** flagged como pendiente desde 24-abr (campañas LIVE), aún sin verificar implementación end-to-end.

---

## Gotchas conocidos

1. **CAPI 200 ≠ value útil.** Postmortem 25-abr: 3 leads viajaron con `value=0` por mismatch de nombres legacy/canónico. Validar payload, no solo status code.
2. **`event_id` con mismo folio se descarta.** No reenviar para "fixear" — el evento original ya está consumido por Meta.
3. **`lead_intake_log` es la red de seguridad.** Si algo se rompe, leer ahí para reconstruir manualmente.
4. **GA4 server-side no es medición independiente.** Comparar D1 vs GA4 server detecta fallos de MP fire, no fugas reales.
5. **Folios con formato no canónico = excluir.** Los tests propios de Claude se cruzan contra D1 antes de declarar gap (lección 26-abr).
6. **Decimal de `down_pct`:** se almacena como `0.20` (no `20`).

---

## Atajo: el agente busca…

- "GA4 dice X leads, kanban dice Y" → `Conciliacion-Diaria-Citas.md` + cruzar folios
- "no aparece value en Meta Ads" → revisar payload con `applyPayloadAliases` (legacy → canónico)
- "agregar nueva custom dim" → KO-Operativo §Update 24-abr + script `/tmp/create_ga4_dims_phase3.py` (token OAuth en iCloud)
- "deduplicate Pixel↔CAPI" → `Folio-Cita.md` + verificar `event_id`
- "qué métrica decirle al Consejo" → `Reglas-Metricas-Plataforma-vs-Negocio.md` (vista Negocio)
