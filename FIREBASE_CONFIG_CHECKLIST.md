/\*\*

- Checklist de Configuração do Firebase para Autenticação Google
-
- Execute este diagnóstico para verificar se tudo está configurado corretamente.
  \*/

// 1. Verificar variáveis de ambiente
console.log('📋 Verificando variáveis de ambiente:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅' : '❌');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅' : '❌');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌');

// 2. Checklist para configurar em Vercel
console.log(`
📋 CHECKLIST - Configure em: https://vercel.com/dashboard/nucleo-gastronomicocd/settings/environment-variables

✅ Step 1: Adicione as variáveis no Vercel:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

✅ Step 2: No Firebase Console (https://console.firebase.google.com):
Projeto: "nucleo-gastronomico"

a) Authentication → Sign-in method
☐ Google: ATIVADO
☐ GitHub: ATIVADO (opcional)

b) Firestore Database
☐ Status: CRIADO (rules devem permitir leitura/escrita)

c) Storage
☐ Status: CRIADO
☐ Rules: Devem permitir upload/download autenticado

✅ Step 3: Nos Settings da Web App:
☐ Copie as 6 chaves e adicione em Vercel

✅ Step 4: Após adicionar em Vercel:

- Aguarde 1-2 minutos para redeploy
- Execute um novo build: git push origin main
  `);
