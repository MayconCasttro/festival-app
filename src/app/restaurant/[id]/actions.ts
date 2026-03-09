"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

type UploadReviewPhotoResult =
  | { ok: true; photoUrl: string }
  | { ok: false; error: string };

type SaveReviewResult =
  | { ok: true; reviewId: string }
  | { ok: false; error: string };

// 1. Função que sobe a imagem para o Storage
export async function uploadReviewPhoto(
  base64Data: string,
  mimeType: string,
): Promise<UploadReviewPhotoResult> {
  try {
    if (!storage) {
      return { ok: false, error: "Storage indisponível no servidor" };
    }
    if (!base64Data || !mimeType) {
      return { ok: false, error: "Dados da imagem inválidos" };
    }

    console.log("📸 Iniciando upload - tamanho Base64:", base64Data.length);

    // Converte Base64 para Uint8Array (mais compatível que Buffer)
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });

    // Cria um nome único para o arquivo
    const ext = mimeType.split("/")[1] || "jpg";
    const filename = `reviews/review-${Date.now()}.${ext}`;
    const storageRef = ref(storage, filename);

    console.log(`📤 Fazendo upload para: ${filename}`);

    // Faz o upload
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: mimeType,
    });
    console.log("✅ Upload concluído:", snapshot.ref.fullPath);

    // Pega o link público da imagem
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("✅ URL gerada com sucesso");

    return { ok: true, photoUrl: downloadURL };
  } catch (error: any) {
    console.error("❌ Erro no upload:", error);
    return { ok: false, error: error?.message || "Falha ao enviar imagem" };
  }
}

// 2. Função que salva os dados no Banco (Firestore)
export async function saveReviewToFirestore(data: {
  restaurantId: string;
  photoUrl: string;
  rating: number;
  comment: string;
  user: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
  } | null;
}): Promise<SaveReviewResult> {
  try {
    if (!db) {
      return { ok: false, error: "Banco de dados indisponível no servidor" };
    }

    const { user, ...reviewData } = data;

    const docData = {
      ...reviewData,
      createdAt: serverTimestamp(), // Data automática do servidor
      user: user
        ? {
            uid: user.uid,
            name: user.displayName,
            avatar: user.photoURL,
          }
        : null,
      userId: user ? user.uid : "user-anonimo", // Mantém userId para regras de segurança
    };

    const docRef = await addDoc(collection(db, "reviews"), docData);
    return { ok: true, reviewId: docRef.id };
  } catch (error) {
    console.error("Erro ao salvar review:", error);
    return { ok: false, error: "Falha ao salvar avaliação" };
  }
}
