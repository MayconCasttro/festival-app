// src/app/restaurant/[id]/page.tsx
import ReviewModal from "@/components/ReviewModal";
import RestaurantDetails from "@/components/RestaurantDetails";
import LocalizedText from "@/components/LocalizedText";
import { TRANSLATIONS } from "@/i18n/translations";
import { MapPin } from "lucide-react";
import Image from "next/image";

import { getRestaurantById } from "@/lib/restaurants";
export const dynamic = "force-dynamic";
export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <main className="max-w-md mx-auto min-h-screen bg-white pb-20 shadow-xl overflow-hidden p-6">
        <h2 className="text-xl font-bold">
          <LocalizedText
            defaultText={TRANSLATIONS.pt.notFoundTitle}
            translations={{
              pt: TRANSLATIONS.pt.notFoundTitle,
              en: TRANSLATIONS.en.notFoundTitle,
              es: TRANSLATIONS.es.notFoundTitle,
              fr: TRANSLATIONS.fr.notFoundTitle,
            }}
          />
        </h2>
        <p className="text-gray-600">
          <LocalizedText
            defaultText={TRANSLATIONS.pt.notFoundMessage}
            translations={{
              pt: TRANSLATIONS.pt.notFoundMessage,
              en: TRANSLATIONS.en.notFoundMessage,
              es: TRANSLATIONS.es.notFoundMessage,
              fr: TRANSLATIONS.fr.notFoundMessage,
            }}
          />
        </p>
      </main>
    );
  }

  const lat = restaurant.coords?.lat ?? 0;
  const lng = restaurant.coords?.lng ?? 0;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-white pb-20 shadow-xl overflow-hidden">
      {/* 1. Imagem de Capa (Hero) */}
      <div className="relative h-72 w-full">
        {restaurant.dishImage && restaurant.dishImage.trim() ? (
          <Image
            src={restaurant.dishImage}
            alt={restaurant.dishName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-gray-200 h-full w-full" />
        )}
        {/* Gradiente para o texto ficar legível */}
        <div className="absolute bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent w-full p-6 pt-20">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
            <LocalizedText
              defaultText={TRANSLATIONS.pt.participantDishLabel}
              translations={{
                pt: TRANSLATIONS.pt.participantDishLabel,
                en: TRANSLATIONS.en.participantDishLabel,
                es: TRANSLATIONS.es.participantDishLabel,
                fr: TRANSLATIONS.fr.participantDishLabel,
              }}
            />
          </span>
          {/* dish name is client-localized */}
          <h1 className="text-white text-3xl font-bold leading-tight">
            <LocalizedText
              defaultText={restaurant.dishName}
              translations={{
                pt: restaurant.dishName,
                en: restaurant.i18n?.en?.dishName ?? restaurant.dishName,
                es: restaurant.i18n?.es?.dishName ?? restaurant.dishName,
                fr: restaurant.i18n?.fr?.dishName ?? restaurant.dishName,
              }}
            />
          </h1>
        </div>
      </div>

      <div className="p-6 -mt-4 bg-white rounded-t-3xl relative z-10">
        {/* 2. Informações do Restaurante */}
        <div className="mb-4">
          {/* Client component renders localized details */}
          <RestaurantDetails restaurant={restaurant} />
        </div>

        {/* 4. Botão Review */}
        <ReviewModal
          restaurantId={restaurant.id}
          restaurantLat={lat}
          restaurantLng={lng}
        />
      </div>
    </main>
  );
}
