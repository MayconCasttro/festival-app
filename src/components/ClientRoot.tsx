"use client";

import { useEffect, useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import LocalizedHome from './LocalizedHome';

export default function ClientRoot() {
  const [langChosen, setLangChosen] = useState<boolean | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    try {
      const lang = localStorage.getItem('lang');
      console.debug('ClientRoot: stored lang:', lang);
      if (lang && ['pt','en','es','fr'].includes(lang)) {
        setShowWelcome(false);
        setLangChosen(true);
      } else {
        // se existir, mas for inválido, limpamos e mostramos a welcome
        if (lang) {
          console.debug('ClientRoot: limpando lang inválido', lang);
          localStorage.removeItem('lang');
        }
        setShowWelcome(true);
        setLangChosen(false);
      }
    } catch (e) {
      // se localStorage não disponível, mostramos welcome mesmo assim
      console.warn('ClientRoot: erro ao acessar localStorage', e);
      setShowWelcome(true);
      setLangChosen(false);
    }
  }, []);

  if (langChosen === null) return null; // aguardando

  const handleChoose = (code: string) => {
    // inicia animação de saída e grava o idioma após a animação
    setIsLeaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem('lang', code);
      } catch (e) {
        console.warn('Falha ao gravar idioma', e);
      }
      setShowWelcome(false);
      setIsLeaving(false);
      setLangChosen(true);
    }, 420); // leva um pouco mais que a duração do transition
  };

  if (showWelcome) {
    return <WelcomeScreen onChoose={handleChoose} isLeaving={isLeaving} />;
  }

  return <LocalizedHome />;
}
