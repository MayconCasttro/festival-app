"use client";

import Link from "next/link";
import Image from "next/image";
import type { Restaurant } from "@/lib/restaurants";
import LocalizedText from "./LocalizedText";
import { TRANSLATIONS } from "@/i18n/translations";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant: r }: RestaurantCardProps) {
  const nameTranslations = {
    pt: r.name,
    en: r.i18n?.en?.name ?? r.name,
    es: r.i18n?.es?.name ?? r.name,
    fr: r.i18n?.fr?.name ?? r.name,
  };

  const descTranslations = {
    pt: r.description,
    en: r.i18n?.en?.description ?? r.description,
    es: r.i18n?.es?.description ?? r.description,
    fr: r.i18n?.fr?.description ?? r.description,
  };

  const dishNameTranslations = {
    pt: r.dishName,
    en: r.i18n?.en?.dishName ?? r.dishName,
    es: r.i18n?.es?.dishName ?? r.dishName,
    fr: r.i18n?.fr?.dishName ?? r.dishName,
  };

  return (
    <Link
      href={`/restaurant/${r.id}`}
      className="group flex flex-col text-center bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
    >
      <div className="relative h-40 w-full overflow-hidden rounded mb-3">
        {r.dishImage ? (
          <Image
            src={r.dishImage}
            alt={r.dishName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
      </div>
      <div className="flex flex-col grow justify-between">
        <div className="text-center">
          <h3 className="font-bold text-lg text-gray-800">
            <LocalizedText
              defaultText={r.name}
              translations={nameTranslations}
            />
          </h3>
          <p className="text-sm text-gray-500">
            <LocalizedText
              defaultText={r.description}
              translations={descTranslations}
            />
          </p>
          <p className="mt-2 text-sm text-gray-700 font-medium">
            <LocalizedText
              defaultText={`Prato: ${r.dishName}`}
              translations={{
                pt: `Prato: ${r.dishName}`,
                en: `Dish: ${dishNameTranslations.en}`,
                es: `Plato: ${dishNameTranslations.es}`,
                fr: `Plat: ${dishNameTranslations.fr}`,
              }}
            />
          </p>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const url = `https://www.google.com/maps/dir/?api=1&destination=${r.coords?.lat},${r.coords?.lng}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            className="inline-block bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition"
            aria-label={`Abrir rotas para ${r.name} no Google Maps`}
          >
            <LocalizedText
              defaultText={TRANSLATIONS.pt.takeMeThere}
              translations={{
                pt: TRANSLATIONS.pt.takeMeThere,
                en: TRANSLATIONS.en.takeMeThere,
                es: TRANSLATIONS.es.takeMeThere,
                fr: TRANSLATIONS.fr.takeMeThere,
              }}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}
