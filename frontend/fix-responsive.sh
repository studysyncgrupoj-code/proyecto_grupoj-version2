#!/bin/bash

echo "==========================================="
echo "      STUDYSYNC RESPONSIVE AUDIT"
echo "==========================================="

echo ""
echo "=== 100vh ==="
grep -RIn "100vh" src --include="*.css"

echo ""
echo "=== overflow:hidden ==="
grep -RInE "overflow(-x|-y)?:[[:space:]]*hidden" src --include="*.css"

echo ""
echo "=== position:fixed ==="
grep -RIn "position:[[:space:]]*fixed" src --include="*.css"

echo ""
echo "=== display:none ==="
grep -RIn "display:[[:space:]]*none" src --include="*.css"

echo ""
echo "=== min-width grandes ==="
grep -RInE "min-width:[[:space:]]*[0-9]{3,}px" src --include="*.css"

echo ""
echo "==========================================="
echo "          FIN DE AUDITORÍA"
echo "==========================================="