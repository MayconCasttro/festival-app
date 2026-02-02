// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Configuração via variáveis de ambiente. Use `.env.local` com as chaves abaixo.
// Se as variáveis não estiverem definidas (ex.: dev), usamos um fallback público do projeto
// fornecido pelo mantenedor.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDTL_3ZUsF5EfqODjXyE0PRb2bISm4WFtU',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'nucleo-gastronomico.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'nucleo-gastronomico',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'nucleo-gastronomico.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '518132716124',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:518132716124:web:148f8d9fdb6d2233128c99',
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

  // Inicializa Firestore de forma segura — em alguns ambientes (p.ex. runtimes SSR) o serviço
  // pode não estar disponível e lançar. Tratamos com try/catch para evitar crashes.
  if (getFirestore) {
    try {
      _db = getFirestore(app) as Firestore;
    } catch (e) {
      console.warn('Firestore não disponível neste ambiente:', e);
      _db = null;
    }
  }

  if (getStorage) {
    try {
      _storage = getStorage(app) as FirebaseStorage;
    } catch (e) {
      console.warn('Storage não disponível neste ambiente:', e);
      _storage = null;
    }
  }

  if (getAuth) {
    try {
      _auth = getAuth(app) as Auth;
    } catch (e) {
      console.warn('Auth não disponível neste ambiente:', e);
      _auth = null;
    }
  }
}

export const db: any = _db;
export const storage: any = _storage;
export const auth: any = _auth;
// Consideramos o Firebase "configurado" apenas se a app foi inicializada e o Auth está disponível.
export const isFirebaseConfigured = Boolean(app && _auth);
