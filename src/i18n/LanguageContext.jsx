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
    if (!keyPath || typeof keyPath !== 'string') return '';

    const keys = keyPath.split('.');
    let currentDict = translations[language] || translations.pt;
    let fallbackDict = translations.pt;

    const getValueFromDict = (dict) => {
      let val = dict;
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (val && typeof val === 'object') {
          if (k in val) {
            val = val[k];
          } else {
            // Try camelCase fallback (e.g. tour-leste-shared -> tourLesteShared)
            const camelKey = k.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            if (camelKey in val) {
              val = val[camelKey];
            } else {
              return undefined;
            }
          }
        } else {
          return undefined;
        }
      }
      return val;
    };

    let value = getValueFromDict(currentDict);

    if (value === undefined && language !== 'pt') {
      value = getValueFromDict(fallbackDict);
    }

    if (value === undefined || typeof value !== 'string') {
      value = (params && params.defaultValue !== undefined) ? params.defaultValue : keyPath;
    }

    if (typeof value === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        if (paramKey !== 'defaultValue') {
          value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
        }
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
