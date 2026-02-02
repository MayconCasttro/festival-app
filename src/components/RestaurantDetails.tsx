"use client";

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import LocalizedText from './LocalizedText';
import type { Restaurant } from '@/lib/restaurants';
import { TRANSLATIONS } from '@/i18n/translations';

export default function RestaurantDetails({ restaurant }: { restaurant: Restaurant }) {
  const dishNameTranslations = {
    pt: restaurant.dishName,
    en: restaurant.i18n?.en?.dishName ?? restaurant.dishName,
    es: restaurant.i18n?.es?.dishName ?? restaurant.dishName,
    fr: restaurant.i18n?.fr?.dishName ?? restaurant.dishName,
  };

  const nameTranslations = {
    pt: restaurant.name,
    en: restaurant.i18n?.en?.name ?? restaurant.name,
    es: restaurant.i18n?.es?.name ?? restaurant.name,
    fr: restaurant.i18n?.fr?.name ?? restaurant.name,
  };

  const descTranslations = {
    pt: restaurant.description,
    en: restaurant.i18n?.en?.description ?? restaurant.description,
    es: restaurant.i18n?.es?.description ?? restaurant.description,
    fr: restaurant.i18n?.fr?.description ?? restaurant.description,
  };

  const dishDescTranslations = {
    pt: restaurant.dishDescription ?? '',
    en: restaurant.i18n?.en?.dishDescription ?? restaurant.dishDescription ?? '',
    es: restaurant.i18n?.es?.dishDescription ?? restaurant.dishDescription ?? '',
    fr: restaurant.i18n?.fr?.dishDescription ?? restaurant.dishDescription ?? '',
  };

  return (
    <div>
      {/* Hero (client-side image already handled in server, we just render texts) */}

      <div className="p-6 -mt-4 bg-white rounded-t-3xl relative z-10">
        {/* 2. Informações do Restaurante */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1"><LocalizedText defaultText={restaurant.name} translations={nameTranslations} /></h2>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={16} className="mr-1" />
            <span>{restaurant.address}</span>
          </div>
        </div>

        {/* 3. Descrição do prato */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4"><LocalizedText defaultText={restaurant.description} translations={descTranslations} /></p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8"><LocalizedText defaultText={restaurant.dishDescription ?? ''} translations={dishDescTranslations} /></p>

      </div>
    </div>
  );
}
