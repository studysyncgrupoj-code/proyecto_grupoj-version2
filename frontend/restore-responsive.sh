#!/bin/bash

echo "==========================================="
echo "   STUDYSYNC - RESTAURANDO CSS AUTOMATICO"
echo "==========================================="

find src -type f -name "*.css" -print0 | while IFS= read -r -d '' file
do
  echo "Revisando: $file"

  perl -0pi -e '
    s/min-min-height:\s*100dvh;\s*height:\s*auto;/min-height: 100vh;/g;
    s/min-height:\s*100dvh;\s*height:\s*auto;/height: 100vh;/g;
    s/overflow-x:\s*hidden;\s*overflow-y:\s*auto;/overflow: hidden;/g;
  ' "$file"
done

echo ""
echo "==========================================="
echo " RESTAURACION TERMINADA"
echo "==========================================="