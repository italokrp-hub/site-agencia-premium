import { Waves, Compass, Map, Plane, Car, Sun } from 'lucide-react';

export const PIX_DISCOUNT_PERCENT = 0.05;

export const transfersData = [
  {
    id: 'fortaleza',
    title: 'Fortaleza (Hotel/Aeroporto) ↔ Jericoacoara',
    icon: Car,
    category: 'transfer',
    image: '/images/transfer-4x4-dunas.webp',
    options: {
      shared: { available: true, oneWay: 280, roundTrip: 560, perPerson: true },
      private: {
        available: true,
        tiers: [
          { maxCapacity: 4, vehicle: 'Hilux', oneWay: 900, roundTrip: 1800 },
          { maxCapacity: 6, vehicle: 'SW4', oneWay: 1100, roundTrip: 2200 }
        ]
      }
    }
  },
  {
    id: 'cruz',
    title: 'Aeroporto Regional de Cruz ↔ Jericoacoara',
    icon: Plane,
    category: 'transfer',
    image: '/images/transfer-hilux.webp',
    options: {
      shared: { available: true, oneWay: 100, roundTrip: 200, perPerson: true },
      private: {
        available: true,
        tiers: [
          { maxCapacity: 4, vehicle: 'Hilux', oneWay: 275, roundTrip: 550 },
          { maxCapacity: 6, vehicle: 'SW4', oneWay: 350, roundTrip: 700 }
        ]
      }
    }
  },
  {
    id: 'jijoca',
    title: 'Jijoca ↔ Jericoacoara',
    icon: Map,
    category: 'transfer',
    image: '/images/transfer-4x4-dunas.webp',
    nightFee: 20, // Acréscimo se horário >= 18:00
    options: {
      shared: { available: true, oneWay: 50, roundTrip: 100, perPerson: true },
      private: {
        available: true,
        tiers: [
          { maxCapacity: 10, vehicle: 'Jardineira', oneWay: 250, roundTrip: 500 }
        ]
      }
    }
  },
  {
    id: 'prea',
    title: 'Preá ↔ Jericoacoara',
    icon: Sun,
    category: 'transfer',
    image: '/images/transfer-hilux.webp',
    options: {
      shared: { available: false }, // Somente privativo
      private: {
        available: true,
        tiers: [
          { maxCapacity: 10, vehicle: 'Jardineira', oneWay: 250, roundTrip: 500 }
        ]
      }
    }
  },
  {
    id: 'onibus-regular',
    title: 'Transfer de Ônibus/Van Regular',
    icon: Car,
    category: 'transfer',
    image: '/images/transfer-4x4-dunas.webp',
    options: {
      shared: { available: true, oneWay: 175, roundTrip: 350, perPerson: true, vehicle: 'Ônibus/Van' },
      private: { available: false }
    }
  }
];

export const transfers = transfersData.map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: 'Ida e Volta / Ida',
  category: 'transfer',
  icon: item.icon,
  privatePrice: item.options.private?.tiers?.[0]?.roundTrip || 0,
  privateNote: item.options.private?.tiers?.[0] ? `até ${item.options.private.tiers[0].maxCapacity} pessoas (${item.options.private.tiers[0].vehicle})` : '',
  sharedPrice: item.options.shared?.available ? item.options.shared.roundTrip : 0,
  sharedNote: item.options.shared?.available ? 'por pessoa' : 'Indisponível',
  description: `Transfer ${item.title}`,
  image: item.image,
  raw: item,
}));

export const toursData = [
  {
    id: 'tour-leste-shared',
    title: 'Passeio Lado Leste (Compartilhado)',
    category: 'tour',
    image: '/images/voo-helicoptero-jeri.webp',
    locations: ['Árvore da Preguiça', 'Praia do Preá', 'Trilhas do Parque Nacional', 'Buraco Azul ou Lagun Beach', 'Alchymist (Opcional)', 'Lagoa do Amâncio', 'Lagoa do Paraíso'],
    options: {
      shared: { available: true, price: 75, vehicle: 'Jardineira', benefits: ['Guia credenciado', 'Ótimo custo-benefício', 'Socialização'] },
      private: { available: false }
    }
  },
  {
    id: 'tour-leste-private',
    title: 'Passeio Lado Leste (Privativo)',
    category: 'tour',
    image: '/images/voo-helicoptero-jeri.webp',
    locations: ['Árvore da Preguiça', 'Praia do Preá', 'Trilhas do Parque Nacional', 'Buraco Azul ou Lagun Beach', 'Alchymist (Opcional)', 'Lagoa do Amâncio', 'Lagoa do Paraíso'],
    options: {
      shared: { available: false },
      private: {
        available: true,
        vehicles: [
          { type: 'Buggy', maxCapacity: 4, price: 450 },
          { type: 'Quadriciclo', maxCapacity: 2, price: 450 },
          { type: 'Jardineira', maxCapacity: 10, price: 500 },
          { type: 'SW4', maxCapacity: 6, price: 600 }
        ]
      }
    }
  },
  {
    id: 'tour-oeste-shared',
    title: 'Passeio Lado Oeste (Compartilhado)',
    category: 'tour',
    image: '/images/transfer-4x4-dunas.webp',
    locations: ['Visual Beira da Praia', 'Lagoa da Tatajuba (Tirolesa, Toboágua, Esquibunda)', 'Laguna Beach Club (Solicitar)', 'Área de Cavalos Marinhos (Opcional - Ingresso no local)'],
    options: {
      shared: { available: true, price: 80, vehicle: 'Jardineira', benefits: ['Guia credenciado', 'Ótimo custo-benefício', 'Socialização'] },
      private: { available: false }
    }
  },
  {
    id: 'tour-oeste-private',
    title: 'Passeio Lado Oeste (Privativo)',
    category: 'tour',
    image: '/images/transfer-4x4-dunas.webp',
    locations: ['Visual Beira da Praia', 'Lagoa da Tatajuba (Tirolesa, Toboágua, Esquibunda)', 'Laguna Beach Club (Solicitar)', 'Área de Cavalos Marinhos (Opcional - Ingresso no local)'],
    options: {
      shared: { available: false },
      private: {
        available: true,
        vehicles: [
          { type: 'Buggy', maxCapacity: 4, price: 500 },
          { type: 'Quadriciclo', maxCapacity: 2, price: 500 },
          { type: 'Jardineira', maxCapacity: 10, price: 600 },
          { type: 'SW4', maxCapacity: 6, price: 700 }
        ]
      }
    }
  },
  {
    id: 'tour-utv',
    title: 'Passeio de UTV',
    category: 'tour',
    image: '/images/passeio-utv-maverick.webp',
    requireWhatsApp: true,
    description: 'Aventura Premium off-road em UTV Can-Am Maverick X3. Consulte opções de roteiro e disponibilidade.'
  },
  {
    id: 'tour-helicoptero',
    title: 'Passeio de Helicóptero',
    category: 'tour',
    image: '/images/voo-helicoptero-jeri.webp',
    requireWhatsApp: true,
    description: 'Experiência Premium com vistas panorâmicas inesquecíveis das dunas e lagoas vistas de cima.'
  }
];

export const tours = toursData.map((tour) => {
  if (tour.requireWhatsApp) {
    return {
      id: tour.id,
      title: tour.title,
      category: 'tour',
      type: 'Privativo',
      unitPrice: 0,
      priceType: 'fixed_vehicle',
      badge: 'Premium',
      per: 'Sob consulta no WhatsApp',
      description: tour.description,
      details: ['Experiência Premium', 'Vistas panorâmicas inesquecíveis'],
      image: tour.image,
      requireWhatsApp: true,
      raw: tour,
    };
  }

  const buggyOpt = tour.options?.private?.vehicles?.find((v) => v.type === 'Buggy');

  return {
    id: tour.id,
    title: tour.title,
    category: 'tour',
    type: 'Privativo',
    unitPrice: buggyOpt?.price || 450,
    priceType: 'fixed_vehicle',
    badge: 'Mais Popular',
    per: `a partir de ${formatPrice(buggyOpt?.price || 450)} (Buggy / Quadri)`,
    description: `Explore as melhores atrações do ${tour.title}.`,
    details: tour.locations || [],
    image: tour.image,
    raw: tour,
  };
});

export const allServices = [
  {
    id: 'servico-lado-leste',
    title: 'Passeios Lado Leste',
    description: 'Explore a famosa Lagoa do Paraíso, Lagoa Azul, Árvore da Preguiça e o incrível Buraco Azul. Opções em Buggy ou Quadriciclo.',
    image: '/images/voo-helicoptero-jeri.webp',
    tourIds: ['tour-leste-private'],
  },
  {
    id: 'servico-lado-oeste',
    title: 'Passeios Lado Oeste',
    description: 'Aventura garantida com Lagoa de Tatajuba, Mangue Seco, travessia de balsa e os cavalos marinhos. Natureza exuberante.',
    image: '/images/transfer-4x4-dunas.webp',
    tourIds: ['tour-oeste-private'],
  },
  {
    id: 'servico-roteiros',
    title: 'Roteiros Personalizados',
    description: 'Monte seu pacote ideal. Combine transfers e passeios privativos ou compartilhados de acordo com sua necessidade.',
    image: '/images/transfer-hilux.webp',
    tourIds: [],
  },
  {
    id: 'servico-helicoptero',
    title: 'Passeio de Helicóptero',
    description: 'Viva a experiência única de sobrevoar Jericoacoara de helicóptero, contemplando do alto as dunas, lagoas e o litoral paradisíaco da região.',
    image: '/images/voo-helicoptero-jeri.webp',
    tourIds: ['tour-helicoptero'],
  },
  {
    id: 'servico-utv',
    title: 'Passeio de UTV',
    description: 'Aventure-se em um emocionante passeio de UTV Can-Am Maverick pelas dunas e trilhas de Jericoacoara, com muita adrenalina, segurança e contato direto com a natureza.',
    image: '/images/passeio-utv-maverick.webp',
    tourIds: ['tour-utv'],
  },
];

export function formatPrice(value) {
  return `R$ ${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateTotal(item, passengers) {
  if (item.priceType === 'per_person') {
    return (item.unitPrice || 0) * passengers;
  }
  return item.unitPrice || 0;
}

export function calculateTourPrice(tour, vehicleType = 'Buggy', modality = 'private') {
  if (modality === 'shared' && tour.options?.shared?.available) {
    return tour.options.shared.price;
  }
  const vehicles = tour.options?.private?.vehicles || [];
  const selected = vehicles.find((v) => v.type === vehicleType) || vehicles[0];
  return selected ? selected.price : 0;
}

export function calculateTransferPrice(transfer, serviceType = 'private', vehicleType = 'Hilux', tripType = 'roundTrip') {
  if (serviceType === 'shared' && transfer.options?.shared?.available) {
    const unitPrice = tripType === 'roundTrip' ? transfer.options.shared.roundTrip : transfer.options.shared.oneWay;
    return unitPrice;
  }
  const tiers = transfer.options?.private?.tiers || [];
  const selected = tiers.find((t) => t.vehicle === vehicleType) || tiers[0];
  if (!selected) return 0;
  return tripType === 'roundTrip' ? selected.roundTrip : selected.oneWay;
}
