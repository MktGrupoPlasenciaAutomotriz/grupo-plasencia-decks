# MAP-Plasencia — Mapa de navegación del Motor de Atribución

> **Para qué sirve:** este archivo es el primer doc que abre cualquier agente Claude (o humano) que aterriza en el proyecto. Decide **qué leer y en qué orden** según la tarea. Es un índice, no contiene contenido — apunta a los docs reales.

> **Mantenimiento:** cuando agregues un doc nuevo en `03-tech/`, `02-design/` o `01-strategy/`, registra una línea en la tabla de "Decisión por intent". Si no aparece en este MAP, no existe para futuros agentes.

> **Última verificación de vínculos:** 2026-05-06

---

## Estado vivo (al 2026-05-06)

- ✅ **Catálogo Seminuevos XML-first** (cutover 06-may). Fuente única de verdad: feed XML oficial de Maxipublica S3 (`vehicle_feed_group_e1490ae1e92f.xml`, ~639 listings, refresh horario). Sustituye el scraping del API JSON privado de seminuevosplasencia.com (retirado, cero deuda técnica). Cron pasó de diario 04:03 GDL a horario `:04` cada hora. D1 limpia (273 huérfanos sweep aplicado, 639 activos = feed, 181 piloto). Modal PDP con ficha técnica ampliada + equipamiento colapsable (162/181 autos con equipamiento parseado). Cero invenciones: si un campo no está en el XML directo o no matchea regex acotado del `<description>`, queda vacío y la UI omite el chip. TRIM eliminado (no estructurado en feed). Doc actualizada: [`03-tech/Catalogo-Seminuevos-Sync-D1.md`](../03-tech/Catalogo-Seminuevos-Sync-D1.md).
- ✅ **Airtable eliminado del piloto** (cerrado 05-may). Cuenta cerrada por el director. Catálogo Stellantis congelado en JSON estático (workflow disabled, rehacer después).
- ✅ **CRM con tracking GA4** (`G-PPEPCW309W`, property `Pipeline de GP` `536115689`). Eventos `login`, `session_resume`, `contact_click` (call/whatsapp/email). 11 custom dimensions registradas. Doc: [`03-tech/Tracking-CRM-GA4.md`](../03-tech/Tracking-CRM-GA4.md).
- ✅ **Calendar 1-may bloqueado** en las 3 landings. `BLOCKED_DATES` extensible.
- ✅ **Catálogo SEM** "Catálogo del mes · Bonos hasta $20,000", vigencia 22-abr a 10-may.
- ✅ **Kanban** distingue **fecha de registro** vs **fecha de cita**. Toggle de orden en toolbar.
- ✅ **3 marcas LIVE** (Seminuevos, Hyundai, Stellantis). Solo Seminuevos gastando en Meta — Hyundai/Stellantis paused desde 23-abr.
- 🟡 **Bajada de leads SEM mayo**: 1 lead en lo que va vs 18 baseline 2da quincena abril. Verificación e2e: cero fugas en infra (D1 + intake_log + conciliación). Cuello upstream (gasto Meta o tráfico). Pendiente revisar gasto Meta SEM últimos 7d.
- ✅ **CRM Worker D1-only** — `crm-plasencia.grupo-plasencia-automotriz.workers.dev`, version `ac5e209c`. Airtable Pipeline apagado.
- ✅ **Dashboard ejecutivo** live en tab `/dashboard` — cron diario 8AM GDL.
- ✅ **Conciliación diaria** D1 vs GA4 browser/server — cron 7:03 AM GDL.
- ✅ **Sistema MAP-Plasencia + 6 pillars** deployed (29-abr) — re-contextualización en <2 min.
- 🟡 **Experiencia Plasencia Automotriz** (naming cerrado 29-abr) — iniciativa estratégica de arquitectura de marca + sistema de marketing integral del grupo. Reframe del problema: no es "always-on de ads", es **modelo Endorsed brands** con 4 niveles (Grupo · sub-marcas propias · concesionarios marca-OEM · vendedores). Caso especial Stellantis: nivel 3 con sub-niveles (RAM/Jeep/Dodge/Fiat/Peugeot). Materialización de visión Phygital ya formulada por Chucho. **Framing v2 producido:** [`01-strategy/Experiencia-Plasencia-Automotriz-Framing.md`](../01-strategy/Experiencia-Plasencia-Automotriz-Framing.md). Próximo paso: validación 1:1 con Pepe Morales antes de escalar. Orden secuencial obligatorio: Pepe → Consejo → Carlos Nava → Gerentes MKT → Marcas OEM.
- ✅ **Deep Research Marketplace mundial 2026 — EJECUTADO + PAPER EJECUTIVO** (6-may) — output disponible en [`01-strategy/Deep-Research-Output-Marketplace-Plasencia.md`](../01-strategy/Deep-Research-Output-Marketplace-Plasencia.md) (~50KB, 420 líneas) + paper A4 de 13 páginas en [`01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html`](../01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html) con sistema de diseño corporativo (Navy + Gold + Red, Playfair Display + Inter). Hallazgos clave: (1) modelo "concesionario unificado bajo marca-paraguas con motor digital propio" ganó el debate global 2024-2026 (Lithia, Asbury, Group 1, AutoNation, Sonic+EchoPark, Pendragon, Inchcape); (2) modelo 100% digital sin piso es anti-patrón documentado (Cazoo £1.4B quemados, Vroom liquidado, Honda US discontinuado); (3) modelo "agency" europeo en repliegue (Ford abandonó, Stellantis suspendió, VW revirtió); (4) sub-marca de seminuevos rentable es patrón ganador con disciplina; (5) financiera cautiva = 2do motor de utilidad y captura de CLTV; (6) stack 2026 converge en CRM+CDP+CAPI+conversational AI; (7) capacidad apalancada por IA es la palanca real, no headcount. Brief original: [`01-strategy/Deep-Research-Brief-Marketplace-Plasencia.md`](../01-strategy/Deep-Research-Brief-Marketplace-Plasencia.md). Próximo paso: insumo para Marco Operativo Experiencia Plasencia Automotriz.
- 🟢 **Concepto Always-On Seminuevos + 13 creativos Reels generados** (29-abr noche) — `01-strategy/Always-On-Seminuevos-Concepto.md` con plan operativo + 13 PNGs 9:16 con texto en `Always-On Seminuevos/v2/` (bypass del repo de docs). Para budget $650/día: 5 conceptos seleccionados (c01, c07, c09, c11, c13). Copy Meta listo: 5 textos primarios, 5 headlines, 5 descripciones rotables. Pendiente: subir a Ads Manager.
- 🟡 **Stellantis 0 leads reales desde cutover** — confirmar tracking.
- 🟡 **8 imágenes Stellantis** pendientes (Peugeot/Dodge).
- ✅ **Doc landings a nivel código publicado** (29-abr noche) — `03-tech/Landings-Arquitectura-Codigo.md` con stack común, tabla de divergencias por marca, 25 eventos dataLayer, 15 gotchas técnicos.
- 🟡 **Acceso cross-Claude del sistema MAP pendiente de decisión** (29-abr noche) — el sistema funciona en Claude Code local en la Mac de Chucho, no en claude.ai web ni cross-device sin clonar el repo. Decisión pendiente: ¿mirror público parcial (MAP + pillars, sin framing sensible) tipo `grupo-plasencia-decks-public`? Detalle en `04-sessions/2026-04-29-work-session.md` Addendum 2.
- 🟡 **`vendedor_digital` hardcoded en HYU/STL** (`ALEJANDRO VAZQUEZ`, `MIGUEL TORRES`) — deuda técnica detectada 29-abr, normalizar a variable como Seminuevos.
- 🟡 **Backlog dashboard:** SLA 7d series, Google Ads cableado, Clarity smart events.

> Para detalle de cualquier ítem, ver `00-context/KO-Operativo.md` (doc vivo, último update al inicio).

---

## Decisión por intent

Si la tarea o pregunta del usuario trata de algo en la columna izquierda, abre los docs en este orden:

| Intent | Lee primero | Profundiza después |
|---|---|---|
| Estado actual del piloto | `00-context/KO-Operativo.md` (últimos 3 updates) | `04-sessions/<fecha-más-reciente>` |
| Visión / objetivo / WIIFM stakeholders | `00-context/KO-Estrategico.md` | `00-context/Propuesta-Valor-Oficial.md` |
| Vocabulario (cita vs lead vs pipeline) | `00-context/Glosario.md` | — |
| Cómo funciona ingesta de leads | `03-tech/D1-CAPI-MP-Server-Side-Architecture.md` | `03-tech/Folio-Cita.md`, `03-tech/CRM-Worker-Arquitectura.md` |
| Reglas del kanban / vendedores | `03-tech/CRM-Pipeline-Reglas-de-Negocio.md` | `03-tech/CRM-Access-Control.md` |
| Acceso por marca / PINs | `03-tech/CRM-Access-Control.md` | — |
| Métricas / dashboard ejecutivo | `03-tech/Dashboard-Metricas-Implementacion.md` | `03-tech/Dashboard-Metricas-Diseno.md`, `03-tech/Reglas-Metricas-Plataforma-vs-Negocio.md` |
| Conciliación D1 vs GA4 (fugas) | `03-tech/Conciliacion-Diaria-Citas.md` | `03-tech/Folio-Cita.md` |
| Cambio en una landing (código, JS, payload) | `03-tech/Landings-Arquitectura-Codigo.md` | Repo: `catalogo-seminuevos-piloto` / `landing-hyundai-plasencia` / `landing-stellantis-plasencia` · `02-design/Design-System-Multi-Marca.md`, `02-design/UX-CRO-Patterns.md`, `03-tech/audits/Auditoria-CRO-UX-<marca>.md` |
| Diseño visual / tokens / consistencia | `02-design/Design-System-Multi-Marca.md` | `02-design/Design-System-Cards-y-Consistencia.md`, `02-design/GP-Design-System-Original.md` |
| Catálogo de autos (Seminuevos sync D1) | `03-tech/Catalogo-Seminuevos-Sync-D1.md` | `00-context/Anexo-Integracion-MaxiPublica.md` |
| Catálogo de autos (flujo histórico Airtable, retirado 5-may) | `03-tech/Catalogo-Seminuevos-Flujo-E2E.md` | contexto histórico |
| Strategy definition / pitch al Consejo | `01-strategy/Strategy-Definition-MKT-Corporativo-AI-powered.md` | `01-strategy/Centro-Excelencia-MKT-Consejo-Deck.html`, `01-strategy/Motor-de-Atribucion-MVP-Playbook-Operativo.html` |
| Experiencia Plasencia Automotriz (arquitectura marca + sistema mkt + comercial) | `01-strategy/Experiencia-Plasencia-Automotriz-Framing.md` | `00-context/KO-Estrategico.md` (datos cuantitativos), `01-strategy/Strategy-Definition-MKT-Corporativo-AI-powered.md`, deck Motor de Atribución slide 18 |
| Concepto Always-On Seminuevos (Meta Ads Andromeda 2026) | `01-strategy/Always-On-Seminuevos-Concepto.md` | Skill `meta-ads-andromeda`, `00-context/KO-Operativo.md` §funnel digital, `03-tech/Landings-Arquitectura-Codigo.md` (eventos + payload) |
| Investigación benchmark mundial marketplace automotive — brief, output y paper ejecutivo | `01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html` (paper A4, 13 páginas, look&feel corporativo Navy+Gold+Red) | `01-strategy/Deep-Research-Output-Marketplace-Plasencia.md` (output completo), `01-strategy/Deep-Research-Brief-Marketplace-Plasencia.md` (brief), `01-strategy/Experiencia-Plasencia-Automotriz-Framing.md`, `00-context/KO-Estrategico.md` |
| Stakeholder específico (Vero/Bere/Jose) | `05-stakeholders/Minuta-<Marca>-<Nombre>.md` | `00-context/KO-Estrategico.md` §Stakeholders |
| GTM / GA4 dimensions / Pixels (landings) | `00-context/KO-Operativo.md` §Update 24-abr | memory `reference_gtm_mcp_version_bug.md` |
| Tracking del CRM (login, session_resume, contact_click, user_id/PIN) | `03-tech/Tracking-CRM-GA4.md` | `pillars/MAP-Tech.md`, `pillars/MAP-Datos-Atribucion.md` |
| Seguridad / tokens / OAuth | `03-tech/Security-Audit-E2E.md` | `03-tech/Credenciales-y-Tokens.md`, memory `reference_claude_code_setup.md` |
| Microsoft Clarity (MCPs por marca) | `03-tech/Microsoft-Clarity-MCP-Setup.md` | — |
| Funnel events Visita/Compra (Pipeline → CAPI) | `03-tech/Airtable-Funnel-Tables-Automations.md` (vigente, ver corrección 21-abr) | `03-tech/D1-CAPI-MP-Server-Side-Architecture.md` |
| Backlog / qué viene después del MVP | `00-context/Backlog-Post-MVP.md` | `03-tech/Backlog-CAPI-MP-Directo.md` (cerrado, contexto histórico) |

---

## Pillars temáticos (para vista panorámica de un dominio)

Si quieres entender un dominio completo antes de bajar a docs específicos, abre el pillar correspondiente. Cada pillar es 1 página: qué cubre, docs hijos, gotchas conocidos.

| Pillar | Cuándo abrirlo |
|---|---|
| [`pillars/MAP-Producto.md`](pillars/MAP-Producto.md) | Trabajo en una landing, kanban CRM o dashboard ejecutivo (lo que ven usuarios) |
| [`pillars/MAP-Tech.md`](pillars/MAP-Tech.md) | Worker, D1, deploys, secrets, observability, crons |
| [`pillars/MAP-Datos-Atribucion.md`](pillars/MAP-Datos-Atribucion.md) | Folio, GA4 dims, Meta CAPI, conciliación, dedup, atribución |
| [`pillars/MAP-Diseno.md`](pillars/MAP-Diseno.md) | Design system, tokens, mobile, UX/CRO, copy |
| [`pillars/MAP-Estrategia.md`](pillars/MAP-Estrategia.md) | Strategy definition, decks, propuesta valor, narrativa al Consejo |
| [`pillars/MAP-Operacion.md`](pillars/MAP-Operacion.md) | Reglas CRM, vendedores, citas, SLA, conciliación operativa, stakeholders |

---

## Vocabulario crítico (no negociar)

Ver `00-context/Glosario.md` para el catálogo completo. Lo esencial:

- **Motor de Atribución MVP** = el proyecto e2e completo (alcance negocio).
- **cita** = unidad de negocio. Lo que entra de landing y opera el vendedor.
- **oportunidad calificada** = lo mismo que cita. Usar este término en copy ejecutiva, NO "lead".
- **`leads`** = nombre técnico de la tabla D1 (no renombrar).
- **`pipeline`** = tabla D1 de operación post-cita.
- **kanban** = vista UI del vendedor (5 columnas).
- **lead** = solo cuando se referencien métricas externas (Meta, GA4).
- **folio** = `GP-{SEM|HYU|STL}-YYMMDD-HHMMSS`. Join key entre todos los sistemas.

---

## Reglas no negociables (resumen)

Detalladas en `~/Documents/grupo-plasencia-docs/CLAUDE.md` y `~/Documents/Grupo Plasencia/CLAUDE.md`. Lo crítico:

1. **Plataforma vs Negocio nunca se mezclan en la misma sección.** Ver `03-tech/Reglas-Metricas-Plataforma-vs-Negocio.md`.
2. **Seminuevos = canónico de UX/UI.** Hyundai y Stellantis son clones 1:1.
3. **Sin secretos en Git.** Tokens en iCloud (`~/Documents/Claude Code Setup/`) o Cloudflare Workers secrets.
4. **No em dashes** en comms ejecutiva (parece IA).
5. **GTM:** crear workspace dedicado antes de cualquier cambio (Default Workspace rompe `create_version`).
6. **Al cerrar sesión:** crear `04-sessions/YYYY-MM-DD-work-session.md` + actualizar `KO-Operativo.md` con bloque `## Update YYYY-MM-DD` al inicio.

---

## Workflow del agente al aterrizar

1. Lee `MEMORY.md` (auto) + `CLAUDE.md` raíz (auto).
2. Lee este `MAP.md`.
3. Según la primera pregunta del usuario, decide:
   - ¿Necesita panorama de un dominio? → abre el pillar L2 correspondiente.
   - ¿Pregunta concreta? → salta a los docs L3 de la tabla de intents.
4. Solo entonces toca repos de código (L4) si se requiere implementación.

Tiempo objetivo de re-contextualización: **<2 minutos / ~3K tokens**.

---

## Regla obligatoria — antes de escribir docs estratégicos

**Si vas a escribir un documento estratégico** (cualquier cosa en `01-strategy/` que cite datos del negocio: revenue, marcas, mix, agencias, plantilla, gastos, CAC, conversión, organigrama, stakeholders, historia, intentos previos), **leer `00-context/KO-Estrategico.md` íntegro es obligatorio antes de empezar.** No es opcional. No es "si recuerdo algo, lo amplío". Es paso 1.

**Por qué esta regla existe:** el 29-abr-2026 escribí el primer borrador del Framing de Experiencia Plasencia Automotriz con placeholders tipo *"pendiente de validar el inventario completo de marcas"* cuando el KO-Estratégico ya tenía las 8 marcas enumeradas, mix de unidades 2025, CAC por marca, historia del intento previo de Daniel Galindo, organigrama corporativo y datos de co-inversión OEM. Chucho tuvo que corregirme: *"no especules deberías tener contexto de negocio en el KO."* Tenía razón. Si esta regla hubiera estado escrita, no hubiera pasado.

**Qué hacer cuando el KO no cubre algo:** marcar explícitamente en el doc *"esto no aparece en KO-Estrategico, pendiente de validar con Chucho"*. Eso es honesto. Especular sin avisar no lo es.
