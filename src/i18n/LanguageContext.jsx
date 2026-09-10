import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

const STORAGE_KEY = 'jeri_lang';
const VALID_LANGUAGES = ['pt', 'en', 'es'];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Erro ao ler idioma do localStorage:', e);
    }
    return 'pt';
  });

  const setLanguage = useCallback((lang) => {
    if (VALID_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.error('Erro ao salvar idioma no localStorage:', e);
      }
    }
  }, []);

  const t = useCallback((keyPath, params = {}) => {
    const keys = keyPath.split('.');
    let currentDict = translations[language] || translations.pt;
    let fallbackDict = translations.pt;

    let value = currentDict;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      let fbVal = fallbackDict;
      for (const key of keys) {
        if (fbVal && typeof fbVal === 'object' && key in fbVal) {
          fbVal = fbVal[key];
        } else {
          fbVal = undefined;
          break;
        }
      }
      value = fbVal !== undefined ? fbVal : keyPath;
    }

    if (typeof value === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }

    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
}
