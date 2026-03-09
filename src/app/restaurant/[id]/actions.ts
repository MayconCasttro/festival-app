"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

// 1. Função que sobe a imagem para o Storage
export async function uploadReviewPhoto(base64Data: string, mimeType: string) {
  try {
    // Converte Base64 para Buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Cria um nome único para o arquivo
    const ext = mimeType.split("/")[1] || "jpg";
    const filename = `reviews/review-${Date.now()}.${ext}`;
    const storageRef = ref(storage, filename);

    console.log(`Fazendo upload para: ${filename}`);

    // Faz o upload
    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: mimeType,
    });
    console.log("✅ Upload concluído:", snapshot.ref.fullPath);

    // Pega o link público da imagem
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("✅ URL gerada:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    throw new Error("Falha ao enviar imagem");
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
}) {
  try {
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
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar review:", error);
    throw new Error("Falha ao salvar avaliação");
  }
}
