# Pillar — Diseño (sistema, tokens, UX/CRO)

> Visión panorámica del **sistema de diseño multi-marca** del Motor de Atribución. Cubre tokens corporativos, paletas por marca, anatomía de cards, patrones UX/CRO y reglas mobile. Es índice. Para detalle, abre los docs hijos.

---

## Filosofía: Seminuevos = canónico

**La regla de oro:** Hyundai y Stellantis son **clones 1:1 de Seminuevos** en estructura. Solo varía:
- Paleta cromática (tokens semánticos por marca)
- Contenido (vehículos, copy, ofertas)
- Tracking IDs (GA4, Pixel, GTM measurementIdOverride)
- Inventario (dinámico vs hardcoded)

**Si una landing se desvía de Seminuevos en estructura, comportamiento mobile, o flujo de form → eso es bug.**

---

## Sistema de tokens (3 niveles)

```
PRIMITIVOS  →  SEMÁNTICOS por marca  →  COMPONENTE
```

**Primitivos** (compartidos): escala de spacing 4pt/8pt, tipografía base, radii, sombras, breakpoints.

**Semánticos por marca:**
- **Corporativo / Seminuevos:** navy `#0F1A2E` + accent verde
- **Hyundai:** azul Hyundai oficial + neutros
- **Stellantis:** navy + vibrant Peugeot blue + gradient mesh

**Componente:** anatomía específica (ej. card de auto, hero stat card).

### Docs hijos
- `02-design/Design-System-Multi-Marca.md` — tokens corporativo + 3 marcas, paletas, tipografía
- `02-design/GP-Design-System-Original.md` — design system corporativo Grupo Plasencia (base)
- `02-design/Design-System-Cards-y-Consistencia.md` — anatomía de cards, brand badge pill, flex layout, border-top price

---

## Patrones UX/CRO canónicos

**Hero:**
- 3 stat cards (números clave por marca)
- CTA dual: "Ver inventario/modelos" + "Agendar"
- Sin sticky CTA (mobile)

**Filtros:**
- Dropdowns, no chips
- No sticky en mobile

**Cards de auto:**
- Brand badge pill arriba
- Flex layout
- Border-top en precio (separación visual)
- Galería de fotos (Seminuevos = 14 fotos, Hyundai/Stellantis = imágenes oficiales)

**Form progresivo (3 pasos):**
1. Datos contacto
2. Financiamiento (cash_only / down_pct / term_months / monthly_payment)
3. Cita (sucursal + fecha + hora + accept_marketing)

**Captura silenciosa:** `fbclid`, `gclid`, UTMs, `meta_ad_id`, `meta_placement` (de querystring).

**Post-submit consistency:**
- Mensaje único: "¡Tu cita está confirmada!"
- 3 next-steps cards (qué pasa ahora)
- Folio visible
- Disclaimer general en footer

**Modal:**
- Fullscreen mobile
- Overflow-y: auto + 100dvh
- Modal info SEPARADO del modal de form (regla design system)

### Doc hijo
- `02-design/UX-CRO-Patterns.md` — patrones detallados con racional CRO

---

## Reglas mobile (no negociables)

1. **Sin sticky filters.** Si filtros fijan al scroll, está mal.
2. **Sin sticky CTAs.** El CTA vive donde corresponde, no flota.
3. **Modal scrollea dentro.** `.modal-content` con `overflow-y: auto + 100dvh`.
4. **Breakpoint 640px.** Por encima = desktop layout. Por debajo = mobile fullscreen.
5. **No truncar texto crítico.** Precio, marca, año siempre legibles sin tap.

**Si Hyundai o Stellantis tienen comportamiento mobile distinto a Seminuevos, eso es regresión.** Validar siempre con QA e2e en viewport 390x844.

---

## Auditorías UX/CRO + accesibilidad

**3 audits por marca + 2 cross-marca.** Hechos abril 2026, base para iteraciones.

### Docs hijos (audits/)
- `03-tech/audits/Auditoria-CRO-UX-Seminuevos.md` ← canónica
- `03-tech/audits/Auditoria-CRO-UX-Hyundai.md`
- `03-tech/audits/Auditoria-CRO-UX-Stellantis.md`
- `03-tech/audits/Revision-UX-Copy-3-Landings.md` — copy, microcopy, tono
- `03-tech/audits/Auditoria-Accesibilidad-3-Landings.md` — WCAG 2.1 AA

---

## Logos y assets

**Repo:** `~/Documents/grupo-plasencia-docs/assets/logos/` y `screenshots/`.

**Regla crítica de logos** (memory `feedback_logo_fondo_blanco.md`):
> NUNCA background blanco en logos sobre fondos oscuros. Usar `mix-blend-mode: screen` cuando el logo tiene matte blanco original. Si la base del logo no permite blend, pedir versión con fondo transparente al área de marca.

**Favicon corporativo:** escudo Plasencia blanco sobre navy `#0F1A2E`. Aplica en los 4 sitios.

---

## Dashboard ejecutivo — patrones específicos

El dashboard NO usa la paleta de las landings. Usa **gradient navy** del design system corporativo + acentos por estado:

- Banner pipeline E2E: gradient navy oscuro
- Funnel cards: bg neutro, color por estado (verde Ganada, rojo Perdida, gris activos)
- Dinero cards: bg blanco con sombra suave
- Salud digital: strip secundario (color desaturado)

**Densidad alta** (es vista directiva, se prioriza información sobre whitespace).

### Doc hijo
- `03-tech/Dashboard-Metricas-Diseno.md` §scoping visual

---

## Copy ejecutiva — reglas vigentes

1. **"Oportunidad calificada" NUNCA "lead"** (excepto sec GA4/Meta con disclaimer educativo).
2. **"Cita" = unidad de negocio.** Lo que entra de landing y opera el vendedor.
3. **No em dashes** en comms (parece IA). Usar coma, dos puntos, paréntesis o salto de línea.
4. **"Influencia digital"**, no "atribución", hasta que el Motor lo habilite formalmente.
5. **Políticamente correcto siempre.** Nadie hace mal su trabajo. La infraestructura no les permite hacerlo mejor.
6. **AOV** se reporta como $412K (confirmado Pepe Morales). NO usar EBITDA en docs públicos.

---

## Decks ejecutivos (consistencia visual cross-deck)

5 decks HTML en `01-strategy/`:
- `Centro-Excelencia-MKT-Consejo-Deck.html` ← deck principal v2
- `Driving-Growth-Deck.html` (snapshot abril, frozen)
- `Driving-Growth-Executive-Summary.html` (frozen)
- `Motor-Atribucion-Piloto-Deck.html`
- `Motor-de-Atribucion-MVP-Playbook-Operativo.html`

**Patrón:** logos en `assets/logos/` (paths relativos `../assets/logos/...`). Se renderean local + GitHub Pages mirror.

**Mirror público:** `grupo-plasencia-decks-public/` → repo `grupo-plasencia-decks` → URL pública GitHub Pages. Workflow: editar privado → `sync.sh` para publicar.

---

## Gotchas conocidos

1. **Paths de logos rompen post-cleanup.** Solución 23-abr: copiar a `assets/logos/` del repo y usar paths `../assets/logos/...`. NO referenciar `../../Legacy Marketing/...`.
2. **HTML = WIP, PDF = copia exacta del HTML final.** Iterar siempre en HTML.
3. **Stellantis paleta requiere gradient mesh** (no plano) — diferenciador visual aprobado.
4. **Form modal y info modal son separados** — regla design system (no mezclar).

---

## Atajo: el agente busca…

- "qué color usar en CTA Hyundai" → `Design-System-Multi-Marca.md` §Hyundai
- "card de auto se ve diferente entre marcas" → `Design-System-Cards-y-Consistencia.md`
- "form falla en mobile" → reglas mobile arriba + `UX-CRO-Patterns.md`
- "copy del post-submit" → `audits/Revision-UX-Copy-3-Landings.md`
- "dashboard se ve ejecutivo" → `Dashboard-Metricas-Diseno.md`
- "cómo lucir el deck al Consejo" → `Centro-Excelencia-MKT-Consejo-Deck.html`
