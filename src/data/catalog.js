import { Waves, Compass, Map, Plane, Car, Sun } from 'lucide-react';

export const PIX_DISCOUNT_PERCENT = 0.05;

export const transfersData = [
  {
    id: 'fortaleza',
    title: 'Fortaleza (Hotel/Aeroporto) ↔ Jericoacoara',
    icon: Car,
    category: 'transfer',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
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
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg',
    options: {
      shared: { available: true, oneWay: 100, roundTrip: 200, perPerson: true },
      private: {
        available: true,
        tiers: [
          { maxCapacity: 4, vehicle: 'Hilux', oneWay: 550, roundTrip: 1100 },
          { maxCapacity: 6, vehicle: 'SW4', oneWay: 700, roundTrip: 1400 }
        ]
      }
    }
  },
  {
    id: 'jijoca',
    title: 'Jijoca ↔ Jericoacoara',
    icon: Map,
    category: 'transfer',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/0376391c7db96ffaf93689b92c2eeb11.webp',
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
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/c41e7ba1c6dcdd06e4d8c07e14a1e531.jpg',
    options: {
      shared: { available: false }, // Somente privativo
      private: {
        available: true,
        tiers: [
          { maxCapacity: 10, vehicle: 'Jardineira', oneWay: 250, roundTrip: 500 }
        ]
      }
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

export const tours = [
  {
    id: 'tour-lado-leste-privativo',
    title: 'Lado Leste (Privativo)',
    category: 'tour',
    type: 'Privativo',
    unitPrice: 450,
    priceType: 'fixed_vehicle',
    badge: 'Mais Popular',
    per: 'por veículo (Buggy ou Quadri)',
    description: 'Explore a Lagoa do Paraíso, Lagoa Azul, Árvore da Preguiça e o incrível Buraco Azul.',
    details: [
      'Lagoa do Paraíso',
      'Lagoa do Amâncio',
      'Alchymist Beach Club',
      'Buraco Azul ou Lagun Beach',
      'Trilhas do Parque Nacional',
      'Praia do Préa',
      'Árvore da Preguiça',
      'Pedra Furada',
    ],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
  },
  {
    id: 'tour-lado-oeste-privativo',
    title: 'Lado Oeste (Privativo)',
    category: 'tour',
    type: 'Privativo',
    unitPrice: 480,
    priceType: 'fixed_vehicle',
    badge: 'Aventura',
    per: 'por veículo (Buggy ou Quadri)',
    description: 'Aventura garantida com Lagoa de Tatajuba, Mangue Seco, travessia de balsa e os cavalos marinhos.',
    details: [
      'Lagoa de Tatajuba',
      'Tirolesa e toboagua',
      'Mangue Seco',
      'Travessia de Balsa',
      'Cavalos Marinhos',
    ],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg',
  },
  {
    id: 'tour-lado-leste-compartilhado',
    title: 'Lado Leste (Compartilhado)',
    category: 'tour',
    type: 'Compartilhado',
    unitPrice: 70,
    priceType: 'per_person',
    badge: 'Econômico',
    per: 'por pessoa (Jardineira)',
    description: 'Roteiro igual ao privativo com guia credenciado e socialização.',
    details: [
      'Roteiro igual ao privativo',
      'Guia credenciado',
      'Ótimo custo-benefício',
      'Socialização',
    ],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
  },
  {
    id: 'tour-lado-oeste-compartilhado',
    title: 'Lado Oeste (Compartilhado)',
    category: 'tour',
    type: 'Compartilhado',
    unitPrice: 75,
    priceType: 'per_person',
    badge: 'Econômico',
    per: 'por pessoa (Jardineira)',
    description: 'Roteiro igual ao privativo com guia credenciado e paisagens incríveis.',
    details: [
      'Roteiro igual ao privativo',
      'Guia credenciado',
      'Ótimo custo-benefício',
      'Paisagens incríveis',
    ],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg',
  },
  {
    id: 'tour-helicoptero',
    title: 'Passeio de Helicóptero',
    category: 'tour',
    type: 'Privativo',
    unitPrice: 900,
    priceType: 'fixed_vehicle',
    badge: 'Premium',
    per: 'por pessoa',
    description: 'Viva a experiência única de sobrevoar Jericoacoara de helicóptero, contemplando do alto as dunas, lagoas e o litoral paradisíaco.',
    details: [
      'Sobrevoo pelas dunas',
      'Vista das lagoas',
      'Litoral paradisíaco',
      'Experiência inesquecível',
    ],
    image: 'https://images.unsplash.com/photo-1700644860189-b244bdb52a4d',
  },
  {
    id: 'tour-utv',
    title: 'Passeio de UTV',
    category: 'tour',
    type: 'Privativo',
    unitPrice: 400,
    priceType: 'fixed_vehicle',
    badge: 'Aventura',
    per: 'por veículo',
    description: 'Aventure-se em um emocionante passeio de UTV pelas dunas e trilhas de Jericoacoara.',
    details: [
      'Dunas de Jericoacoara',
      'Trilhas off-road',
      'Contato com a natureza',
      'Segurança garantida',
    ],
    image: 'https://images.unsplash.com/photo-1676954054657-223a1bdb8f0c',
  },
];

export const allServices = [
  {
    id: 'servico-lado-leste',
    title: 'Passeios Lado Leste',
    description: 'Explore a famosa Lagoa do Paraíso, Lagoa Azul, Árvore da Preguiça e o incrível Buraco Azul. Opções em Buggy ou Quadriciclo.',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
    tourIds: ['tour-lado-leste-privativo', 'tour-lado-leste-compartilhado'],
  },
  {
    id: 'servico-lado-oeste',
    title: 'Passeios Lado Oeste',
    description: 'Aventura garantida com Lagoa de Tatajuba, Mangue Seco, travessia de balsa e os cavalos marinhos. Natureza exuberante.',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg',
    tourIds: ['tour-lado-oeste-privativo', 'tour-lado-oeste-compartilhado'],
  },
  {
    id: 'servico-roteiros',
    title: 'Roteiros Personalizados',
    description: 'Monte seu pacote ideal. Combine transfers e passeios privativos ou compartilhados de acordo com sua necessidade.',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/0376391c7db96ffaf93689b92c2eeb11.webp',
    tourIds: [],
  },
  {
    id: 'servico-helicoptero',
    title: 'Passeio de Helicóptero',
    description: 'Viva a experiência única de sobrevoar Jericoacoara de helicóptero, contemplando do alto as dunas, lagoas e o litoral paradisíaco da região.',
    image: 'https://images.unsplash.com/photo-1700644860189-b244bdb52a4d',
    tourIds: ['tour-helicoptero'],
  },
  {
    id: 'servico-utv',
    title: 'Passeio de UTV',
    description: 'Aventure-se em um emocionante passeio de UTV pelas dunas e trilhas de Jericoacoara, com muita adrenalina, segurança e contato direto com a natureza.',
    image: 'https://images.unsplash.com/photo-1676954054657-223a1bdb8f0c',
    tourIds: ['tour-utv'],
  },
];

export function formatPrice(value) {
  return `R$ ${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateTotal(item, passengers) {
  if (item.priceType === 'per_person') {
    return item.unitPrice * passengers;
  }
  return item.unitPrice;
}

export function isNightTime(timeStr) {
  if (!timeStr) return false;
  const [hours] = timeStr.split(':').map(Number);
  return !isNaN(hours) && hours >= 18;
}

export function calculateTransferPrice({ transfer, optionType = 'private', tripType = 'roundTrip', passengers = 1, selectedTierIndex, time = '' }) {
  if (!transfer || !transfer.options) {
    return {
      optionType,
      tripType,
      baseUnitPrice: 0,
      subtotal: 0,
      isPerPerson: false,
      isPrivate: false,
      vehicle: null,
      vehicleCount: 1,
      selectedTier: null,
      nightFeeAmount: 0,
      nightFeeApplied: false,
      total: 0,
      pixDiscountAmount: 0,
      pixTotal: 0,
    };
  }

  const isShared = optionType === 'shared';
  const priceKey = tripType === 'roundTrip' ? 'roundTrip' : 'oneWay';

  let baseUnitPrice = 0;
  let subtotal = 0;
  let vehicle = null;
  let vehicleCount = 1;
  let selectedTier = null;
  let isPerPerson = false;
  let isPrivate = false;

  if (isShared && transfer.options.shared?.available) {
    baseUnitPrice = transfer.options.shared[priceKey] || 0;
    subtotal = baseUnitPrice * passengers;
    isPerPerson = true;
    isPrivate = false;
  } else if (transfer.options.private?.available) {
    isPrivate = true;
    const tiers = transfer.options.private.tiers || [];
    
    if (tiers.length > 0) {
      const largestTier = tiers[tiers.length - 1];
      
      if (passengers > largestTier.maxCapacity) {
        vehicleCount = Math.ceil(passengers / largestTier.maxCapacity);
        selectedTier = {
          ...largestTier,
          vehicle: `${vehicleCount}x ${largestTier.vehicle}`,
        };
        baseUnitPrice = largestTier[priceKey] || 0;
        subtotal = baseUnitPrice * vehicleCount;
        vehicle = selectedTier.vehicle;
      } else {
        if (selectedTierIndex !== undefined && selectedTierIndex !== null && tiers[selectedTierIndex] && passengers <= tiers[selectedTierIndex].maxCapacity) {
          selectedTier = tiers[selectedTierIndex];
        } else {
          selectedTier = tiers.find(t => t.maxCapacity >= passengers) || largestTier;
        }
        baseUnitPrice = selectedTier[priceKey] || 0;
        subtotal = baseUnitPrice;
        vehicle = selectedTier.vehicle;
        vehicleCount = 1;
      }
    }
  }

  const nightFeeApplied = Boolean((transfer.nightFee || transfer.id === 'jijoca') && isNightTime(time));
  const nightFeeAmount = nightFeeApplied ? (transfer.nightFee || 20) : 0;
  const total = subtotal + nightFeeAmount;
  const pixTotal = total * 0.95;
  const pixDiscountAmount = total - pixTotal;

  return {
    optionType,
    tripType,
    baseUnitPrice,
    subtotal,
    isPerPerson,
    isPrivate,
    vehicle,
    vehicleCount,
    selectedTier,
    nightFeeAmount,
    nightFeeApplied,
    total,
    pixDiscountAmount,
    pixTotal,
  };
}

