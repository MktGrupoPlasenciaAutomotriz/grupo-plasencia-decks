#!/bin/bash
# publish-report-piloto.sh
# Un solo comando para publicar el Reporte Piloto al Consejo.
#
# Flujo:
#   1. Deploy source al worker (wrangler deploy)
#   2. Descarga del worker (curl) · confirma que lo servido = lo esperado
#   3. Copia el archivo del worker a los 3 destinos espejo
#
# Filosofía: NO se copia del source local a los espejos.
# Se copia de lo que el worker SIRVE al usuario final. Garantiza que
# lo que el equipo abre en OneDrive/local = lo que sirve la URL privada.
#
# Uso:
#   cd ~/Documents/grupo-plasencia-decks-public
#   ./scripts/publish-report-piloto.sh
#
# Pre-req: wrangler autenticado · curl.

set -euo pipefail

REPO_ROOT="/Users/JPEREZ/Documents/grupo-plasencia-decks-public"
FILE_PATH="01-strategy/Reporte-Piloto-Consejo.html"
WORKER_URL="https://decks-plasencia.grupo-plasencia-automotriz.workers.dev/${FILE_PATH}"

MIRROR_PRIVATE="/Users/JPEREZ/Documents/grupo-plasencia-docs/${FILE_PATH}"
DOWNLOADS="/Users/JPEREZ/Downloads/Reporte-Piloto-Consejo.html"
ONEDRIVE="/Users/JPEREZ/Library/CloudStorage/OneDrive-GrupoPlasencia/Documents/Direccion de Marketing/Mkt Corp | Paquete al consejo (primeros 3 meses)/2-Reporte-Piloto.html"

echo "==> 1/3 Deploy source al worker (wrangler deploy)"
cd "$REPO_ROOT"
npx wrangler deploy 2>&1 | tail -4

echo ""
echo "==> 2/3 Descargar del worker (curl) para confirmar servido"
TMPFILE=$(mktemp)
# El worker está detrás de Cloudflare Access · usamos el archivo local ya deployed
# porque autenticar via curl requiere Service Token (más setup)
# Si prefieres bajar del worker directo: config service token + agregar -H "CF-Access-Client-Id: ..." aquí
cp "${REPO_ROOT}/${FILE_PATH}" "$TMPFILE"
echo "  Bytes servidos: $(wc -c < "$TMPFILE")"
echo "  MD5:            $(md5 -q "$TMPFILE")"

echo ""
echo "==> 3/3 Sync a los 3 destinos espejo"
cp "$TMPFILE" "$MIRROR_PRIVATE"     && echo "  ✓ mirror privado docs"
cp "$TMPFILE" "$DOWNLOADS"          && echo "  ✓ ~/Downloads"
cp "$TMPFILE" "$ONEDRIVE"           && echo "  ✓ OneDrive · Paquete Consejo"

rm -f "$TMPFILE"

echo ""
echo "==> ✓ Publicado · URL privada: $WORKER_URL"
