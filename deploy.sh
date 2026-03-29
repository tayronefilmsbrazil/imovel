#!/usr/bin/env bash
# deploy.sh — Publica a landing page no Netlify via CLI
# Uso: bash deploy.sh
set -e

echo ""
echo "═══════════════════════════════════════"
echo "  Deploy — Landing Page Imóvel"
echo "  Tayrone Films"
echo "═══════════════════════════════════════"
echo ""

# Verifica se o Netlify CLI está instalado
if ! command -v netlify &>/dev/null; then
  echo "❌ Netlify CLI não encontrado."
  echo ""
  echo "Para instalar, execute:"
  echo "  npm install -g netlify-cli"
  echo ""
  echo "Depois faça login:"
  echo "  netlify login"
  echo ""
  exit 1
fi

echo "✅ Netlify CLI encontrado: $(netlify --version)"
echo ""

# Verifica se já está linkado a um site
if [ ! -f ".netlify/state.json" ]; then
  echo "⚙️  Site não configurado. Iniciando setup..."
  echo "   (Você será guiado para criar ou vincular um site Netlify)"
  echo ""
  netlify init
else
  echo "✅ Site Netlify já configurado."
fi

echo ""
echo "🚀 Publicando..."
echo ""

# Faz o deploy de todos os arquivos da pasta atual
netlify deploy --prod --dir . --message "Landing Page Essence Tatuamunha — $(date '+%d/%m/%Y %H:%M')"

echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Deploy concluído!"
echo "  Acesse a URL acima para ver o site."
echo "═══════════════════════════════════════"
echo ""
