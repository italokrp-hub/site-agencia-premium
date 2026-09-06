/**
 * Arquivo auxiliar de metadados de experiências para enriquecer a apresentação visual.
 * IMPORTANTE: Não contém preços. Apenas aponta para os IDs do catalog.js como fonte da verdade.
 */

export const experienceStyles = [
  {
    id: 'aventura',
    label: 'Aventura',
    icon: '🏄',
    description: 'Dunas, buggy, trilhas e adrenalina pura',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
    tags: ['buggy', 'quadriciclo', 'utv'],
    relatedCatalogIds: ['tour-leste-private', 'tour-oeste-private', 'tour-utv'],
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 'relaxamento',
    label: 'Relaxamento',
    icon: '🌅',
    description: 'Lagoas cristalinas, pôr do sol e paz',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg',
    tags: ['compartilhado', 'jardineira'],
    relatedCatalogIds: ['tour-leste-shared', 'tour-oeste-shared'],
    color: 'from-cyan-600 to-teal-700',
  },
  {
    id: 'exclusividade',
    label: 'Exclusividade',
    icon: '✨',
    description: 'Privativo, conforto total e personalização',
    image: '/images/transfer-4x4-dunas.webp',
    tags: ['sw4', 'hilux', 'privativo'],
    relatedCatalogIds: ['tour-leste-private', 'tour-oeste-private', 'fortaleza', 'cruz'],
    color: 'from-amber-700 to-yellow-600',
  },
  {
    id: 'romance',
    label: 'Romance',
    icon: '🌹',
    description: 'Lua de mel e momentos inesquecíveis a dois',
    image: 'https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=800',
    tags: ['privativo', 'buggy', 'pordosol'],
    relatedCatalogIds: ['tour-leste-private', 'tour-oeste-private'],
    color: 'from-rose-600 to-pink-700',
  },
  {
    id: 'familia',
    label: 'Família',
    icon: '👨‍👩‍👧',
    description: 'Conforto e segurança para toda a família',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/c41e7ba1c6dcdd06e4d8c07e14a1e531.jpg',
    tags: ['sw4', 'jardineira', 'compartilhado'],
    relatedCatalogIds: ['tour-leste-shared', 'tour-oeste-shared', 'fortaleza', 'jijoca'],
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: '🚁',
    description: 'Helicóptero, UTV e experiências únicas',
    image: '/images/voo-helicoptero-jeri.webp',
    tags: ['helicoptero', 'utv', 'vip'],
    relatedCatalogIds: ['tour-helicoptero', 'tour-utv'],
    color: 'from-slate-700 to-gray-900',
  },
];

export const mapDestinations = [
  {
    id: 'jeri-centro',
    name: 'Jericoacoara',
    description: 'O coração do paraíso. Ruas de areia, dunas e a famosa Pedra Furada.',
    x: 50,
    y: 48,
    relatedCatalogIds: [],
    image: 'https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=600',
  },
  {
    id: 'lagoa-paraiso',
    name: 'Lagoa do Paraíso',
    description: 'Águas cristalinas esverdeadas cercadas por coqueiros. Uma das mais belas do Ceará.',
    x: 70,
    y: 55,
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
  },
  {
    id: 'buraco-azul',
    name: 'Buraco Azul',
    description: 'Fenômeno natural único: uma espécie de "buraco" de águas azuis profundas na lagoa.',
    x: 75,
    y: 45,
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
  },
  {
    id: 'lagoa-tatajuba',
    name: 'Lagoa da Tatajuba',
    description: 'Tirolesa, toboágua e esquibunda sobre a lagoa. Aventura e diversão garantidas.',
    x: 25,
    y: 40,
    relatedCatalogIds: ['tour-oeste-private', 'tour-oeste-shared'],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg',
  },
  {
    id: 'arvore-preguica',
    name: 'Árvore da Preguiça',
    description: 'Icônica árvore inclinada sobre o mar, símbolo de Jericoacoara.',
    x: 60,
    y: 35,
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg',
  },
  {
    id: 'prea',
    name: 'Preá',
    description: 'Vilarejo vizinho famoso pelo kitesurf e paisagens selvagens.',
    x: 82,
    y: 60,
    relatedCatalogIds: ['prea'],
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/c41e7ba1c6dcdd06e4d8c07e14a1e531.jpg',
  },
];

export const trustItems = [
  {
    icon: '⏰',
    title: 'Atendimento 24 horas',
    description: 'Suporte via WhatsApp disponível todos os dias da semana, a qualquer hora.',
  },
  {
    icon: '🛡️',
    title: 'Motoristas Certificados',
    description: 'Equipe de guias e motoristas experientes e selecionados.',
  },
  {
    icon: '💎',
    title: 'Experiências Personalizadas',
    description: 'Cada roteiro é pensado para você e suas necessidades.',
  },
  {
    icon: '💳',
    title: 'Pagamento Seguro',
    description: 'Parcele em até 10x no cartão ou ganhe 5% OFF no PIX.',
  },
  {
    icon: '📍',
    title: 'Suporte na Viagem',
    description: 'Estamos com você do transfer à última experiência.',
  },
  {
    icon: '✅',
    title: 'Cadastur Regularizado',
    description: 'Agência regularizada: CNPJ 51.790.615/0001-08.',
  },
];

export const faqItems = [
  {
    question: 'Como funciona a reserva?',
    answer: 'É simples! Escolha o serviço, preencha o formulário com seus dados, data e horário, e escolha a forma de pagamento. Você pode pagar um sinal de 50% online e o restante no embarque, ou pagar 100% com 5% de desconto no PIX.',
  },
  {
    question: 'Posso pagar via PIX?',
    answer: 'Sim! Aceitamos PIX com geração de QR Code direto pelo site. É a forma mais rápida e com desconto especial de 5% sobre o valor total.',
  },
  {
    question: 'Existe desconto no PIX?',
    answer: 'Sim! Oferecemos 5% de desconto para pagamentos realizados via PIX. O desconto é aplicado automaticamente no checkout.',
  },
  {
    question: 'Os passeios são compartilhados ou privativos?',
    answer: 'Oferecemos as duas modalidades! Os passeios compartilhados (Jardineira) têm ótimo custo-benefício. Os privativos garantem exclusividade, com opções de Buggy, Quadriciclo, SW4 e Jardineira.',
  },
  {
    question: 'O transfer busca no aeroporto?',
    answer: 'Sim! Realizamos transfer do Aeroporto de Fortaleza, do Aeroporto Regional de Cruz (SBJE) e de Jijoca diretamente para Jericoacoara. Também fazemos o trajeto inverso.',
  },
  {
    question: 'Posso personalizar meu roteiro?',
    answer: 'Com certeza! Além dos passeios pré-definidos, oferecemos roteiros personalizados. Entre em contato pelo WhatsApp e nossos especialistas montarão a experiência ideal para você.',
  },
  {
    question: 'Como funciona o pagamento do sinal?',
    answer: 'Você pode optar por pagar 50% do valor como sinal online (via PIX ou cartão de crédito em até 10x) e o restante de 50% diretamente ao motorista no dia do embarque.',
  },
  {
    question: 'O passeio de Helicóptero pode ser reservado online?',
    answer: 'O passeio de Helicóptero e o de UTV são experiências premium que devem ser consultadas diretamente via WhatsApp para verificar disponibilidade e condições especiais.',
  },
];
