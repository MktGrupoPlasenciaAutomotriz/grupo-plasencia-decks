# Pillar — Producto (lo que ven usuarios)

> Visión panorámica de los **productos digitales** del Motor de Atribución. Cubre los 3 productos user-facing (3 landings + kanban CRM + dashboard ejecutivo) y a quién sirve cada uno. Es índice, no contenido. Para detalle, abre los docs hijos.

---

## Qué cubre este pillar

3 productos digitales, 2 audiencias:

| Producto | Audiencia | Dominio / URL | Repo |
|---|---|---|---|
| **3 Landings** | Cliente final (compradores autos) | `seminuevos / hyundai / stellantis .grupoplasencia.com` | `catalogo-seminuevos-piloto`, `landing-hyundai-plasencia`, `landing-stellantis-plasencia` |
| **CRM Kanban** | Vendedor + Gerente MKT | `crm-plasencia.grupo-plasencia-automotriz.workers.dev` | `crm-worker` (privado) |
| **Dashboard ejecutivo** | Director MKT (Chucho) + Dir. General (Pepe) | `crm-plasencia.../dashboard` (tab dentro del CRM) | `crm-worker` (privado) |

---

## 1. Landings (cliente final)

**Patrón canónico = Seminuevos.** Hyundai y Stellantis son clones 1:1 en estructura — solo varía contenido, paleta, IDs de tracking, inventario.

**Componentes comunes:**
- Hero con 3 stat cards + CTA dual (Ver inventario / Agendar)
- Filtros dropdown (no sticky)
- Cards de auto con brand badge + flex layout + border-top price
- Galería de fotos (Seminuevos tiene 14 fotos por auto)
- Form progresivo de 3 pasos (datos contacto → financiamiento → cita)
- Captura `fbclid`, `gclid`, UTMs, `meta_ad_id`, `meta_placement`
- Genera **folio** `GP-{MARCA}-YYMMDD-HHMMSS` en browser
- Mobile fullscreen modal (overflow-y:auto + 100dvh)
- Tasa de financiamiento real por marca

**Inventario por marca:**
- **Seminuevos:** catálogo dinámico ~90 autos del lote Otero, sync diario 04:03 GDL
- **Hyundai:** 35 versiones hardcoded + 13 imgs oficiales + tabla Banorte escalonada
- **Stellantis:** 14 modelos (RAM, Peugeot, Jeep, Dodge, Fiat) + STM/Inbursa + 6 imgs reales + 8 placeholders pendientes

### Docs hijos
- **`03-tech/Landings-Arquitectura-Codigo.md`** — referencia técnica del código de las 3 SPAs (estructura, funciones JS, divergencias reales por marca, 25 eventos dataLayer, 15 gotchas)
- `02-design/Design-System-Multi-Marca.md` — tokens, paletas, tipografía por marca
- `02-design/Design-System-Cards-y-Consistencia.md` — anatomía de cards
- `02-design/UX-CRO-Patterns.md` — patrones de form, dual CTA, mobile rules
- `02-design/GP-Design-System-Original.md` — design system corporativo
- `03-tech/audits/Auditoria-CRO-UX-Seminuevos.md` (referencia canónica)
- `03-tech/audits/Auditoria-CRO-UX-Hyundai.md`
- `03-tech/audits/Auditoria-CRO-UX-Stellantis.md`
- `03-tech/audits/Revision-UX-Copy-3-Landings.md`
- `03-tech/audits/Auditoria-Accesibilidad-3-Landings.md`
- `03-tech/Catalogo-Seminuevos-Flujo-E2E.md` — sync diario del inventario
- `03-tech/Catalogos-Plasencia-Airtable.md` — base Airtable de catálogos (sigue viva)

---

## 2. CRM Kanban (vendedor + gerente MKT)

Tab principal del Worker. 5 columnas drag-and-drop:

`Cita Agendada → Visita Realizada → Negociación → Ganada | Perdida`

**Acceso:** Cloudflare Access SSO + PIN por usuario. PIN determina marca y filtra todo. 13 emails mapeados al 17-abr.

**Lo que el vendedor opera:**
- Crear/editar oportunidad (excepto VEHICULO entrada y VALOR PIPELINE = readonly post-creación)
- Mover etapas (drag o quick-action en card)
- Cerrar Ganada con VIN + valor cierre + vendedor + ≤7 días
- Marcar Perdida con motivo
- Capturar `VEHICULO CERRADO` + `MOTIVO CAMBIO VEHICULO` si compró un auto distinto al de entrada

**Sync automático del frontend:** al cambiar etapa a `Visita Realizada` o `Ganada`, dispara INSERT en `events` + Pixel/CAPI con `event_id = {FOLIO}-VISITA / -COMPRA`.

### Docs hijos
- `03-tech/CRM-Pipeline-Reglas-de-Negocio.md` — Ganada/Perdida/VIN/7d, vehículo entrada vs cerrado
- `03-tech/CRM-Access-Control.md` — PIN gate, USER_BRAND, sucursales
- `03-tech/Airtable-Funnel-Tables-Automations.md` — `syncPipelineToEvents` (frontend JS, dispara CAPI Visita/Compra)

---

## 3. Dashboard ejecutivo (director MKT + dir general)

Tab `/dashboard` dentro del Worker (iframe lazy). Solo PINs `brand=all` (Chucho `120076`, Pepe Morales `379072`).

**Lo que muestra el director (orden visual):**
1. **Banner Pipeline E2E** — valor total + breakdown activo/cerrado/perdido (gradient navy)
2. **Funnel del negocio** (5 cards) — Citas → Visitas → Negociando → Ganadas | Perdidas, con %conv, conteo, valor monetario, breakdown por marca
3. **Dinero** (4 cards) — Inversión · Costo por oportunidad · CAC · ROAS
4. **Salud digital** strip — Sessions, Conv digital, Conv pipeline, ROAS

**Filtros:** Ayer / 7d / Mes / 30d / Histórico / Custom. Default = "mes hasta ayer" (cron solo trae yesterday).

**Refresh:** GH Action cron `0 14 * * *` UTC = 8:00 AM GDL diario.

**Lenguaje:** todo el dashboard usa "**oportunidad calificada**", NUNCA "lead" (excepto sec 5 GA4 vs Meta con disclaimer).

### Docs hijos
- `03-tech/Dashboard-Metricas-Implementacion.md` — schema D1, endpoints, workflow, troubleshooting
- `03-tech/Dashboard-Metricas-Diseno.md` — scoping y decisiones de F1/F2 (referencia histórica)
- `03-tech/Reglas-Metricas-Plataforma-vs-Negocio.md` — qué métrica se usa con qué audiencia

---

## Gotchas conocidos

1. **Mobile = no sticky.** Sin sticky filters, sin sticky CTAs, modal scrollea dentro. Si una landing de Hyundai/Stellantis tiene comportamiento diferente a Seminuevos en mobile, eso es bug.
2. **Etapa "Nuevo" no existe** en el kanban — solo las 5 etapas válidas. Cualquier insert con `etapa='Nuevo'` queda invisible. Default canónico al ingresar = `Cita Agendada`.
3. **Dashboard hoy no tiene live update** — botón "Actualizar" eliminado. Solo refresca con cron 8AM GDL.
4. **Stat "Deals" filtra TEST/QA** — el filtro `VALID_STAGES` se aplica antes de stats/búsqueda/render. Si un deal aparece en search pero no en stats, revisar etapa.
5. **`VEHICULO` post-Ganada es readonly siempre.** Si cliente compró otro auto, captura va en `VEHICULO CERRADO`.

---

## Atajo: el agente busca…

- "cómo se ve el form" → audit del form en `audits/Auditoria-CRO-UX-Seminuevos.md`
- "qué etapa sigue después de Cita" → `CRM-Pipeline-Reglas-de-Negocio.md`
- "el dashboard no actualiza" → `Dashboard-Metricas-Implementacion.md` §troubleshooting
- "qué ve un vendedor de Hyundai vs Stellantis" → `CRM-Access-Control.md` §USER_BRAND
- "por qué Stellantis se ve diferente a Seminuevos" → `Design-System-Multi-Marca.md` + diff de repos
