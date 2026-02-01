"use client";

import { KeyboardEvent } from 'react';
import { useState, FormEvent } from 'react';

interface ReviewFormProps {
  restaurantId: string;
  onSubmitSuccess?: () => void; // Adicione esta linha
}


export default function ReviewForm({ restaurantId, onSubmitSuccess }: ReviewFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleStarKeyDown = (e: KeyboardEvent<HTMLButtonElement>, starValue: number) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setRating(starValue);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação de estrelas.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    // Aqui você adicionaria a lógica para enviar os dados para sua API.
    // Por exemplo, usando FormData para enviar a imagem e os outros dados.
    const formData = new FormData();
    formData.append('restaurantId', restaurantId);
    formData.append('customerName', customerName);
    formData.append('rating', String(rating));
    formData.append('comment', comment);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      // Envia os dados para a nossa nova API Route
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao enviar avaliação.');
      }

      // Se a submissão for bem-sucedida, chama a função de sucesso
      onSubmitSuccess?.();
    } catch (apiError) {
      setError((apiError as Error).message || 'Houve um erro ao enviar sua avaliação. Tente novamente.');
      console.error(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold border-b pb-2">Deixe sua Avaliação</h3>
      
      {/* Identificação do Cliente */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Seu Nome</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ex: João Silva"
          required
        />
      </div>

      {/* Avaliação com Estrelas */}
      <div>
        <label id="rating-label" className="block text-sm font-medium text-gray-700">Sua Avaliação</label>
        <div role="radiogroup" aria-labelledby="rating-label" className="flex items-center">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <button
              type="button"
              key={starValue}
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`${starValue} de 5 estrelas`}
              onClick={() => setRating(starValue)}
              onKeyDown={(e) => handleStarKeyDown(e, starValue)}
              className="p-1 bg-transparent border-none"
              style={{ cursor: 'pointer', color: starValue <= rating ? 'gold' : 'lightgray', fontSize: '2rem', lineHeight: '1' }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Comentário */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comentário</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Descreva sua experiência..."
        ></textarea>
      </div>

      {/* Upload de Foto */}
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Adicionar Foto</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        {photo && (
          <p className="text-sm text-gray-600 mt-2">Arquivo selecionado: {photo.name}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Para tirar uma foto diretamente, acesse pelo seu celular.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}