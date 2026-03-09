#!/bin/bash

# Script para adicionar variáveis de ambiente no Vercel
# Execute: bash setup-vercel-env.sh

echo "🚀 Subindo variáveis de ambiente para Vercel..."

# Verificar se Vercel CLI está instalada
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Fazer login no Vercel (vai abrir browser)
echo "🔐 Autenticando com Vercel..."
vercel login

# Conectar ao projeto
echo "🔗 Conectando ao projeto..."
vercel link --project nucleo-gastronomicocd

# Subir as variáveis de ambiente
echo "📤 Subindo variáveis de ambiente..."

vercel env add NEXT_PUBLIC_FIREBASE_API_KEY AIzaSyDTL_3ZUsF5EfqODjXyE0PRb2bISm4WFtU
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN nucleo-gastronomico.firebaseapp.com
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID nucleo-gastronomico
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET nucleo-gastronomico.firebasestorage.app
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID 518132716124
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID 1:518132716124:web:148f8d9fdb6d2233128c99

echo "✅ Variáveis enviadas com sucesso!"
echo "🔄 Fazendo redeploy do projeto..."
vercel deploy --prod

echo "🎉 Deploy concluído!"
