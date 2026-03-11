#!/bin/bash

echo "🔥 Aplicando regras do Firebase Storage..."
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

echo "✅ Arquivo storage.rules criado com as regras corretas"
echo ""

# Criar firebase.json
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
cat > .firebaserc << 'EOF'
{
  "projects": {
    "default": "nucleo-gastronomico"
  }
}
EOF

echo "✅ Arquivo .firebaserc criado"
echo ""

echo "🔐 Agora vamos fazer login e aplicar as regras..."
echo ""
echo "Execute os seguintes comandos:"
echo ""
echo "  1️⃣  npx firebase login"
echo "  2️⃣  npx firebase deploy --only storage"
echo ""
echo "Ou execute este comando único:"
echo ""
echo "  npx firebase login && npx firebase deploy --only storage"
echo ""
