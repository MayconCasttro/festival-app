// src/app/api/firebase-check/route.ts
import { isFirebaseConfigured, auth, db, storage } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  return NextResponse.json({
    isConfigured: isFirebaseConfigured,
    environment: process.env.NODE_ENV,
    variables: {
      apiKey: firebaseConfig.apiKey ? "✓ configurada" : "✗ FALTA",
      authDomain: firebaseConfig.authDomain ? "✓ configurada" : "✗ FALTA",
      projectId: firebaseConfig.projectId ? "✓ configurada" : "✗ FALTA",
      storageBucket: firebaseConfig.storageBucket ? "✓ configurada" : "✗ FALTA",
      messagingSenderId: firebaseConfig.messagingSenderId
        ? "✓ configurada"
        : "✗ FALTA",
      appId: firebaseConfig.appId ? "✓ configurada" : "✗ FALTA",
    },
    services: {
      auth: !!auth,
      db: !!db,
      storage: !!storage,
    },
  });
}
