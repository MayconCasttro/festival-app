"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@/i18n/translations';

export default function LanguageGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const lang = localStorage.getItem('lang');
      if (!lang) {
        setShow(true);
      }
    } catch (e) {
      // localStorage pode não estar disponível — em caso de erro, não mostramos
      console.warn('localStorage não disponível', e);
    }
  }, []);

  const choose = (code: string) => {
    try {
      localStorage.setItem('lang', code);
    } catch (e) {
      console.warn('Falha ao gravar idioma no localStorage', e);
    }
    // reload para aplicar idioma em toda a app (simples e previsível)
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <Image src="/LOGO.png" alt="Festival" width={120} height={120} className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-3">{TRANSLATIONS['pt'].chooseLanguage}</h2>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => choose('pt')} className="py-3 rounded-lg bg-green-600 text-white">Português</button>
          <button onClick={() => choose('en')} className="py-3 rounded-lg bg-blue-600 text-white">English</button>
          <button onClick={() => choose('es')} className="py-3 rounded-lg bg-orange-500 text-white">Español</button>
          <button onClick={() => choose('fr')} className="py-3 rounded-lg bg-gray-800 text-white">Français</button>
        </div>

        <p className="mt-4 text-xs text-gray-500">Você pode alterar o idioma a qualquer momento nas configurações do navegador (limpar localStorage).</p>
      </div>
    </div>
  );
}