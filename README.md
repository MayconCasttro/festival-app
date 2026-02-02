# nucleo-gastronomico
Votação

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## Environment variables (Firebase) 🔒

This project requires Firebase configuration to be provided via environment variables. Copy `.env.example` to `.env.local` and fill the values from your Firebase project settings.

Example:

```bash
cp .env.example .env.local
# then edit .env.local and paste your Firebase values
```

Required variables (prefix with `NEXT_PUBLIC_` so client code can access them when needed):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Note: `.env.local` is ignored by `.gitignore`. If you previously committed credentials, rotate them now and remove them from the repo.

This project reads these variables in `src/lib/firebase.ts`.

### Autenticação (OAuth) 🔐

Para habilitar o login (Google, GitHub, Microsoft, Apple) no Firebase Console:

- Ative os provedores em **Authentication → Sign-in method**.
- Para **GitHub** configure Client ID e Client Secret no provedor GitHub.
- Adicione seu domínio de desenvolvimento (`localhost:3000`) em **Authentication → Authorized domains**.
- Use os valores do projeto nas variáveis `NEXT_PUBLIC_FIREBASE_*` descritas acima.
- Após atualizar `.env.local`, reinicie o servidor (`npm run dev`).

Durante desenvolvimento, se você optar por não configurar o Firebase, existe um botão **"Entrar como Dev (demo)"** no modal de avaliação que cria um usuário local apenas para testes (não persiste no servidor nem no Firestore).

## Quick Troubleshooting

- If you see runtime errors like `Firebase: Error (auth/invalid-api-key)`, ensure `.env.local` exists and values are correct.
- After creating or updating `.env.local`, restart the dev server: `npm run dev`.
- During development the app will show a friendly message in the review modal if Firebase isn't configured.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
