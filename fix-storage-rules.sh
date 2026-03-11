#!/bin/bash

set -e

echo "🔥 Automatizando configuração das regras do Firebase Storage..."
echo ""

# Criar arquivo de regras correto
echo "📝 Criando arquivo storage.rules..."
cat > storage.rules << 'EOF'
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Permite usuários autenticados fazerem upload apenas de suas próprias fotos
    match /reviews/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOF

echo "✅ Arquivo storage.rules criado"
echo ""

# Criar firebase.json se não existir
echo "📝 Criando firebase.json..."
cat > firebase.json << 'EOF'
{
  "storage": {
    "rules": "storage.rules"
  }
}
EOF

echo "✅ Arquivo firebase.json criado"
echo ""

# Criar .firebaserc
echo "📝 Criando .firebaserc..."
cat > .firebaserc << 'EOF'
{
  "projects": {
    "default": "nucleo-gastronomico"
  }
}
EOF

echo "✅ Arquivo .firebaserc criado"
echo ""

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI não encontrado"
    echo "📦 Instalando Firebase CLI localmente no projeto..."
    npm install --save-dev firebase-tools
    echo "✅ Firebase CLI instalado"
    FIREBASE_CMD="npx firebase"
else
    echo "✅ Firebase CLI já instalado"
    FIREBASE_CMD="firebase"
fi

echo ""
echo "🔐 Iniciando autenticação no Firebase..."
echo "   (Uma janela do navegador será aberta)"
echo ""

$FIREBASE_CMD login --no-localhost

echo ""
echo "🚀 Aplicando regras do Storage..."
$FIREBASE_CMD deploy --only storage

echo ""
echo "✅ Regras aplicadas com sucesso!"
echo ""
echo "🔍 Verificando regras atuais..."
firebase projects:list

echo ""
echo "✅ CONCLUÍDO! As regras do Firebase Storage foram atualizadas."
echo ""
echo "Agora teste o upload de fotos em: https://nucleo-gastronomicocd.vercel.app"
