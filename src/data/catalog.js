import { Waves, Compass, Map, Plane, Car, Sun } from 'lucide-react';

export const PIX_DISCOUNT_PERCENT = 0.05;

export const CANCELLATION_POLICY = {
  title: 'Política de Cancelamento Estrita & Transparente',
  fullRefundDays: 7,
  fullRefundText: 'Até 7 dias de antecedência da viagem: 100% de reembolso integral.',
  partialRefundText: 'Entre 7 dias e 48 horas antes: 50% de retenção ou 100% de crédito em voucher para remarcação.',
  noRefundText: 'Menos de 48 horas ou não comparecimento (no-show): Sem reembolso, devido à alocação antecipada exclusiva da frota e do motorista credenciado.',
};

export const DEFAULT_SERVICE_DETAILS = {
  transfer: {
    includes: [
      'Motorista profissional credenciado pelo Cadastur',
      'Veículo climatizado com manutenção rigorosa (Hilux, SW4, Van ou Ônibus)',
      'Busca e retorno no aeroporto ou hotel/pousada indicado',
      'Taxa de balsa inclusa (no serviço privativo)',
      'Seguro passageiro (APP) com cobertura integral',
      'Suporte operacional 24h via WhatsApp durante toda a viagem',
    ],
    excludes: [
      'Taxa de Turismo Sustentável da Vila de Jericoacoara (Prefeitura de Jijoca)',
      'Refeições, lanches e bebidas durante as paradas no trajeto',
      'Despesas pessoais ou paradas adicionais fora do trajeto contratado',
    ],
    practicalInfo: {
      baggage: 'Privativo: até 2 malas despachadas (até 23kg cada) + 1 mala de mão por passageiro. Compartilhado: 1 mala média (até 23kg) + 1 mochila de mão por passageiro.',
      children: 'Crianças de colo até 2 anos completos viajam gratuitamente no colo de um adulto. Crianças a partir de 2 anos ocupam assento individual regulamentado.',
      flightDelay: 'Tolerância gratuita de até 1 hora de espera no aeroporto em caso de atraso confirmado no voo monitorado.',
      cancellation: '100% de reembolso com até 7 dias de antecedência. De 7 dias a 48h: retenção de 50% ou voucher. Menos de 48h: sem reembolso.',
    },
  },
  tour: {
    includes: [
      'Guia/motorista credenciado Cadastur e profundo conhecedor da região',
      'Veículo off-road selecionado (Buggy, Quadriciclo, Jardineira ou SW4)',
      'Roteiro completo pelos principais pontos turísticos',
      'Busca e retorno diretamente na sua pousada/hotel na Vila de Jeri',
      'Seguro passageiro obrigatório durante todo o trajeto',
      'Suporte e assistência 24h via WhatsApp',
    ],
    excludes: [
      'Taxas de entrada e Day-Use em Beach Clubs (Alchymist, Lagun Beach, Buraco Azul)',
      'Alimentação, petiscos e bebidas nos restaurantes locais',
      'Atrações opcionais no percurso (tirolesa, toboágua, cavalo-marinho, esquibunda)',
      'Taxa de Turismo Sustentável da Vila de Jericoacoara',
    ],
    practicalInfo: {
      baggage: 'Recomendado levar apenas bolsas pequenas, mochilas leves ou sacolas de praia.',
      whatToBring: 'Protetor solar, óculos escuros, roupa de banho, toalha, calçado confortável e documento com foto.',
      children: 'Crianças até 2 anos no colo gratuitas em Jardineira compartilhada. Para buggy e quadriciclo, consulte restrições de idade e segurança.',
      cancellation: '100% de reembolso com até 7 dias de antecedência. Menos de 48h ou no-show: não reembolsável.',
    },
  },
};

export const transfersData = [
  {
    id: 'onibus-regular',
    title: 'Transfer de Ônibus/Van Regular (Opção Mais Econômica)',
    icon: Car,
    category: 'transfer',
    image: '/images/onibus-transfer-jericoacoara-premium.webp',
    description: 'Transfer compartilhado em ônibus ou van executiva climatizada entre Fortaleza e Jericoacoara. A opção mais econômica e confiável com horários regulares.',
    includes: [
      'Transporte executivo com ar-condicionado',
      'Motorista profissional credenciado',
      'Ponto de encontro central em Fortaleza e transbordo 4x4 seguro para a Vila de Jeri',
      'Seguro passageiro regulamentado',
      'Suporte 24h via WhatsApp',
    ],
    excludes: [
      'Taxa de Turismo Sustentável de Jericoacoara',
      'Alimentação e bebidas durante as paradas',
      'Entrega porta a porta em hotéis fora da rota principal',
    ],
    practicalInfo: {
      baggage: '1 mala de porão (até 23kg) + 1 mochila ou bolsa de mão por passageiro.',
      children: 'Bebês até 2 anos no colo não pagam.',
      cancellation: 'Cancelamento gratuito com 100% de reembolso até 7 dias antes do embarque.',
    },
    options: {
      shared: {
        available: true,
        oneWay: 175,
        roundTrip: 340,
        perPerson: true,
        vehicle: 'Ônibus/Van Regular',
        note: 'Horários fixos e específicos — consulte e alinhe os horários disponíveis após a confirmação da reserva.'
      },
      private: { available: false }
    }
  },
  {
    id: 'fortaleza',
    title: 'Fortaleza (Hotel/Aeroporto) ↔ Jericoacoara',
    icon: Car,
    category: 'transfer',
    image: '/images/transfer-4x4-dunas.webp',
    description: 'Transfer privativo ou compartilhado entre Fortaleza (Aeroporto Pinto Martins ou Orla) e Jericoacoara. Conforto total em Hilux, SW4 ou vans executivas.',
    includes: [
      'Motorista credenciado Cadastur especialista em condução nas dunas',
      'Veículo climatizado (Hilux 4x4, SW4 ou Van Executiva)',
      'Busca porta a porta no aeroporto ou hotel em Fortaleza e desembarque na pousada em Jeri',
      'Taxa de balsa inclusa no trajeto privativo',
      'Seguro passageiro integral',
      'Acompanhamento e suporte 24h via WhatsApp',
    ],
    excludes: [
      'Taxa de Turismo Sustentável da Vila de Jericoacoara',
      'Alimentação e bebidas',
      'Paradas turísticas não programadas',
    ],
    practicalInfo: {
      baggage: 'Privativo: até 2 malas despachadas (23kg) + 1 mala de mão por passageiro. Compartilhado: 1 mala média + 1 de mão.',
      children: 'Crianças de colo até 2 anos completos não pagam.',
      flightDelay: 'Tolerância gratuita de até 1 hora de espera no Aeroporto de Fortaleza.',
      cancellation: 'Reembolso de 100% até 7 dias antes da data do transfer.',
    },
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
    description: 'Transfer rápido e seguro do Aeroporto Regional de Cruz / Jericoacoara (SBJE) direto para a porta da sua pousada. Trajeto com trecho off-road emocionante.',
    includes: [
      'Recepção no saguão de desembarque com placa de identificação',
      'Veículo 4x4 Hilux ou SW4 climatizado',
      'Monitoramento de voo em tempo real com até 1h de tolerância de atraso',
      'Desembarque na porta da sua pousada na Vila de Jericoacoara',
      'Seguro passageiro regulamentado',
    ],
    excludes: [
      'Taxa de Turismo Sustentável de Jericoacoara',
      'Despesas de alimentação ou gorjetas voluntárias',
    ],
    practicalInfo: {
      baggage: '2 malas despachadas (23kg) + 1 de mão por passageiro.',
      children: 'Crianças até 2 anos viajam no colo sem custo adicional.',
      flightDelay: 'Até 1h de espera gratuita inclusa sem cobrança extra.',
      cancellation: '100% de reembolso garantido até 7 dias antes do embarque.',
    },
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
    description: 'Travessia tradicional pelas dunas e areia fofa entre Jijoca de Jericoacoara e a Vila de Jeri em Jardineira ou caminhonete 4x4 com segurança credenciada.',
    nightFee: 20, // Acréscimo se horário >= 18:00
    includes: [
      'Travessia segura do Parque Nacional de Jericoacoara com motorista local',
      'Veículo 4x4 adaptado ou Jardineira credenciada',
      'Seguro passageiro',
      'Suporte via WhatsApp',
    ],
    excludes: [
      'Taxa de Turismo Sustentável de Jeri',
      'Taxa noturna de R$ 20 para saídas entre 18h e 06h',
    ],
    practicalInfo: {
      baggage: '1 mala média por passageiro + 1 bolsa de mão.',
      children: 'Crianças até 2 anos no colo viajam gratuitamente.',
      cancellation: '100% de reembolso até 7 dias antes do serviço.',
    },
    options: {
      shared: { available: true, oneWay: 60, roundTrip: 120, perPerson: true },
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
    description: 'Conexão rápida e confortável à beira-mar entre a Praia do Preá e a Vila de Jericoacoara, ideal para quem se hospeda no polo do kitesurf.',
    includes: [
      'Transfer privativo em 4x4 ou Jardineira',
      'Busca e desembarque na porta da pousada ou hotel no Preá ou Jeri',
      'Motorista credenciado experiente em trilhas de praia',
      'Seguro passageiro incluso',
    ],
    excludes: [
      'Taxa de Turismo Sustentável de Jericoacoara',
    ],
    practicalInfo: {
      baggage: 'Até 2 malas por passageiro no privativo (incluindo pranchas e equipamentos de kite sob consulta prévia).',
      children: 'Crianças de colo até 2 anos grátis.',
      cancellation: '100% de reembolso até 7 dias de antecedência.',
    },
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
  sharedNote: item.options.shared?.available ? 'por pessoa (opção mais econômica)' : 'Indisponível',
  description: `Transfer ${item.title} — a opção mais confiável com motoristas credenciados.`,
  image: item.image,
  raw: item,
}));

export const toursData = [
  {
    id: 'tour-leste-shared',
    title: 'Passeio Lado LESTE (Compartilhado)',
    category: 'tour',
    image: '/images/tours/passeio-leste.webp',
    description: 'Passeio pelo litoral leste em Jardineira compartilhada. Visite a famosa Árvore da Preguiça, Praia do Preá, Buraco Azul ou Lagun Beach e as águas mornas da Lagoa do Paraíso com o melhor custo-benefício de Jericoacoara.',
    locations: ['Árvore da Preguiça', 'Praia do Preá', 'Trilhas do Parque Nacional', 'Buraco Azul ou Lagun Beach', 'Alchymist (Opcional)', 'Lagoa do Amâncio', 'Lagoa do Paraíso'],
    includes: [
      'Transporte em Jardineira 4x4 credenciada',
      'Motorista local experiente e credenciado Cadastur',
      'Embarque e retorno na sua pousada/hotel na Vila de Jericoacoara',
      'Seguro passageiro regulamentado',
      'Reserva 100% garantida',
    ],
    excludes: [
      'Taxa de entrada / Day-Use em Beach Clubs (Buraco Azul, Lagun Beach, Alchymist)',
      'Alimentação, petiscos e bebidas',
      'Taxa de Turismo Sustentável da Vila de Jericoacoara',
    ],
    practicalInfo: {
      whatToBring: 'Protetor solar, óculos de sol, roupa de banho, toalha e dinheiro/cartão para entradas opcionais.',
      children: 'Crianças de colo até 2 anos completos viajam gratuitamente no colo de um adulto responsável.',
      cancellation: 'Cancelamento gratuito com 100% de reembolso solicitado com no mínimo 7 dias de antecedência.',
    },
    options: {
      shared: { available: true, price: 75, vehicle: 'Jardineira', benefits: ['Motorista credenciado', 'Opção mais econômica', 'Melhor custo-benefício', 'Reserva 100% garantida'] },
      private: { available: false }
    }
  },
  {
    id: 'tour-leste-private',
    title: 'Passeio Lado LESTE (Privativo)',
    category: 'tour',
    image: '/images/tours/passeio-leste.webp',
    description: 'Roteiro exclusivo pelo litoral leste com total privacidade e liberdade de tempo em cada parada. Escolha seu veículo ideal (Buggy, Quadriciclo, SW4 ou Jardineira privativa) com guia dedicado.',
    locations: ['Árvore da Preguiça', 'Praia do Preá', 'Trilhas do Parque Nacional', 'Buraco Azul ou Lagun Beach', 'Alchymist (Opcional)', 'Lagoa do Amâncio', 'Lagoa do Paraíso'],
    includes: [
      'Veículo privativo exclusivo para você e seu grupo (Buggy, Quadri, SW4 ou Jardineira)',
      'Guia/motorista dedicado credenciado Cadastur',
      'Flexibilidade total de horário e tempo de permanência em cada atração',
      'Busca e retorno na porta da pousada na Vila de Jericoacoara',
      'Seguro passageiro obrigatório',
    ],
    excludes: [
      'Taxas de Day-Use em Beach Clubs (Alchymist, Lagun, Buraco Azul)',
      'Alimentação e bebidas',
      'Taxa de Turismo Sustentável da Vila de Jericoacoara',
    ],
    practicalInfo: {
      whatToBring: 'Protetor solar, óculos escuros, toalhas, roupa de banho e documento com foto.',
      children: 'Para quadriciclos, condutor maior de 18 anos. Em buggys e SW4, crianças menores contam como assento para segurança.',
      cancellation: '100% de reembolso com até 7 dias de antecedência. Menos de 48h não reembolsável.',
    },
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
    title: 'Passeio Lado OESTE (Compartilhado)',
    category: 'tour',
    image: '/images/tours/passeio-oeste.webp',
    description: 'Aventura clássica pelo litoral oeste de Jericoacoara em Jardineira compartilhada. Visite a praia de Mangue Seco, travessia de balsa tradicional em Guriú e as dunas radicais da Lagoa de Tatajuba.',
    locations: ['Visual Beira da Praia', 'Lagoa da Tatajuba (Tirolesa, Toboágua, Esquibunda)', 'Laguna Beach Club (Solicitar)', 'Área de Cavalos Marinhos (Opcional - Ingresso no local)'],
    includes: [
      'Transporte off-road em Jardineira credenciada',
      'Motorista credenciado Cadastur especialista nas dunas de Tatajuba',
      'Travessia de balsa do Rio Guriú',
      'Embarque e desembarque na pousada em Jericoacoara',
      'Seguro passageiro',
    ],
    excludes: [
      'Passeio ecológico de barco aos cavalos-marinhos (pago diretamente aos barqueiros nativos)',
      'Atrações opcionais de aventura em Tatajuba (tirolesa, toboágua, esquibunda)',
      'Almoço, petiscos e bebidas nos restaurantes à beira da lagoa',
      'Taxa de Turismo Sustentável da Vila de Jericoacoara',
    ],
    practicalInfo: {
      whatToBring: 'Roupa de banho, protetor solar, óculos escuros e dinheiro em espécie para atividades opcionais locais.',
      children: 'Crianças de colo até 2 anos não pagam na Jardineira.',
      cancellation: 'Reembolso integral (100%) até 7 dias antes do passeio.',
    },
    options: {
      shared: { available: true, price: 80, vehicle: 'Jardineira', benefits: ['Motorista credenciado', 'Opção mais econômica', 'Melhor custo-benefício', 'Reserva 100% garantida'] },
      private: { available: false }
    }
  },
  {
    id: 'tour-oeste-private',
    title: 'Passeio Lado OESTE (Privativo)',
    category: 'tour',
    image: '/images/tours/passeio-oeste.webp',
    description: 'Muita adrenalina e exclusividade pelo litoral oeste. Conheça as dunas móveis de Tatajuba com opção "com emoção", balsa tradicional em Guriú e parada para banho e almoço com cardápio ao vivo.',
    locations: ['Visual Beira da Praia', 'Lagoa da Tatajuba (Tirolesa, Toboágua, Esquibunda)', 'Laguna Beach Club (Solicitar)', 'Área de Cavalos Marinhos (Opcional - Ingresso no local)'],
    includes: [
      'Veículo privativo exclusivo (Buggy, Quadriciclo, SW4 ou Jardineira)',
      'Guia/motorista credenciado Cadastur dedicado ao seu grupo',
      'Travessia de balsa inclusa para o veículo',
      'Embarque e retorno na sua pousada na Vila de Jeri',
      'Seguro passageiro integral',
    ],
    excludes: [
      'Entrada para observação de cavalos-marinhos no mangue seco',
      'Atrações opcionais de aventura (tirolesa e toboágua)',
      'Alimentação e bebidas',
      'Taxa de Turismo Sustentável da Vila de Jericoacoara',
    ],
    practicalInfo: {
      whatToBring: 'Protetor solar, óculos escuros, toalhas, roupa de banho e câmera/celular para fotos incríveis.',
      children: 'Crianças menores contam como assento no buggy/veículo privativo para fins de capacidade regulamentada.',
      cancellation: '100% de reembolso solicitado com até 7 dias de antecedência.',
    },
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
    description: 'Aventura Premium off-road em UTV Can-Am Maverick X3 de alta performance. Pilote pelas trilhas e dunas do Parque Nacional com guia especializado à frente.',
    includes: [
      'UTV Can-Am Maverick X3 de última geração',
      'Equipamentos de segurança (capacetes e óculos)',
      'Guia líder especializado conduzindo a trilha off-road',
      'Seguro da atividade',
    ],
    excludes: [
      'Consumo pessoal, alimentação e bebidas',
      'Taxa de Turismo da Vila de Jericoacoara',
    ],
    practicalInfo: {
      whatToBring: 'CNH válida categoria B obrigatória para o condutor, calçado fechado e roupas confortáveis.',
      cancellation: '100% de reembolso com no mínimo 7 dias de antecedência.',
    }
  },
  {
    id: 'tour-helicoptero',
    title: 'Passeio de Helicóptero',
    category: 'tour',
    image: '/images/voo-helicoptero-jeri.webp',
    requireWhatsApp: true,
    description: 'Experiência Premium com vistas panorâmicas inesquecíveis das dunas, lagoas e Pedra Furada vistas de cima em voo executivo.',
    includes: [
      'Voo panorâmico executivo com comandante homologado pela ANAC',
      'Instruções de segurança e fones de ouvido antirruído',
      'Seguro aeronáutico regulamentado',
    ],
    excludes: [
      'Transporte terrestre até o heliponto (consulte transfer VIP)',
      'Despesas pessoais',
    ],
    practicalInfo: {
      whatToBring: 'Documento original com foto (RG ou Passaporte).',
      cancellation: 'Consulte as regras meteorológicas e políticas de cancelamento no WhatsApp.',
    }
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
    title: 'Passeios Lado LESTE',
    description: 'Explore a famosa Lagoa do Paraíso, Lagoa Azul, Árvore da Preguiça e o incrível Buraco Azul. Opções em Buggy ou Quadriciclo.',
    image: '/images/tours/passeio-leste.webp',
    tourIds: ['tour-leste-private'],
  },
  {
    id: 'servico-lado-oeste',
    title: 'Passeios Lado OESTE',
    description: 'Aventura garantida com Lagoa de Tatajuba, Mangue Seco, travessia de balsa e os cavalos marinhos. Natureza exuberante.',
    image: '/images/tours/passeio-oeste.webp',
    tourIds: ['tour-oeste-private'],
  },
  {
    id: 'servico-roteiros',
    title: 'Roteiros Personalizados',
    description: 'Monte seu pacote ideal. Combine transfers e passeios privativos ou compartilhados de acordo com sua necessidade.',
    image: '/images/tours/passeio-leste.webp',
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

export function calculateTourPrice(tourOrParams, vehicleTypeArg, modalityArg) {
  let tour, optionType, selectedVehicleType, passengers;

  if (tourOrParams && typeof tourOrParams === 'object' && tourOrParams.tour) {
    tour = tourOrParams.tour;
    optionType = tourOrParams.optionType || 'private';
    selectedVehicleType = tourOrParams.selectedVehicleType || 'Buggy';
    passengers = tourOrParams.passengers || 1;
  } else {
    tour = tourOrParams;
    selectedVehicleType = vehicleTypeArg || 'Buggy';
    optionType = modalityArg || 'private';
    passengers = 1;
  }

  if (!tour) {
    return {
      total: 0,
      pixTotal: 0,
      selectedVehicle: null,
      vehicleCount: 1,
      maxCapacity: 4,
      optionType: 'private',
      isWhatsAppOnly: false,
    };
  }

  if (tour.requireWhatsApp) {
    return {
      total: 0,
      pixTotal: 0,
      selectedVehicle: null,
      vehicleCount: 1,
      maxCapacity: 1,
      optionType,
      isWhatsAppOnly: true,
    };
  }

  if (optionType === 'shared' && tour.options?.shared?.available) {
    const unitPrice = tour.options.shared.price || 0;
    const total = unitPrice * passengers;
    return {
      total,
      pixTotal: Math.round(total * (1 - PIX_DISCOUNT_PERCENT) * 100) / 100,
      selectedVehicle: { type: tour.options.shared.vehicle || 'Jardineira', price: unitPrice },
      vehicleCount: 1,
      maxCapacity: 1,
      optionType: 'shared',
      isWhatsAppOnly: false,
    };
  }

  const vehicles = tour.options?.private?.vehicles || [];
  const selectedVehicle =
    vehicles.find((v) => v.type === selectedVehicleType) ||
    vehicles[0] ||
    { type: 'Buggy', maxCapacity: 4, price: 450 };

  const maxCapacity = selectedVehicle.maxCapacity || 4;
  const vehicleCount = Math.max(1, Math.ceil(passengers / maxCapacity));
  const total = (selectedVehicle.price || 0) * vehicleCount;
  const pixTotal = Math.round(total * (1 - PIX_DISCOUNT_PERCENT) * 100) / 100;

  return {
    total,
    pixTotal,
    selectedVehicle,
    vehicleCount,
    maxCapacity,
    optionType: 'private',
    isWhatsAppOnly: Boolean(selectedVehicle.requireWhatsApp),
  };
}

export function calculateTransferPrice(transferOrParams, serviceTypeArg, vehicleTypeArg, tripTypeArg) {
  let transfer, optionType, tripType, passengers, selectedTierIndex, time;

  if (transferOrParams && typeof transferOrParams === 'object' && transferOrParams.transfer) {
    transfer = transferOrParams.transfer;
    optionType = transferOrParams.optionType || 'private';
    tripType = transferOrParams.tripType || 'roundTrip';
    passengers = transferOrParams.passengers || 1;
    selectedTierIndex = transferOrParams.selectedTierIndex;
    time = transferOrParams.time;
  } else {
    transfer = transferOrParams;
    optionType = serviceTypeArg || 'private';
    tripType = tripTypeArg || 'roundTrip';
    passengers = 1;
  }

  if (!transfer) {
    return {
      total: 0,
      pixTotal: 0,
      selectedTier: null,
      nightFeeApplied: false,
      isPrivate: false,
    };
  }

  let nightFeeApplied = false;
  let nightFee = 0;
  if (transfer.nightFee && time) {
    const hour = parseInt(time.split(':')[0], 10);
    if (!isNaN(hour) && (hour >= 18 || hour < 6)) {
      nightFeeApplied = true;
      nightFee = transfer.nightFee;
    }
  }

  if (optionType === 'shared' && transfer.options?.shared?.available) {
    const unitPrice = tripType === 'roundTrip' ? transfer.options.shared.roundTrip : transfer.options.shared.oneWay;
    const baseTotal = (unitPrice || 0) * passengers;
    const total = baseTotal + nightFee;
    return {
      total,
      pixTotal: Math.round(total * (1 - PIX_DISCOUNT_PERCENT) * 100) / 100,
      selectedTier: null,
      nightFeeApplied,
      isPrivate: false,
    };
  }

  const tiers = transfer.options?.private?.tiers || [];
  let selectedTier = null;
  if (selectedTierIndex !== undefined && tiers[selectedTierIndex]) {
    selectedTier = tiers[selectedTierIndex];
  } else {
    selectedTier = tiers.find((t) => passengers <= t.maxCapacity) || tiers[0];
  }

  if (!selectedTier) {
    return {
      total: 0,
      pixTotal: 0,
      selectedTier: null,
      nightFeeApplied,
      isPrivate: true,
    };
  }

  const basePrice = tripType === 'roundTrip' ? selectedTier.roundTrip : selectedTier.oneWay;
  const total = (basePrice || 0) + nightFee;
  const pixTotal = Math.round(total * (1 - PIX_DISCOUNT_PERCENT) * 100) / 100;

  return {
    total,
    pixTotal,
    selectedTier,
    nightFeeApplied,
    isPrivate: true,
  };
}

export function getServiceDetails(itemOrId) {
  if (!itemOrId) return DEFAULT_SERVICE_DETAILS.transfer;

  const id = typeof itemOrId === 'string' ? itemOrId : (itemOrId.id || itemOrId.serviceId || '');
  const transfer = transfersData.find((t) => t.id === id);
  if (transfer) {
    return {
      category: 'transfer',
      id: transfer.id,
      title: transfer.title,
      description: transfer.description || `Transfer ${transfer.title} — pontualidade e segurança total com motoristas credenciados.`,
      image: transfer.image,
      includes: transfer.includes || DEFAULT_SERVICE_DETAILS.transfer.includes,
      excludes: transfer.excludes || DEFAULT_SERVICE_DETAILS.transfer.excludes,
      practicalInfo: {
        ...DEFAULT_SERVICE_DETAILS.transfer.practicalInfo,
        ...(transfer.practicalInfo || {}),
      },
    };
  }

  const tour = toursData.find((t) => t.id === id);
  if (tour) {
    return {
      category: 'tour',
      id: tour.id,
      title: tour.title,
      description: tour.description || `Explore as melhores atrações do ${tour.title} com guias credenciados.`,
      image: tour.image,
      locations: tour.locations || [],
      includes: tour.includes || DEFAULT_SERVICE_DETAILS.tour.includes,
      excludes: tour.excludes || DEFAULT_SERVICE_DETAILS.tour.excludes,
      practicalInfo: {
        ...DEFAULT_SERVICE_DETAILS.tour.practicalInfo,
        ...(tour.practicalInfo || {}),
      },
    };
  }

  const category = (typeof itemOrId === 'object' && itemOrId.category) || 'transfer';
  return category === 'tour' ? DEFAULT_SERVICE_DETAILS.tour : DEFAULT_SERVICE_DETAILS.transfer;
}
