import React from 'react';

/**
 * Componente helper para renderizar títulos de passeios destacando
 * "LESTE" e "OESTE" em maiúsculo e na cor laranja.
 */
export function renderTourTitle(title, customClasses = {}) {
  if (!title) return null;

  const parts = title.split(/(Leste|leste|LESTE|Oeste|oeste|OESTE)/g);

  return (
    <span>
      {parts.map((part, index) => {
        const lower = part.toLowerCase();
        if (lower === 'leste') {
          return (
            <span key={index} className={`text-orange-500 font-extrabold uppercase ${customClasses.leste || ''}`}>
              LESTE
            </span>
          );
        }
        if (lower === 'oeste') {
          return (
            <span key={index} className={`text-orange-500 font-extrabold uppercase ${customClasses.oeste || ''}`}>
              OESTE
            </span>
          );
        }
        return part;
      })}
    </span>
  );
}
