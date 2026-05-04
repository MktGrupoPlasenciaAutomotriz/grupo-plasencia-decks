# Pillar — Tech (Worker, D1, deploys, secrets, crons)

> Visión panorámica de la **infraestructura técnica** del Motor de Atribución. Cubre el Cloudflare Worker, la base D1, secrets, deploys, observability y los crons. Es índice. Para detalle, abre los docs hijos.

---

## Stack al 2026-04-29

```
Cloudflare Workers (crm-plasencia)
├── D1 Database (crm-plasencia-db, id ad3e7ad8-55e0-4436-941a-6e299638af8e)
├── Cloudflare Access (SSO @grupoplasencia.com)
├── Workers Observability ON (head_sampling 1.0, logs 7d)
└── Wrangler config: crm-worker (privado)

GitHub Pages (3 landings)
├── catalogo-seminuevos-piloto → seminuevos.grupoplasencia.com
├── landing-hyundai-plasencia  → hyundai.grupoplasencia.com
└── landing-stellantis-plasencia → stellantis.grupoplasencia.com

Tracking layer
├── GTM GTM-WKV7LZ7T (v14 LIVE, 22 DLVs nuevos)
├── GA4 (3 properties bajo cuenta 390891682)
├── Meta Pixel (3 pixels bajo BM 313259579011657)
└── Microsoft Clarity (3 projects, MCPs activos)

Crons (GH Actions)
├── 04:03 GDL (10:03 UTC) — sync catálogo Seminuevos → JSON commit
├── 07:03 GDL (13:03 UTC) — conciliación diaria D1 vs GA4
└── 08:00 GDL (14:00 UTC) — refresh dashboard cache (60min después)
```

---

## El Worker `crm-plasencia` (corazón del sistema)

**Ruta del código:** repo privado `crm-worker`, archivo principal `src/index.js`.

**Endpoints expuestos:**

| Endpoint | Quién llama | Qué hace |
|---|---|---|
| `POST /api/lead/:marca` | Las 3 landings | applyPayloadAliases → lead_intake_log → INSERT D1 (leads + pipeline) → Promise.all (CAPI + GA4 MP) → INSERT events |
| `GET /` | Vendedor (post-SSO+PIN) | Sirve HTML kanban (assets binding) |
| `GET /api/d1/leads/:marca` | Frontend kanban | Lista leads filtrados por marca |
| `GET\|POST\|PATCH /api/d1/pipeline/:marca` | Frontend kanban | CRUD pipeline + auto-events en cambio de etapa |
| `GET /api/vendedores` | Frontend kanban | Vendedores por marca |
| `GET /dashboard` | Director MKT (PIN brand=all) | Sirve HTML dashboard ejecutivo |
| `GET /api/dashboard?marca=X&from=&to=` | Frontend dashboard | Cache GA4/Meta + queries live D1 (compuesto) |
| `GET /healthz` | Monitor | Status |

**Versions notables (changelog rápido):**
- `d1fea7e3` (17-abr) — Access + PAT server-side + access control por marca
- `fbbc0766` (25-abr) — cutover D1-only, eliminó `handleLegacyApi`
- `4069d032` (25-abr tarde) — `applyPayloadAliases` + `lead_intake_log` + Observability ON
- `eff42811` (26-abr) — fix `relDate()` "hace -1 día"
- `53516374` (26-abr) — filtro `VALID_STAGES` en stats (excluye TEST/QA)
- `2a02bd57` (28-abr tarde) — F5 hero operativo + refactor copy "oportunidad calificada"
- `9158b834` (28-abr noche) — F6 warehouse BI: `pipeline_events` + `kanban_daily_snapshots` + fechas custom

### Docs hijos
- `03-tech/CRM-Worker-Arquitectura.md` — infra, deploys, ops, trayectoria
- `03-tech/D1-CAPI-MP-Server-Side-Architecture.md` — backend e2e, CAPI/MP, dedup, payload
- `03-tech/CRM-Access-Control.md` — Cloudflare Access + PIN gate

---

## D1 Schema (`crm-plasencia-db`)

| Tabla | Rol | Migration |
|---|---|---|
| `leads` | PII hashed SHA-256, fecha_registro UTC, fbclid/UTMs, financiamiento, vehículo de entrada | 0001 |
| `pipeline` | 1:1 con leads, etapa kanban, vendedor, VIN, valor cierre, VEHICULO CERRADO | 0001 |
| `events` | Snapshots de conversión (Lead/Visita/Compra) con CAPI/GA4 status | 0001 |
| `audit_log` | Transiciones de etapa (timestamp, vendedor, motivo) | 0001 |
| `vendedores` | Catálogo + rol + sucursales | 0001 |
| `sucursales` | Catálogo de lotes/sucursales | 0001 |
| `lead_intake_log` | Failsafe — raw_body + payload + status de TODA llamada a `/api/lead/:marca` | 0004 |
| `dashboard_metrics_cache` | PK `(metric_key, marca, fecha)` — cache GA4/Meta histórico | 0007 |
| `pipeline_events` | Event sourcing del kanban (created/stage_change/won/lost/updated) con timestamp + fecha GDL | 0008 |
| `kanban_daily_snapshots` | Estado del kanban al cierre de cada día | 0008 |

---

## Secrets y tokens

**Dónde viven:**
- **Cloudflare Workers secrets** (via `wrangler secret put`): tokens de runtime del Worker (CAPI, GA4 MP, etc.)
- **GitHub Actions secrets** (`crm-worker` repo): tokens de crons (META_ACCESS_TOKEN, CLOUDFLARE_D1_RW_TOKEN, GA4 OAuth)
- **iCloud `~/Documents/Claude Code Setup/`**: master copies + OAuth credentials humanos. NUNCA en Git.

**Tokens críticos en producción:**

| Token | Scope | Rota cuando |
|---|---|---|
| `META_ACCESS_TOKEN` (System User) | ads_read, business_management | 60d (long-lived) |
| `CLOUDFLARE_D1_RW_TOKEN` | D1:Edit | Manual |
| GA4 OAuth | analytics.edit | Refresh automático |

**Eliminados:**
- `AIRTABLE_PAT` (revocado 25-abr post-cutover)

### Docs hijos
- `03-tech/Credenciales-y-Tokens.md` — qué token sirve para qué, ubicación canónica
- `03-tech/Security-Audit-E2E.md` — auditoría completa, vectores cerrados
- `03-tech/Dashboard-Metricas-Implementacion.md` §"cómo regenerar cada token"

---

## Crons y automatizaciones

| Cron | Hora | Stack | Output |
|---|---|---|---|
| Catálogo Seminuevos | 04:03 GDL diario | GH Action Python (`scraper_seminuevos.py` + `upsert_airtable.py` + `export_catalogo_piloto.py`) | JSON committed al repo `catalogo-seminuevos-piloto` |
| Conciliación citas | 07:03 GDL diario | GH Action Python | JSON snapshot + delta_browser/delta_server |
| Dashboard refresh | 08:00 GDL diario | GH Action — Meta Graph API + GA4 OAuth | INSERTs en `dashboard_metrics_cache` |

### Docs hijos
- `03-tech/Catalogo-Seminuevos-Flujo-E2E.md`
- `03-tech/Conciliacion-Diaria-Citas.md`

---

## GTM, GA4, Pixels (capa tracking)

**GTM:** `GTM-WKV7LZ7T` — v14 LIVE. 22 DLVs nuevos (`dataLayerVersion: 2`). Tag `generate_lead` con 28 eventParameters via `gaawe + measurementIdOverride` por hostname. **`googtag` NO expone gtag global** — Event tags usan `gaawe`.

**GA4 properties** (cuenta `Grupo Plasencia - Corporativo` #390891682):
- Seminuevos `532426498` · `G-W90CJDW2PT`
- Hyundai `532402365` · `G-1B9YQ1R1S2`
- Stellantis `532380072` · `G-5XC5DHEZ92`
- 69 custom dimensions event-scoped totales (23 por property, margen 27 vs tope 50)

**Meta Pixels** (BM `313259579011657`):
- Hyundai `936887619059563` · Stellantis `1482920373426143` · Seminuevos `802366802496336`

**Microsoft Clarity:** 3 projects, MCPs activos (`clarity-hyundai`, `clarity-stellantis`, `clarity-seminuevos`).

### Docs hijos
- `03-tech/Microsoft-Clarity-MCP-Setup.md`
- Memory `reference_gtm_mcp_version_bug.md` — bug create_version en Default Workspace

---

## Gotchas conocidos

1. **GTM Default Workspace rompe `create_version`.** SIEMPRE crear workspace dedicado antes de cualquier cambio grande.
2. **Validar payload, no solo HTTP 200.** El postmortem 25-abr (3 leads value=0) demostró que CAPI 200 + GA4 204 no garantizan que el evento llegue con valor útil.
3. **`event_id = {folio}_Lead`** es la dedup Pixel↔CAPI. Reenviar con mismo event_id se descarta. Con event_id distinto duplica.
4. **`event_id = {FOLIO}-VISITA` / `-COMPRA`** para conversiones del kanban (post-Cita).
5. **GA4 server-side reporta sessionSource = (not set)** por design — no es métrica independiente.
6. **`gclid` no se crea como custom dim** — GA4 la trata como reservada (intentar crearla devuelve 400). Viene como dim nativa via auto-tag.
7. **Hash de PII (SHA-256)** se aplica antes de INSERT en D1. PII raw nunca queda en DB.

---

## Atajo: el agente busca…

- "cómo deployar el Worker" → `CRM-Worker-Arquitectura.md` §deploys
- "cómo agregar un campo al pipeline" → `D1-CAPI-MP-Server-Side-Architecture.md` §schema + crear migration en `crm-worker/migrations/`
- "el dashboard no carga datos" → `Dashboard-Metricas-Implementacion.md` §troubleshooting
- "se rompió un cron" → KO-Operativo §último update + GH Actions logs del repo correspondiente
- "rota un token" → `Credenciales-y-Tokens.md` o `Dashboard-Metricas-Implementacion.md` §"cómo regenerar"
