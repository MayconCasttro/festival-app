"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TRANSLATIONS } from '@/i18n/translations';
import { RESTAURANTS } from '@/lib/restaurants';
import RestaurantCard from '@/components/RestaurantCard';
import LocalizedText from './LocalizedText';

export default function LocalizedHome() {
  const [lang, setLang] = useState<'pt'|'en'|'es'|'fr'>('pt');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved && ['pt','en','es','fr'].includes(saved)) {
        setLang(saved as any);
      }
    } catch (e) {
      // ignore
    }
    // animação de entrada
    const timer = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(timer);
  }, []);

  const t = TRANSLATIONS[lang] ?? TRANSLATIONS['pt'];

  return (
    <div className={`flex min-h-screen items-start justify-center bg-linear-to-br from-orange-50 to-blue-50 pt-20 pb-20 transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <main className="text-center max-w-4xl px-6">
        <div className="mb-6">
          <div className="flex flex-col items-center">
            <Image src="/LOGO.png" alt="Núcleo Gastronômico" width={200} height={200} className="mx-auto mb-2" />

            <h1 className="text-4xl font-bold text-gray-800 mt-4">{t.welcomeTitle}</h1>
            <p className="text-xl text-gray-600 mb-4">{t.subtitle}</p>

            <button
              onClick={() => {
                try { localStorage.removeItem('lang'); } catch (e) { console.warn(e); }
                // recarrega para forçar a tela de boas-vindas
                window.location.reload();
              }}
              className="inline-block bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition"
            >
              <LocalizedText defaultText={TRANSLATIONS.pt.changeLanguage} translations={{ pt: TRANSLATIONS.pt.changeLanguage, en: TRANSLATIONS.en.changeLanguage, es: TRANSLATIONS.es.changeLanguage, fr: TRANSLATIONS.fr.changeLanguage }} />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.restaurantsHeading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {RESTAURANTS.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </main>
    </div>
  );
}