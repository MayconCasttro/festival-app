"use client";

import { useEffect, useState } from 'react';

interface Props {
  defaultText?: string | null;
  translations?: { [lang: string]: string | undefined } | null;
  className?: string;
}

export default function LocalizedText({ defaultText = '', translations = null, className = '' }: Props) {
  const [lang, setLang] = useState<string>('pt');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lang') || 'pt';
      setLang(stored);
    } catch (e) {
      // ignore
    }
  }, []);

  const text = (translations && translations[lang]) || defaultText || '';
  return <span className={className}>{text}</span>;
}
