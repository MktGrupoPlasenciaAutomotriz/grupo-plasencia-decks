# MAP-Plasencia — Mapa de navegación del Motor de Atribución

> **Para qué sirve:** este archivo es el primer doc que abre cualquier agente Claude (o humano) que aterriza en el proyecto. Decide **qué leer y en qué orden** según la tarea. Es un índice, no contiene contenido — apunta a los docs reales.

> **Mantenimiento:** cuando agregues un doc nuevo en `03-tech/`, `02-design/` o `01-strategy/`, registra una línea en la tabla de "Decisión por intent". Si no aparece en este MAP, no existe para futuros agentes.

> **Última verificación de vínculos:** 2026-05-06

---

## Estado vivo (al 2026-05-13 tarde)

- 🟡 **Pivote Landings Lite implementado, pendiente merge a main** (13-may). Las 3 landings (Seminuevos canónico + HYU + STL clones) refactorizadas de form 5 steps con calculadora+agenda → 1 step solo datos contacto. Branch `feat/landing-lite-2026-05` en los 3 repos + worker en `feat/meta-leadgen-webhook` commit `d57bb4c`. Backup integral con tags `v-pre-lite-2026-05-13` + copia física. Test e2e validado: CAPI 200 + GA4 204 + vendedor real asignado vía round-robin server-side. Worker acepta `etapa: 'POR CONTACTAR'` + normaliza `pipeline_etapa` consistente entre `leads` y `pipeline`. Eventos GA4 preservados (view_item, form_start, generate_lead, virtual_pageview, filter_*); eliminados los irrelevantes al nuevo flujo (calc_*, calendar_*, form_step_*). Target post-deploy 2.5-3.5x leads. Doc: [`03-tech/Landings-Lite-Arquitectura.md`](../03-tech/Landings-Lite-Arquitectura.md), sesión: [`04-sessions/2026-05-13-work-session.md`](../04-sessions/2026-05-13-work-session.md).

## Estado vivo (al 2026-05-12 noche)

- ✅ **SLA 100% real — 3 cruces externos contra D1** (12-may noche). El cron de conciliación diario ahora hace 3 cruces independientes: (1) GA4 browser-side vs D1 (landings), (2) Meta Lead Center vs D1 (Meta LG perdidos), (3) pipeline_events vs events (Schedule/Visita/Compra sin CAPI/GA4 MP). Job Summary con 4 tablas + secciones accionables con comando curl backfill listo. Funciones nuevas: `stats_meta_leadgen_externa`, `audit_meta_externa`, `audit_downstream_events`. Secret `META_PAGE_TOKEN` configurado en GH Actions. Doc: [`03-tech/Conciliacion-Diaria-Citas.md`](../03-tech/Conciliacion-Diaria-Citas.md).
- ✅ **Bug corregido: CAPI Lead duplicado para Meta LG** (12-may noche). Antes el Worker disparaba CAPI Lead + GA4 generate_lead también para leads Meta LG, pero Meta ya los tiene en su form nativo → doble conteo. Eliminado: ahora solo se disparan CAPI/GA4 downstream (Schedule/Visita/Compra). Histórico: 8 leads ya duplicados pre-fix, no recuperable.

## Estado vivo (al 2026-05-12 tarde)

- ✅ **Vendedores Stellantis cleanup completo** (12-may tarde). Placeholders genéricos (MIGUEL TORRES, Supervisor Plasencia, Supervisor Santa Anita) desactivados. 3 vendedores reales creados: Juliet Lupercio (gerente ventas digitales, pin 807391), Daniel Barrera (350676), Ángela Rodríguez (210356). Berenice Perez (gerente MKT, 339888) actualizada con título + sucursales. 4 leads reasignados de placeholders → Daniel/Ángela round-robin. Stellantis ahora opera con 4 personas reales.
- ✅ **Dashboard con acceso por marca** (12-may tarde). Antes solo 2 niveles (admin + seminuevos). Ahora 4: admin (Chucho, Pepe Morales), seminuevos (Flor 997174, Jonathan 481629, Pepe Reyes 966651), hyundai (Verónica 462743), stellantis (Berenice 339888, Juliet 807391). 6 PINs habilitados para ver dashboard con su marca pre-bloqueada.
- ✅ **Conciliación multi-canal LIVE** (12-may tarde). `scripts/conciliacion_diaria.py` calcula 2 SLAs independientes: LANDING (5 fuentes, igual que antes) + META_LEAD_GEN (3 fuentes — sin GA4 server/browser porque no hay sesión web, era falso positivo estructural). Job Summary con 2 tablas separadas. Workflows GH Actions (07:03 GDL + 22:30 GDL) sin cambios. Doc: [`03-tech/Conciliacion-Diaria-Citas.md`](../03-tech/Conciliacion-Diaria-Citas.md).

## Estado vivo (al 2026-05-12)

- ✅ **Meta Lead Gen end-to-end LIVE** (12-may). Webhook `/api/lead/webhook/meta-leadgen` con HMAC, page suscrita, app-level subscription activa, cron safety net cada 2 min (cubre app en Dev mode). 8 leads reales recuperados (4 STL + 4 HYU) en kanban con vendedor asignado round-robin. Idempotency triple-defense, auto-resolve de marca por nombre del form (futuro-proof clones de Meta). Doc: [`03-tech/Meta-LeadGen-Webhook-Architecture.md`](../03-tech/Meta-LeadGen-Webhook-Architecture.md).
- ✅ **Etapa "Por contactar" en kanban** (12-may). Pipeline pasa de 5 a 6 columnas: cold leads de Meta entran a `Por contactar` (color ámbar), landings web siguen entrando a `Cita Agendada`. Vendedor mueve cold→cita cuando confirma fecha real → dispara CAPI `Schedule` con `user_data.lead_id` para atribución exacta. Las 3 marcas tienen la columna (Seminuevos por consistencia + futuro-proof).
- ✅ **Dashboard rediseñado multi-canal Fase 1+2** (12-may). KPIs hero/funnel/CPA/sesgo con denominadores limpios (solo citas reales, no contaminado por cold). Toggle global "Canal" (Todos / Landings / Meta Lead Gen). Sección 7B nueva "Meta Lead Gen Funnel" con 4 KPIs propios (cold / calificados / visitas post-calif / ganadas). Vendor table con 4 columnas split (citas / cold / calificados / conv%). Doc: [`03-tech/Dashboard-Multi-Canal-Decisiones.md`](../03-tech/Dashboard-Multi-Canal-Decisiones.md).
- ✅ **CAPI con `user_data.lead_id`** (12-may). Leads de Meta Lead Gen ahora mandan `meta_leadgen_id` como `user_data.lead_id` en Lead/Schedule/Visita/Compra. Atribución directa al ad/campaign sin depender de fbp/fbc matching. EMQ esperado ~10/10. `action_source='system_generated'` para leads sin sesión web.
- ✅ **GA4 MP con `lead_channel` + `meta_leadgen_id`** (12-may). Params custom agregados a todos los eventos. Pendiente registrar como custom dimensions en GA4 Admin (3 properties). Sin esto, los params llegan pero no son filtrables.
- 🟡 **App Meta en Development mode** — Chucho debe iniciar App Review para switch a Live mode. Mientras tanto, el cron polling cada 2 min cubre el SLA funcionalmente.
- 🟡 **Branch `feat/meta-leadgen-webhook` NO merged a main** — esperando confirmación final tras observar comportamiento real con campañas activas.

## Estado vivo (al 2026-05-11)

- ✅ **Sprint 1 mobile en las 3 landings LIVE** (deployed 8-may). Hide-on-scroll header+filtros mobile + sticky CTA bottom removido + fix top:64→72px + H1 hero mobile + gradient fade chips + Sprint 1B parte 1 SEM (texto sedes → chip discreto "7 sedes GDL"). Recupera ~332px viewport iPhone SE (50%). Pasa de 0 a 2 cards completas visibles en catálogo. Commits SEM `691f1c2`+`57dad97`, HYU `55328d3`+`c821ef5`, STL `53bb121`+`64f4d4a`.
- ✅ **Fix defensive `vehicle_version` SEM** (commit `b992c58` 11-may). Prepara auto-activación si feed XML Maxipublica enriquece TRIM. Sigue vacío hoy. Detalle en `Backlog-Post-MVP.md §4.7.2`.
- 🟡 **WhatsApp notifications PAUSED** (11-may). Secret `WA_PHONE_NUMBER_ID` borrado en Worker (kill switch limpio, 3 caminos de WA retornan early). Director validando nuevo número real. Reactivar con `wrangler secret put WA_PHONE_NUMBER_ID`.
- 🟢 **Lote ads Seminuevos Always-On v3** (11-may). 3 conceptos en 9:16 con Gemini 2.5 + texto + disclaimer URL. **c01 DESDE $130,000**, **c07 DESDE $2,469/mes** (60m 20%eng tasa 14.9%), **c09 +170 AUTOS · 26 MARCAS sin marca específica**. Doc nuevo: [`01-strategy/Meta-Ads-Copy-Seminuevos-Always-On.md`](../01-strategy/Meta-Ads-Copy-Seminuevos-Always-On.md). Pendiente: subir a Ads Manager. v2 pausado por director (wording inadecuado + Mazda 3 frontal). PNGs en `Motor de Atribucion MVP/Creativos Meta Ads/Always-On Seminuevos/v3/`.
- ✅ **Audit paridad tracking e2e cross-marca** (11-may). 4 canales verificados (Pixel browser, CAPI server, GA4 browser, GA4 server-side MP). Conclusión: paridad sólida (IDs separados, event_id dedup correcto, 17 eventos dataLayer idénticos). 2 gaps documentados como deuda no-bloqueante: `vehicle_version` (upstream feed gap) + `step_name` (sistemas distintos SEM/HYU vs STL — diferido a próxima iteración del modal). Dashboard actual NO consume `step_name` (verificado en `dashboard_refresh.py`), cero impacto operacional. Detalle en `Backlog-Post-MVP.md §4.7` + `Landings-Arquitectura-Codigo.md` gotchas #16-17.
- ⚠️ **Lead ADRIANA cerrado 22 seg después de crearse** (7-may, único lead real de la semana). `GP-SEM-260507-143632` Ford Bronco SUV 2024 López Mateos, cerrado Perdida por `jayala@fordplasencia.com` motivo "Otro" sin notas. Caso a investigar.
- 🟡 **Sangría SEM mayo confirmada:** 1 lead real en 7 días corridos (1-may a 7-may). Cuello upstream (calidad tráfico o pause campañas) — infra clean.
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
- ✅ **Deep Research Marketplace mundial 2026 — EJECUTADO + PAPER EJECUTIVO** (6-may) — output disponible en [`01-strategy/Deep-Research-Output-Marketplace-Plasencia.md`](../01-strategy/Deep-Research-Output-Marketplace-Plasencia.md) (~50KB, 420 líneas) + paper A4 de 13 páginas en [`01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html`](../01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html) con sistema de diseño corporativo (Navy + Gold + Red, Playfair Display + Inter).
- ✅ **Propuesta sustentada con evidencia — para Consejo** (6-may, 15 páginas) — paper A4 en [`01-strategy/El-Patron-Que-Gano-Experiencia-Plasencia.html`](../01-strategy/El-Patron-Que-Gano-Experiencia-Plasencia.html) siguiendo Strategy Definition completa (Minto + SCR + Answer-First): Situación → Complicación (5 drivers, incluyendo "El dinero ya se movió" con evidencia global Dentsu/Magna/IAB/AMVO + automotive USA/MX) → Resolución → Validación (8 grupos con cifras) → Modelo punto-por-punto → Timing/Riesgos → Roadmap 12 meses → Caso financiero con killer metric Lithia DFC → Ask (5 decisiones binarias). Tono: propuesta del Director sustentada con evidencia, no replicación pasiva. Mirror público: [URL](https://mktgrupoplasenciaautomotriz.github.io/grupo-plasencia-decks/01-strategy/El-Patron-Que-Gano-Experiencia-Plasencia.html). Hallazgos clave: (1) modelo "concesionario unificado bajo marca-paraguas con motor digital propio" ganó el debate global 2024-2026 (Lithia, Asbury, Group 1, AutoNation, Sonic+EchoPark, Pendragon, Inchcape); (2) modelo 100% digital sin piso es anti-patrón documentado (Cazoo £1.4B quemados, Vroom liquidado, Honda US discontinuado); (3) modelo "agency" europeo en repliegue (Ford abandonó, Stellantis suspendió, VW revirtió); (4) sub-marca de seminuevos rentable es patrón ganador con disciplina; (5) financiera cautiva = 2do motor de utilidad y captura de CLTV; (6) stack 2026 converge en CRM+CDP+CAPI+conversational AI; (7) capacidad apalancada por IA es la palanca real, no headcount. Brief original: [`01-strategy/Deep-Research-Brief-Marketplace-Plasencia.md`](../01-strategy/Deep-Research-Brief-Marketplace-Plasencia.md). Próximo paso: insumo para Marco Operativo Experiencia Plasencia Automotriz.
- 🟢 **Concepto Always-On Seminuevos + 13 creativos Reels generados** (29-abr noche) — `01-strategy/Always-On-Seminuevos-Concepto.md` con plan operativo + 13 PNGs 9:16 con texto en `Always-On Seminuevos/v2/` (bypass del repo de docs). Para budget $650/día: 5 conceptos seleccionados (c01, c07, c09, c11, c13). Copy Meta listo: 5 textos primarios, 5 headlines, 5 descripciones rotables. Pendiente: subir a Ads Manager.
- 🟡 **Stellantis 0 leads reales desde cutover** — confirmar tracking.
- ✅ **HYU + STL imágenes oficial-concesionario** (6-may noche v2, arquitectura genérica por marca en `export_catalogos.py`). Override aplicado vía dict `_IMG_RULES_BY_MARCA["HYU"|"STL"]`. STL: 59/60 mapeados desde S3 del concesionario (`spdfc.s3.us-west-2.amazonaws.com/.../showroom/`, solo Fiat Argo sin oficial). HYU: 28/28 mapeados desde CDN del concesionario (`hmm-api-alkemy.s3.amazonaws.com`, 12 archivos cubren todas las versiones). Persistente: el cron `04:03` regenera el JSON con paths correctos. Para agregar marca-piloto nueva en el futuro, basta agregar una entrada al dict. Doc: [`03-tech/Imagenes-Catalogo-Override-Concesionario.md`](../03-tech/Imagenes-Catalogo-Override-Concesionario.md).
- ✅ **HYU + STL always-on real** (6-may noche). Toda mención visible de bonos/promos/vigencia abril removida de ambas landings (FAQs, banners, modales "Ver promoción", `detailsByModel`, leyendas legales, fallbacks de búsqueda vacía, pill blanco "Sin bono"). Calculadoras con tasas de referencia se mantienen (HYU 9.49% Banorte; STL 7.99-14.50% según marca). Lógica latente (`bonoAmt`, eventos analytics `bono_*`, comentarios CSS) preservada para reactivar cuando vuelvan promociones.
- ✅ **STL logos SVG oficiales** (6-may noche). 5 logos de marca (RAM, Jeep, Dodge, Fiat, Peugeot) reemplazados por SVG oficial del concesionario (patrón `/assets/img/logos/logo-{Marca}-blanco.svg`). Antes: 4 de 5 eran archivos técnicamente inválidos (WebP/AVIF disfrazados de PNG, RAM JPG sin alpha → cuadrado blanco vacío). Altura subida 30→38px porque el wordmark Dodge perdía grosor a 30px (microcurvas Illustrator).
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
| Meta Lead Gen — webhook, CAPI, cron safety, etapa "Por contactar", auto-resolve marca | `03-tech/Meta-LeadGen-Webhook-Architecture.md` | `03-tech/Dashboard-Multi-Canal-Decisiones.md` (cómo se mide), `04-sessions/2026-05-12-work-session.md` (implementación) |
| Dashboard multi-canal — denominadores correctos, filtro canal, sección Lead Gen, vendor split | `03-tech/Dashboard-Multi-Canal-Decisiones.md` | `03-tech/Dashboard-Metricas-Implementacion.md` (estructura técnica), `03-tech/Meta-LeadGen-Webhook-Architecture.md` (canal que la métrica describe) |
| Reglas del kanban / vendedores | `03-tech/CRM-Pipeline-Reglas-de-Negocio.md` | `03-tech/CRM-Access-Control.md` |
| Acceso por marca / PINs | `03-tech/CRM-Access-Control.md` | — |
| Métricas / dashboard ejecutivo | `03-tech/Dashboard-Metricas-Implementacion.md` | `03-tech/Dashboard-Metricas-Diseno.md`, `03-tech/Reglas-Metricas-Plataforma-vs-Negocio.md` |
| Conciliación D1 vs GA4 (fugas) | `03-tech/Conciliacion-Diaria-Citas.md` | `03-tech/Folio-Cita.md` |
| Cambio en una landing (código, JS, payload) | `03-tech/Landings-Arquitectura-Codigo.md` | Repo: `catalogo-seminuevos-piloto` / `landing-hyundai-plasencia` / `landing-stellantis-plasencia` · `02-design/Design-System-Multi-Marca.md`, `02-design/UX-CRO-Patterns.md`, `03-tech/audits/Auditoria-CRO-UX-<marca>.md` |
| Pivote Landings Lite (form 1 step, sin calc/agenda, datos contacto solamente, ENTRA A 'POR CONTACTAR') — desde 13-may | `03-tech/Landings-Lite-Arquitectura.md` | `04-sessions/2026-05-13-work-session.md`, branches `feat/landing-lite-2026-05` en los 3 repos de landings + tag `v-pre-lite-2026-05-13` para rollback |
| Diseño visual / tokens / consistencia | `02-design/Design-System-Multi-Marca.md` | `02-design/Design-System-Cards-y-Consistencia.md`, `02-design/GP-Design-System-Original.md` |
| Catálogo de autos (Seminuevos sync D1) | `03-tech/Catalogo-Seminuevos-Sync-D1.md` | `00-context/Anexo-Integracion-MaxiPublica.md` |
| Catálogo de autos (flujo histórico Airtable, retirado 5-may) | `03-tech/Catalogo-Seminuevos-Flujo-E2E.md` | contexto histórico |
| Imágenes de producto HYU + STL (override oficial-concesionario por marca) | `03-tech/Imagenes-Catalogo-Override-Concesionario.md` | Repo `plasencia-catalogos-dca` (`export_catalogos.py` dict `_IMG_RULES_BY_MARCA` + función `aplicar_override_imagenes`), `landing-{marca}-plasencia/docs/imagenes/oficial/` |
| Plan de migración del catálogo HYU/STL a D1 (replicar Seminuevos) — decisiones del director confirmadas, pendiente implementación | `03-tech/Catalogo-HYU-STL-D1-Plan-Migracion.md` | `03-tech/Catalogo-Seminuevos-Sync-D1.md` (patrón base), `03-tech/Imagenes-Catalogo-Override-Concesionario.md` (override que se preserva), repo `plasencia-catalogos-dca` |
| Reactivación de campañas Meta HYU/STL — checklist operativo, cero código | `03-tech/Reactivacion-Campanas-HYU-STL-Checklist.md` | `03-tech/D1-CAPI-MP-Server-Side-Architecture.md` (stack canónico), `03-tech/Tracking-CRM-GA4.md`, `03-tech/Conciliacion-Diaria-Citas.md` |
| Runbooks operacionales (8 procedimientos repetibles): cron drift, refresh ads, tests sin side effects, cleanup D1 FK-safe, QA visual mobile, audit paridad tracking, glitches Gemini, validación post-deploy | `03-tech/Runbooks-Operacionales.md` | Cada RB referencia su contexto. Consultar cuando te encuentres una de las situaciones documentadas |
| Render PDF de cualquier deck o paper del repo (workflow pixel-perfect: Puppeteer local, Chrome headless, scripts pre-instalados) | `03-tech/PDF-Render-Workflow.md` | Skill global `~/.claude/skills/html-to-pdf/SKILL.md`, scripts `~/.claude/tools/html-to-pdf/render-slides.js` (decks 1280x720) y `render-pixel-perfect.js` (papers A4) |
| Strategy definition / pitch al Consejo | `01-strategy/Strategy-Definition-MKT-Corporativo-AI-powered.md` | `01-strategy/Centro-Excelencia-MKT-Consejo-Deck.html`, `01-strategy/Motor-de-Atribucion-MVP-Playbook-Operativo.html` |
| Motor de Atribución — Strategy Definition para Consejo (institucionalización como infraestructura corporativa, Revenue Operations, escalamiento a 8 marcas, decisión de gobierno corporativo) | `01-strategy/Motor-Atribucion-Consejo-Strategy-Definition.md` (md source of truth) + `01-strategy/Motor-Atribucion-Consejo-Paper-Ejecutivo.html` (paper A4 ejecutivo, Minto + SCR + Answer-First) | `01-strategy/El-Patron-Que-Gano-Experiencia-Plasencia.html` (marco superior), `01-strategy/Motor-Atribucion-Piloto-Deck.html` (reporte del piloto), `01-strategy/Strategy-Definition-MKT-Corporativo-AI-powered.md` (CdE) |
| Seminuevos — Concepto rector "Sin Sorpresas" (marco estratégico de alineación para directores y gerentes de marca involucrados; capítulo táctico de Experiencia Plasencia Automotriz; rige comunicación externa, experiencia digital y operación comercial; **no es pitch al Consejo**, comunicación corporativa es condicional en Fase 4) | `01-strategy/Seminuevos-Concepto-Rector-Sin-Sorpresas.md` (markdown source of truth) + `01-strategy/Seminuevos-Sin-Sorpresas-Paper-Ejecutivo.html` (paper A4 12 páginas, sistema visual Navy + Red + Gold Seminuevos, Playfair + Inter, estructura Minto + SCR + Answer-First, para Pepe Morales / Jonathan Medina / Jose Reyes / Gerentes de Marca) | `01-strategy/Experiencia-Plasencia-Automotriz-Framing.md` (marco superior), `01-strategy/El-Patron-Que-Gano-Experiencia-Plasencia.html` (evidencia global), `01-strategy/Always-On-Seminuevos-Concepto.md` (concepto Meta Ads previo a iterar v4), `00-context/KO-Estrategico.md` (datos cuantitativos sostén) |
| Seminuevos — Estrategia Andromeda v4 (working doc) · estrategia de Meta Ads derivada del marco Sin Sorpresas · incluye 6 conceptos hero producidos con MCP image-gen + copy completo + análisis 4 capas Andromeda + Power 1 + KPIs · documenta línea de negocio multi-sucursal con catálogo unificado y conversión principal = registro · datos verificables del catálogo (cero invención de números) · pendientes Fase 0 audit Meta + firma Jose Reyes para H03/H05 condicionales | `01-strategy/Seminuevos-Estrategia-Andromeda-v4-Working.md` (markdown working · pendiente incorporación al paper como §9) · artes en `~/Documents/Grupo Plasencia/Motor de Atribucion MVP/Creativos Meta Ads/Always-On Seminuevos/v4/` (H01–H06 PNG 9:16) | `01-strategy/Seminuevos-Concepto-Rector-Sin-Sorpresas.md` (marco rector), skill `meta-ads-andromeda` (framework), `01-strategy/Meta-Ads-Copy-Seminuevos-Always-On.md` (v3 archivado · histórico) |
| Experiencia Plasencia Automotriz (arquitectura marca + sistema mkt + comercial) | `01-strategy/Experiencia-Plasencia-Automotriz-Framing.md` | `00-context/KO-Estrategico.md` (datos cuantitativos), `01-strategy/Strategy-Definition-MKT-Corporativo-AI-powered.md`, deck Motor de Atribución slide 18 |
| Concepto Always-On Seminuevos (Meta Ads Andromeda 2026) | `01-strategy/Always-On-Seminuevos-Concepto.md` | Skill `meta-ads-andromeda`, `00-context/KO-Operativo.md` §funnel digital, `03-tech/Landings-Arquitectura-Codigo.md` (eventos + payload) |
| Copy Meta Ads Hyundai Always-On (5 textos + 5 titulares + 5 descripciones + Power 1) | `01-strategy/Meta-Ads-Copy-Hyundai-Always-On.md` | Skill `meta-ads-andromeda`, landing `hyundai.grupoplasencia.com` (paridad: tasa de referencia, 2 sucursales, "60 segundos") |
| Lote ads Seminuevos Always-On v3 (11-may): 3 conceptos 9:16 generados con Gemini · claims con datos reales del catálogo · disclaimer URL canónico | `01-strategy/Meta-Ads-Copy-Seminuevos-Always-On.md` | Skill `meta-ads-andromeda`, `01-strategy/Always-On-Seminuevos-Concepto.md` (framework), `01-strategy/Creative-Brief-Seminuevos-Abril-2026.md` (personas), `03-tech/Landings-Arquitectura-Codigo.md` (fórmula calc `index.html:3427`), PNGs en `Motor de Atribucion MVP/Creativos Meta Ads/Always-On Seminuevos/v3/` |
| Discovery Gerentes MKT — Brief abierto (formato libre, 9 temas + 1 bonus opcional) — ESTE SE MANDA AL GERENTE | `01-strategy/Discovery-Gerentes-MKT-Brief.html` (paper A4, sistema de diseño corporativo Navy+Red+Gold, Playfair+Inter, 5 páginas) · versión markdown editable: `01-strategy/Discovery-Gerentes-MKT-Brief.md` | `01-strategy/Discovery-Gerentes-MKT-Cuestionario.md` (checklist interno del Director, NO se manda) |
| Discovery Gerentes MKT — Cuestionario detallado 75 preguntas (uso interno Director: validar cobertura + guiar 1:1) | `01-strategy/Discovery-Gerentes-MKT-Cuestionario.md` | `01-strategy/Discovery-Gerentes-MKT-Brief.md`, `01-strategy/Strategy-Definition-MKT-Corporativo-AI-powered.md` |
| Propuesta sustentada con evidencia — para Consejo | `01-strategy/El-Patron-Que-Gano-Experiencia-Plasencia.html` (paper A4, 14 páginas, Strategy Definition completa: SCR + Minto + Answer-First) | `01-strategy/Experiencia-Plasencia-Automotriz-Framing.md` (framing original), `01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html` (insumo investigación), `01-strategy/Deep-Research-Output-Marketplace-Plasencia.md` |
| Investigación benchmark mundial marketplace automotive — brief, output y paper ejecutivo | `01-strategy/Marketplace-Plasencia-Paper-Ejecutivo.html` (paper A4, 13 páginas, look&feel corporativo Navy+Gold+Red) | `01-strategy/Deep-Research-Output-Marketplace-Plasencia.md` (output completo), `01-strategy/Deep-Research-Brief-Marketplace-Plasencia.md` (brief), `01-strategy/Experiencia-Plasencia-Automotriz-Framing.md`, `00-context/KO-Estrategico.md` |
| GP Autolease — Persona dominante (PFAE Daniel Vargas) y framing del rediseño | `01-strategy/Autolease-Persona-Dominante.md` | Brand kit local en `~/Documents/Grupo Plasencia/Autolease/` (logo, fuentes, manual de usos básicos, iconos), sitio actual `https://gpautolease.com/` |
| GP Autolease — IA, user flows, wireframes spec de 11 pantallas, principios de diseño y inventario de componentes | `02-design/Autolease-IA-Flows-Wireframes.md` | `01-strategy/Autolease-Persona-Dominante.md` (persona base), brand kit local |
| GP Autolease — sitio rediseñado v1 (frontend deployed) | Repo `MktGrupoPlasenciaAutomotriz/gpautolease-web` (público, Vite + React + TS + Tailwind) live en `https://mktgrupoplasenciaautomotriz.github.io/gpautolease-web/` | Local en `~/Documents/Grupo Plasencia/gpautolease-web/`, deploy automático via GitHub Actions a GH Pages, base path `/gpautolease-web/` (override con `VITE_BASE=/` para custom domain), backend propio Cloudflare Worker pendiente (sesión 5) |
| Stakeholder específico (Vero/Bere/Jose) | `05-stakeholders/Minuta-<Marca>-<Nombre>.md` | `00-context/KO-Estrategico.md` §Stakeholders |
| GTM / GA4 dimensions / Pixels (landings) | `00-context/KO-Operativo.md` §Update 24-abr | memory `reference_gtm_mcp_version_bug.md` |
| Tracking del CRM (login, session_resume, contact_click, user_id/PIN) | `03-tech/Tracking-CRM-GA4.md` | `pillars/MAP-Tech.md`, `pillars/MAP-Datos-Atribucion.md` |
| Broadcasts WhatsApp (notif dirección + encuesta post-cita) | `03-tech/Broadcasts-WhatsApp-Plasencia.md` | `04-sessions/2026-05-05-work-session.md` Bloque 6 + addendum 06-may, `04-sessions/2026-05-06-work-session-broadcasts-wa.md` |
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
