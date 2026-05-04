# CLAUDE.md — Reglas de documentacion del proyecto Grupo Plasencia

Este archivo es la **fuente de verdad** sobre donde guardar cada tipo de documento en el ecosistema de Grupo Plasencia. Aplica a Claude (en cualquier sesion) y a humanos que contribuyan.

---

## Decision tree: donde poner que cosa

```
Vas a crear un documento nuevo. Pregunta:

1. ¿Es CONFIDENCIAL (negociacion personal, datos privados de Chucho, secretos)?
   → SI: queda SOLO en local (~/Documents/Grupo Plasencia/Historial Claude/) o iCloud (~/Documents/Claude Code Setup/)
   → NO: continua

2. ¿Es codigo (HTML/JS/CSS/etc.)?
   → SI: va al repo del componente correspondiente:
      - Landing Seminuevos → catalogo-seminuevos-piloto (publico)
      - Landing Hyundai → landing-hyundai-plasencia (publico)
      - Landing Stellantis → landing-stellantis-plasencia (publico)
      - CRM Worker → crm-worker (privado)
      - CRM viejo (legacy) → crm-pipeline (publico, retirado)
   → NO: continua

3. ¿Es un snapshot de sesion de trabajo (lo que se hizo hoy)?
   → SI: 04-sessions/YYYY-MM-DD-work-session.md (este repo)
   → NO: continua

4. ¿Es minuta de llamada con stakeholder?
   → SI: 05-stakeholders/Minuta-<Marca>-<Nombre>.md (este repo)
   → NO: continua

5. ¿Es doc tecnica (arquitectura, integracion, audit, regla operativa de un sistema)?
   → SI: 03-tech/ (este repo)
   → NO: continua

6. ¿Es doc estrategica (deck, playbook, resumen para directores)?
   → SI: 01-strategy/ (este repo). Habitualmente HTML.
   → NO: continua

7. ¿Es sistema de diseno (tokens, patrones UI, design system)?
   → SI: 02-design/ (este repo)
   → NO: continua

8. ¿Es contexto del proyecto (KO, glosario, anexo)?
   → SI: 00-context/ (este repo)
   → NO: pregunta a Chucho donde va.
```

---

## Reglas no negociables

### 0. MAP-Plasencia.md es el índice de navegación
- `00-context/MAP-Plasencia.md` es el primer doc que abre cualquier agente Claude después del CLAUDE.md raíz
- **Si creas un doc nuevo en `03-tech/`, `02-design/`, `01-strategy/` o `00-context/` → registra 1 línea en la tabla "Decisión por intent" de MAP-Plasencia.md**. Si no aparece ahí, no existe para futuros agentes.
- Si el doc nuevo cubre un dominio entero → además agregalo al pillar L2 correspondiente en `00-context/pillars/MAP-*.md`.
- La sección "Estado vivo" del MAP-Plasencia.md se actualiza con cada sesión que toque KO-Operativo.

### 1. Nunca commitear secretos
- Tokens, API keys, PATs, OAuth credentials, passwords → JAMAS en este repo
- Si encuentras uno hardcoded en codigo, REMUEVELO inmediatamente, rota el secreto y notifica
- Lugar correcto de secretos: iCloud (`~/Documents/Claude Code Setup/`) y/o secret manager del cloud (Cloudflare Workers secrets, etc.)

### 2. Confidencial = local only
- `Contexto Personal - Director MKT.md` → NUNCA en este repo (negociacion, BATNA, Carbrok, Marketon)
- Datos financieros que Pepe pase bajo confianza → NUNCA en este repo
- Si dudas, pregunta antes de commitear

### 3. Work Sessions — modificables con marca de double-check
- Las work sessions son preferentemente estables una vez cerradas, pero **se pueden editar** si aparece informacion nueva que las afecte.
- Cuando se modifique una sesion ya cerrada, agregar un `## Addendum — <tema>` al final (no reescribir secciones anteriores) y dejar clara la fecha/motivo del cambio. Asi queda trazabilidad de que se hizo un double check.
- Si el cambio es grande o cambia conclusiones, mejor crear un addendum en una sesion futura y linkear desde la original.

### 4. KO Operativo es vivo
- `00-context/KO-Operativo.md` se actualiza cada sesion de trabajo
- Patron: agregar nuevo bloque `## Update YYYY-MM-DD` al inicio (no modificar updates anteriores)

### 5. Commits descriptivos con prefijos
- `add:` para archivos nuevos
- `update:` para cambios en docs existentes
- `fix:` para correcciones
- `security:` para temas de seguridad
- `session:` para snapshots de sesiones de trabajo
- `tech:` para docs tecnicas
- Co-author tag al final si Claude contribuyo: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`

### 6. Naming conventions
- Work sessions: `YYYY-MM-DD-work-session.md` (date prefix permite ordenar)
- Minutas: `Minuta-<Marca>-<Nombre>.md` (PascalCase, sin acentos)
- Docs tecnicas: `<Sistema>-<Aspecto>.md` (ej. `CRM-Worker-Arquitectura.md`)

---

## Workflow tipico (Claude en sesion)

Cuando termine una sesion de trabajo:

1. Crear `04-sessions/YYYY-MM-DD-work-session.md` con resumen completo de lo hecho
2. Si hubo cambios de status del piloto → actualizar `00-context/KO-Operativo.md` con nuevo bloque `## Update YYYY-MM-DD`
3. Si hubo nuevas decisiones tecnicas → crear/actualizar `03-tech/...`
4. Si hubo nuevas reglas de diseno → actualizar `02-design/...`
5. **Si creaste un doc nuevo (cualquier carpeta)** → registra 1 línea en `00-context/MAP-Plasencia.md` (tabla "Decisión por intent"). Actualiza también el pillar `00-context/pillars/MAP-*.md` correspondiente si el dominio lo amerita
6. **Actualiza `00-context/MAP-Plasencia.md` §"Estado vivo"** si el status del piloto cambió (LIVE/WIP/roto)
7. Commit: `git add . && git commit -m "session: <fecha breve descripcion>"`
8. Push: `git push`

---

## Routing de modelos por tarea (eficiencia de tokens)

Claude Code no tiene routing automatico de modelos. Adoptamos routing manual con 2 subagentes custom pre-configurados en `~/.claude/agents/`:

| Tarea | Modelo | Como invocar |
|-------|--------|--------------|
| Estrategia, framing, naming, juicio, decisiones con tradeoffs, redaccion de docs ejecutivos | **Opus** | Main thread (Claude responde directo) |
| Exploracion de archivos, lectura de sesiones, audits de repos, resumenes de commits, descubrimiento | **Sonnet** | `Agent(subagent_type: "explorer-sonnet")` |
| Extracciones mecanicas: listados, conteos, grep puntual, fechas, inventarios crudos | **Haiku** | `Agent(subagent_type: "extractor-haiku")` |

**Regla operativa:** Claude Opus en main thread decide al recibir cada prompt si delega o no. Delega por defecto cualquier barrido / lectura masiva / extraccion mecanica. Se queda con lo que requiere juicio estrategico o redaccion de artefactos finales.

**Subagentes custom viven en** `~/.claude/agents/explorer-sonnet.md` + `extractor-haiku.md`. Son globales (no per-proyecto).

---

## Source of truth = ESTE REPO

Despues del cleanup del 15 abril, **toda la documentacion no-confidencial vive solo aqui**. Se eliminaron los duplicados en local. Trabajar siempre directo en el clon del repo (`~/Documents/grupo-plasencia-docs/`).

**Excepciones que viven SOLO en local (no se duplican aqui):**

| Archivo | Donde vive | Por que solo local |
|---------|------------|--------------------|
| `Contexto Personal - Director MKT.md` | `~/Documents/Grupo Plasencia/Historial Claude/` | CONFIDENCIAL (negociacion, BATNA, Carbrok, Marketon) |
| Tokens / OAuth / API keys | iCloud `~/Documents/Claude Code Setup/` | Secrets — nunca a Git |
| Repos clonados de codigo | `~/Documents/Grupo Plasencia/<repo-name>/` | Codigo fuente, vive en su propio repo |
| Working assets temporales | `~/Documents/Grupo Plasencia/Motor de Atribucion MVP/Creativos/`, `Ofertas Comerciales/`, `Prototipos/` | Assets WIP, no docs |

---

## Repos hermanos

| Repo | Visibilidad | Proposito |
|------|-------------|-----------|
| `MktGrupoPlasenciaAutomotriz/grupo-plasencia-docs` | **Privado** | Esta documentacion |
| `MktGrupoPlasenciaAutomotriz/crm-worker` | **Privado** | Codigo del Cloudflare Worker que sirve el CRM |
| `MktGrupoPlasenciaAutomotriz/catalogo-seminuevos-piloto` | Publico | Landing Seminuevos + scripts de catalogo |
| `MktGrupoPlasenciaAutomotriz/landing-hyundai-plasencia` | Publico | Landing Hyundai |
| `MktGrupoPlasenciaAutomotriz/landing-stellantis-plasencia` | Publico | Landing Stellantis |
| `MktGrupoPlasenciaAutomotriz/crm-pipeline` | Publico | CRM legacy retirado (solo redirect al Worker) |
