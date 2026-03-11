#!/bin/bash

echo "🔥 Firebase Storage - Deploy das Regras"
echo ""
echo "Este script irá fazer login e aplicar as regras do Storage"
echo ""

# Desabilitar analytics
export FIREBASE_CLI_EXPERIMENTS=""

# Login
echo "1️⃣ Fazendo login no Firebase..."
echo ""
echo "⚠️  Uma janela do navegador será aberta"
echo "⚠️  Faça login com sua conta Google que tem acesso ao projeto 'nucleo-gastronomico'"
echo ""
read -p "Pressione ENTER para continuar..."

npx firebase login --no-localhost --interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Login realizado com sucesso!"
    echo ""
    echo "2️⃣ Aplicando regras do Storage..."
    echo ""
    
    npx firebase deploy --only storage
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCESSO! Regras aplicadas com sucesso!"
        echo ""
        echo "Teste o upload de fotos agora em: https://nucleo-gastronomicocd.vercel.app"
        echo ""
    else
        echo ""
        echo "❌ Erro ao aplicar regras. Verifique:"
        echo "   - Se você tem permissão no projeto 'nucleo-gastronomico'"
        echo "   - Se o Storage está ativado no Firebase Console"
        echo ""
    fi
else
    echo ""
    echo "❌ Erro no login. Tente novamente."
    echo ""
fi
