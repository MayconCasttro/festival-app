// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
let getAuth: any;
let getFirestore: any;
let getStorage: any;
try {
  // import only when available to avoid runtime errors if firebase isn't installed/configured
  // (this keeps the module safe in environments without proper env vars)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ getAuth } = require('firebase/auth'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ getFirestore } = require('firebase/firestore'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ getStorage } = require('firebase/storage'));
} catch (e) {
  // noop - if imports fail, we'll handle via null exports below
}

// Configuração via variáveis de ambiente. Use `.env.local` com as chaves abaixo.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigPresent = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

if (!isConfigPresent && process.env.NODE_ENV === 'development') {
  console.warn('Firebase config appears incomplete. Create a .env.local file with NEXT_PUBLIC_FIREBASE_ keys.');
}

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _auth: Auth | null = null;

if (isConfigPresent) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  if (getFirestore) _db = getFirestore(app) as Firestore;
  if (getStorage) _storage = getStorage(app) as FirebaseStorage;
  if (getAuth) _auth = getAuth(app) as Auth;
}

export const db: any = _db;
export const storage: any = _storage;
export const auth: any = _auth;
export const isFirebaseConfigured = isConfigPresent;
