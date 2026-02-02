"use client";

import Image from 'next/image';
import React from 'react';
import { TRANSLATIONS } from '@/i18n/translations';

interface Props {
  onChoose: (code: string) => void;
  isLeaving?: boolean;
}

export default function WelcomeScreen({ onChoose, isLeaving }: Props) {
  const t = TRANSLATIONS['pt'];

  return (
    <div className={`flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-blue-50 transition-opacity duration-400 ${isLeaving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center max-w-sm px-6">
        <Image src="/LOGO.png" alt="Festival" width={220} height={220} className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.welcomeTitle}</h1>
        <p className="text-sm text-gray-600 mb-6">{t.chooseLanguage}</p>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onChoose('pt')} className="py-3 rounded-lg bg-green-600 text-white">Português</button>
          <button onClick={() => onChoose('en')} className="py-3 rounded-lg bg-blue-600 text-white">English</button>
          <button onClick={() => onChoose('es')} className="py-3 rounded-lg bg-orange-500 text-white">Español</button>
          <button onClick={() => onChoose('fr')} className="py-3 rounded-lg bg-gray-800 text-white">Français</button>
        </div>
      </div>
    </div>
  );
}
