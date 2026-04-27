#!/bin/bash
# Sync publico desde el repo privado grupo-plasencia-docs
# Uso: ./sync.sh desde la raiz de grupo-plasencia-decks-public

set -e

SRC="$HOME/Documents/grupo-plasencia-docs"
DEST="$(cd "$(dirname "$0")" && pwd)"

if [ ! -d "$SRC" ]; then
  echo "ERROR: No se encuentra $SRC"
  exit 1
fi

echo "Sync desde: $SRC"
echo "Sync hacia: $DEST"
echo ""

# Decks HTML
mkdir -p "$DEST/01-strategy"
for f in \
  "Motor-Atribucion-Piloto-Deck.html" \
  "Centro-Excelencia-MKT-Consejo-Deck.html" \
  "Motor-de-Atribucion-MVP-Playbook-Operativo.html" \
  "Driving-Growth-Deck.html" \
  "Driving-Growth-Executive-Summary.html"; do
  if [ -f "$SRC/01-strategy/$f" ]; then
    cp "$SRC/01-strategy/$f" "$DEST/01-strategy/$f"
    echo "[OK]  $f"
  else
    echo "[SKIP] $f (no existe en source)"
  fi
done

# Logos
mkdir -p "$DEST/assets/logos"
cp "$SRC/assets/logos/"*.png "$DEST/assets/logos/" 2>/dev/null && echo "[OK]  assets/logos/*.png" || echo "[SKIP] logos"

# Screenshots
mkdir -p "$DEST/assets/screenshots"
cp "$SRC/assets/screenshots/"*.png "$DEST/assets/screenshots/" 2>/dev/null && echo "[OK]  assets/screenshots/*.png" || echo "[SKIP] screenshots"

echo ""
echo "Sync completo. Ahora:"
echo "  cd $DEST"
echo "  git add ."
echo "  git commit -m 'sync: <descripcion>'"
echo "  git push"
