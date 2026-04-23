# grupo-plasencia-decks

Mirror publico de los decks estrategicos de la Direccion de Marketing Corporativo de Grupo Plasencia Automotriz.

## Site

Publicado via GitHub Pages:
**https://mktgrupoplasenciaautomotriz.github.io/grupo-plasencia-decks/**

## Decks

| Deck | URL |
|------|-----|
| Centro de Excelencia MKT Corporativo AI-powered (Consejo v2) | `/01-strategy/Centro-Excelencia-MKT-Consejo-Deck.html` |
| Motor de Atribucion MVP &middot; Playbook Operativo | `/01-strategy/Motor-de-Atribucion-MVP-Playbook-Operativo.html` |
| Driving Growth &middot; Resumen Ejecutivo | `/01-strategy/Driving-Growth-Executive-Summary.html` |
| Driving Growth &middot; Deck Completo | `/01-strategy/Driving-Growth-Deck.html` |

## Arquitectura

Este repo **no es fuente de verdad**. Es un mirror publicado para compartir.

- **Source of truth** = `grupo-plasencia-docs` (privado). Ahi se itera y edita.
- **Este repo** = copia publicada de los HTML finales + assets. Se sincroniza via script.

### Sync workflow

Para publicar la version mas reciente desde el repo privado:

```bash
cd ~/Documents/grupo-plasencia-decks-public
./sync.sh
git add .
git commit -m "sync: <descripcion>"
git push
```

## Navegacion dentro de cada deck

- Flechas `&larr; &rarr;` o espacio: avanzar
- `Home` / `End`: primera / ultima slide
- Click izquierdo (1/3 del ancho) = atras, resto = adelante
- Touch swipe en mobile

## Uso

Uso interno Grupo Plasencia Automotriz. Contenido estrategico.
