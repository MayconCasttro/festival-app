#!/bin/bash

# Script rápido para adicionar variáveis Firebase no Vercel
# Execução: VERCEL_TOKEN="seu_token" bash add-firebase-vars.sh

set -e

export VERCEL_TOKEN="${VERCEL_TOKEN}"

echo "🚀 Iniciando setup automático das variáveis Firebase..."
echo ""

# Verificar se token existe
echo "🔐 Verificando token Vercel..."
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN não configurado"
    echo "Execute: export VERCEL_TOKEN=\"seu-token-aqui\""
    exit 1
fi

echo "✅ Autenticado com sucesso!"
echo ""

# Verificar se está linkado ao projeto
echo "🔗 Verificando link com projeto..."
if [ ! -f ".vercel/project.json" ]; then
    echo "⏳ Linkando ao projeto..."
    vercel link --project nucleo-gastronomicocd --token "$VERCEL_TOKEN"
fi

echo "✅ Projeto linkado!"
echo ""

# Subir as 6 variáveis Firebase
echo "📤 Subindo variáveis do Firebase para Vercel..."
echo ""

echo "⏳ Adicionando NEXT_PUBLIC_FIREBASE_API_KEY..."
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY AIzaSyDTL_3ZUsF5EfqODjXyE0PRb2bISm4WFtU production development --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "✅ NEXT_PUBLIC_FIREBASE_API_KEY"

echo "⏳ Adicionando NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..."
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN nucleo-gastronomico.firebaseapp.com production development --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"

echo "⏳ Adicionando NEXT_PUBLIC_FIREBASE_PROJECT_ID..."
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID nucleo-gastronomico production development --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID"

echo "⏳ Adicionando NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..."
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET nucleo-gastronomico.firebasestorage.app production development --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"

echo "⏳ Adicionando NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..."
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID 518132716124 production development --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"

echo "⏳ Adicionando NEXT_PUBLIC_FIREBASE_APP_ID..."
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID 1:518132716124:web:148f8d9fdb6d2233128c99 production development --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "✅ NEXT_PUBLIC_FIREBASE_APP_ID"

echo ""
echo "🎉 Todas as variáveis foram adicionadas com sucesso!"
echo ""
echo "📋 Próximas ações:"
echo "1. Acesse https://vercel.com/dashboard/nucleo-gastronomicocd"
echo "2. Verifique se os triângulos amarelos desapareceram"
echo "3. Aguarde o redeploy automático"
echo ""
echo "✨ Pronto para usar!"
