import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const restaurantId = formData.get('restaurantId') as string;
    const customerName = formData.get('customerName') as string;
    const rating = formData.get('rating') as string;
    const comment = formData.get('comment') as string;
    const photo = formData.get('photo') as File | null;

    if (!restaurantId || !customerName.trim() || !rating) {
      return NextResponse.json(
        { error: 'Dados do formulário incompletos.' },
        { status: 400 }
      );
    }

    if (customerName.trim().length > 100) {
      return NextResponse.json(
        { error: 'O nome do cliente não pode ter mais de 100 caracteres.' },
        { status: 400 }
      );
    }
    if (comment.trim().length > 5000) {
      return NextResponse.json(
        { error: 'O comentário não pode ter mais de 5000 caracteres.' },
        { status: 400 }
      );
    }

    let photoUrl = '';

    // 1. Faz o upload da foto, se existir
    if (photo) {
      // Cria um nome de arquivo único para evitar conflitos
      const photoName = `review-${Date.now()}-${photo.name}`;
      const storageRef = ref(storage, `reviews/${photoName}`);

      // Converte o arquivo para um buffer para o upload
      const photoBuffer = await photo.arrayBuffer();
      await uploadBytes(storageRef, photoBuffer);

      // Obtém a URL pública da imagem
      photoUrl = await getDownloadURL(storageRef);
    }

    // 2. Salva os dados da avaliação no Firestore
    const reviewData = {
      restaurantId,
      customerName,
      rating: Number(rating),
      comment,
      photoUrl, // Salva a URL da imagem
      createdAt: serverTimestamp(), // Adiciona a data de criação
    };

    const docRef = await addDoc(collection(db, 'reviews'), reviewData);

    return NextResponse.json({
      message: 'Avaliação salva com sucesso!',
      reviewId: docRef.id,
    });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}