#!/usr/bin/env bash
# Serveur local pour le dev.
# Ouvrir le fichier en file:// ne marche pas : le service worker ET les vidéos
# YouTube exigent une vraie origine http(s). Lancer plutôt :
#     ./serve.sh            # http://localhost:8000
#     ./serve.sh 3000       # port au choix
set -euo pipefail
cd "$(dirname "$0")"
port="${1:-8000}"
echo "→ http://localhost:${port}"
exec python3 -m http.server "${port}"
