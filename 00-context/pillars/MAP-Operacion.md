# Pillar — Operación (CRM, vendedores, citas, SLA)

> Visión panorámica de **cómo opera el Motor de Atribución día a día**: reglas del CRM, vendedores, SLA, conciliación operativa, qué hacer cuando algo falla. Es índice. Para detalle, abre los docs hijos.

---

## El flujo operativo de una cita

```
[Lead nuevo entra]
  Landing → POST /api/lead/:marca → D1 leads + pipeline (etapa: Cita Agendada)
  Notifica al vendedor de la marca via PIN del kanban

[Vendedor opera]
  Kanban → toma la card → contacta cliente → confirma cita
  Mueve a "Visita Realizada" cuando cliente llega al lote
        └─ Frontend dispara CAPI Visita + INSERT events
  Mueve a "Negociación" cuando hay propuesta activa
  Cierra "Ganada" con VIN + valor cierre + ≤7 días
        └─ Frontend dispara CAPI Compra + INSERT events
  O cierra "Perdida" con motivo

[Cron 7:03 AM GDL diario]
  Conciliación valida que todas las citas reales
  estén consistentes en D1 + GA4 + Meta CAPI
```

---

## Reglas de etapas (kanban)

**5 etapas válidas:**

```
Cita Agendada → Visita Realizada → Negociación → Ganada
                                                 └─→ Perdida
```

**Lo que el frontend renderiza:** SOLO estas 5. Cualquier registro con etapa fuera (incluyendo legacy `'Nuevo'`) queda invisible.

**Marker `TEST/QA`:** etapa especial para QA propio. Se excluye de stats, search, conciliación, dashboard.

### Reglas críticas por etapa

| Etapa | Requiere para ENTRAR | Excluye |
|---|---|---|
| Cita Agendada | Default al ingestion (post-25-abr) | — |
| Visita Realizada | Vendedor confirma asistencia | — |
| Negociación | Hay propuesta activa | — |
| Ganada | VIN facturado + valor cierre + vendedor asignado + ≤7 días desde cita | — |
| Perdida | Motivo (texto libre) | — |

### Vehículo entrada vs vehículo cerrado

**Problema:** vendedor podía editar `VEHICULO` si cliente cambiaba de auto en piso → se perdía trazabilidad del auto que trajo el tráfico Meta/Google.

**Solución (17-abr):**
- `VEHICULO` (entrada) = readonly post-creación
- `VALOR PIPELINE` (oportunidad) = readonly post-creación
- `VEHICULO CERRADO` = auto que el cliente realmente compró
- `MOTIVO CAMBIO VEHICULO` = por qué cambió (disponibilidad, versión, color, precio…)

**Modal Ganada:**
- Radio default: "¿Compró el mismo auto de entrada?"
  - **Sí** → `VEHICULO CERRADO = VEHICULO`. `VALOR CIERRE` pre-lleno con `VALOR PIPELINE`.
  - **No** → habilita `VEHICULO CERRADO` + `MOTIVO CAMBIO VEHICULO` (ambos requeridos).
- `VALOR CIERRE`, `VIN FACTURADO`, `VENDEDOR ASIGNADO` siempre requeridos.

**Card post-Ganada:**
- Si entrada == cerrado → muestra solo un auto.
- Si distintos → entrada tachado en gris + cerrado destacado en verde.

### Doc hijo
- `03-tech/CRM-Pipeline-Reglas-de-Negocio.md`

---

## Acceso por usuario (PIN gate)

**Por qué PIN, no email:** el header `Cf-Access-Authenticated-User-Email` no llegaba confiable en URLs `.workers.dev` (resolvía a `anon`). Rediseño 17-abr a PIN por usuario en frontend.

**3 capas:**
1. Cloudflare Access (SSO @grupoplasencia.com)
2. Worker proxy + whitelist
3. **PIN por usuario** (USER_PINS) → filtra por marca y sucursal

### Mapeo USER_BRAND (al 17-abr)

| Brand | Usuarios |
|---|---|
| `all` (2) | Chucho Porras, Pepe Morales |
| `hyundai` (6) | Verónica Orozco, 3 mkt, Carlos Ponce, Alessa Funez |
| `stellantis` (1) | Berenice Pérez · Pendientes: 2 Supervisor Digital |
| `seminuevos` (4) | Jose Reyes, Flor Alcaraz (Mazda), Pablo Morales, Jose Ayala · Pendiente: Salvador Jimenez |
| Excluido | Marcela Garcia |

### Doc hijo
- `03-tech/CRM-Access-Control.md`

---

## Vendedores asignación

**Reglas:**
- Cada lead nace sin vendedor (`vendedor = null`).
- Vendedor se asigna explícitamente al tomar la card.
- En Ganada, `VENDEDOR ASIGNADO` es requerido.
- Gerentes y directores quedan en `vendedores` table pero **no aparecen en performance ventas** (filter `rol IN ('vendedor','supervisor')`).

**Refactor mediano plazo:** mover a tabla `usuarios` con rol explícito (no usar `vendedores` para todos).

---

## SLA — 7 días desde cita

**Regla:** una oportunidad que no avanza en 7 días desde Cita Agendada debe levantar alerta. Si llega a Ganada con > 7d, no debería cerrarse así (excepción documentada).

**Cómo se mide:** `pipeline.fecha_creacion` vs ahora. Banderazo en kanban (visual) + en conciliación.

**Backlog:** SLA 7d series sin cablear al `dashboard_metrics_cache` (pendiente al 28-abr).

---

## Conciliación diaria operativa

**Cron 7:03 AM GDL** que cruza D1 vs GA4 vs `lead_intake_log`. Output:
- Snapshot JSON committed al repo
- Deltas direccionales (`delta_browser`, `delta_server`)
- Flags rojos si fuga real

**Lectura operativa:**
- `delta_browser > 0` → leads en D1 que browser GA4 no midió → revisar adblocker, FB In-App browser, JS errors
- `delta_browser < 0` → eventos browser sin lead en D1 → revisar CORS, POST falla, dual-fire gtag
- `delta_server > 0` → MP server no disparó → revisar `lead_intake_log` con `ga4mp_fail`

**Acción semanal sugerida:** revisar conciliación lunes en la mañana, accionar flags antes de meeting con stakeholders.

### Doc hijo
- `03-tech/Conciliacion-Diaria-Citas.md`

---

## Convención TEST/QA

**Vigente desde 26-abr.** Cualquier test futuro debe usar marker `TEST/QA` en:
- `pipeline.etapa = 'TEST/QA'`
- `leads.pipeline_etapa = 'TEST/QA'`
- `leads.fuente = 'TEST/QA'`

**Por qué:** el filtro `VALID_STAGES` y los reportes de negocio excluyen `TEST/QA`. Si no usas el marker, el test se cuenta como cita real e infla métricas.

**Cleanup:** post-validación, marcar como TEST/QA (no borrar) para mantener trazabilidad.

---

## Workflow al cerrar sesión de trabajo

Definido en `~/Documents/grupo-plasencia-docs/CLAUDE.md`. Resumen:

1. Crear `04-sessions/YYYY-MM-DD-work-session.md` con resumen completo.
2. Si hubo cambios de status del piloto → `## Update YYYY-MM-DD` al INICIO de `00-context/KO-Operativo.md`.
3. Si hubo nuevas decisiones técnicas → crear/actualizar `03-tech/...`.
4. Si hubo nuevas reglas de diseño → actualizar `02-design/...`.
5. Si se creó un doc nuevo → registrar 1 línea en `00-context/MAP.md` (intent → doc).
6. Commit: `git add . && git commit -m "session: <fecha breve descripción>"`.
7. Push.

---

## Routing de modelos por tarea

Definido en `grupo-plasencia-docs/CLAUDE.md`. Resumen:

| Tarea | Modelo | Cómo invocar |
|---|---|---|
| Estrategia, framing, juicio, redacción ejecutiva | **Opus** | Main thread |
| Exploración archivos, lectura sesiones, audits | **Sonnet** | `Agent(subagent_type: "explorer-sonnet")` |
| Extracciones mecánicas (listados, conteos, grep) | **Haiku** | `Agent(subagent_type: "extractor-haiku")` |

---

## Pendientes operativos al 2026-04-29

(Snapshot. Source of truth = `KO-Operativo.md`.)

- 🟡 **Stellantis 0 leads desde cutover** — confirmar tracking link / campañas
- 🟡 **3 citas Lun 27 16:00-16:30 sin asignar** (Seminuevos) — avisar Jose Reyes / Flor Alcaraz
- 🟡 **Borrar definitivamente base Airtable vieja** (Chucho)
- 🟡 **8 imágenes Stellantis** (Peugeot/Dodge)
- 🟡 **SLA 7d series** sin cablear al dashboard cache
- 🟡 **Google Ads** sin cablear al piloto
- 🟡 **Clarity smart events** MCPs instalados pero no se persisten en cache

---

## Gotchas conocidos

1. **Cita > 7 días en Ganada = excepción.** Documentar motivo, no naturalizar.
2. **VEHICULO entrada NUNCA se edita post-creación.** Si cambió, captura va en VEHICULO CERRADO.
3. **`fecha_registro` (UTC en D1) != hora del folio (GDL).** Convertir antes de comparar.
4. **`pipeline.fecha_creacion` fue overrideado el 24-abr** durante cutover D1 — usar `leads.fecha_registro` para análisis temporales del lead.
5. **Decimal de `down_pct` se almacena como `0.20`** (no `20`). Validar al construir métricas de financiamiento.
6. **Stat "Deals" filtra por VALID_STAGES.** Si un deal aparece en search pero no en stats, revisar etapa.

---

## Atajo: el agente busca…

- "vendedor no ve un lead" → `CRM-Access-Control.md` §USER_BRAND + verificar PIN
- "cómo se cierra una Ganada" → `CRM-Pipeline-Reglas-de-Negocio.md` §Ganada
- "alerta SLA 7d disparada" → conciliación + `Dashboard-Metricas-Implementacion.md`
- "test no aparece en kanban" → revisar etapa = TEST/QA + filter
- "stellantis sin leads" → cruzar Meta Ads + tracking link + GA4 sessionSource
- "qué métrica decirle al stakeholder" → `Reglas-Metricas-Plataforma-vs-Negocio.md`
