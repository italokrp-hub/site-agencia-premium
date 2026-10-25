import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';

// ============================================================================
// CONFIGURAÇÃO DO CLIENTE & CONSULTOR
// ============================================================================
const WHATSAPP_ITALO = '5588988463182';

const DADOS_CLIENTE = {
  nome: 'Ueiner Jajah',
  viajantes: '2 pessoas',
  hotel: 'Essenza Dune Hotel',
  periodo: '09 a 16 de Novembro',
  chegada: '09/11 às 12:00 (Aeroporto JJD)',
  retorno: '16/11 às 12:40 (Sugestão de saída do hotel: 10:40)',
};

const DATAS_DISPONIVEIS = [
  '09/11 (Segunda)',
  '10/11 (Terça)',
  '11/11 (Quarta)',
  '12/11 (Quinta)',
  '13/11 (Sexta)',
  '14/11 (Sábado)',
  '15/11 (Domingo)',
  '16/11 (Segunda)',
];

// ============================================================================
// TABELA BASE DE PREÇOS (EDITÁVEL NO MODO CONSULTOR ÍTALO)
// ============================================================================
const PRECOS_INICIAIS = {
  // ABA 1: TRANSFER (PARA 2 PESSOAS)
  transferCompartilhadoIdaVolta: 400, // R$ 100/pax por trecho x 2 pax x 2 trechos
  transferPrivativoSW4IdaVolta: 550,  // R$ 275/veículo por trecho x 2 trechos
  heliTransferJJD: 3000,
  heliTransferFortaleza: 15000,
  heliTransferCamocim: 6000,
  heliTransferParnaiba: 10000,

  // ABA 2: PASSEIOS TERRESTRES — VEÍCULOS
  lesteSW4: 600,
  lesteUTV: 1300,
  oesteSW4: 700,
  oesteUTV: 1300,
  barrinhaSW4: 700,
  barrinhaUTV: 1300,
  oesteExtremoSW4: 900,
  porDoSolSW4: 350,

  // BEACH CLUBS LESTE (PARA 2 PESSOAS)
  buracoAzul2Pax: 100,      // R$ 50/pax x 2
  lagunBeach2Pax: 100,      // R$ 50/pax x 2
  carauba2Pax: 80,          // R$ 40/pax x 2
  alchymist2Pax: 140,       // R$ 70/pax x 2
  blueLagoon2Pax: 160,      // R$ 80/pax x 2
  comboAlchymistBlue2Pax: 260, // R$ 130/pax x 2 (Economia de R$ 40)

  // BARRINHA — ESPORTES NÁUTICOS (PARA 2 PESSOAS / BASE)
  nauticoJetSki12Min: 270,        // 2 pax na moto
  nauticoJetSkiSegmar25Min: 550,   // até 2 pax
  nauticoJetSki1Hora: 1200,        // compartilhado
  nauticoJetSkiIndividual2Pax: 320,// 2 pax (R$ 160 cada)
  nauticoWakeboard2Pax: 1100,      // 2 pax (R$ 550 cada)
  nauticoEsqui2Pax: 1100,          // 2 pax (R$ 550 cada)
  nauticoBoiaJetDuo: 150,          // 2 pax
  nauticoBicicletaAquatica: 50,    // até 2 pax
  nauticoCaiaque2Pax: 100,         // R$ 50/pax x 2
  nauticoSup2Pax: 100,             // R$ 50/pax x 2
  nauticoBananaBoat2Pax: 100,      // R$ 50/pax x 2

  // ABA 3: OS 11 ROTEIROS DE HELICÓPTERO (@JericoacoaraPremium)
  heli01: 1000,  // R$ 500/pax x 2 (5 min • Buraco Azul/Lagun)
  heli02: 1590,  // 10 min privativo
  heli03: 1890,  // 15 min privativo Oeste
  heli04: 1890,  // 15 min privativo Leste
  heli05: 2590,  // 25 min privativo Extremo Leste
  heli06: 2590,  // 22 min privativo Lagun Beach com pouso
  heli07: 2890,  // 30 min privativo Promocional Leste + Oeste
  heli08: 3990,  // 25 min privativo Laguna com pouso
  heli09: 3990,  // 25 min privativo Beira D'Água com pouso
  heli10: 8690,  // 1h40 privativo Barra Grande
  heli11: 19990, // 4h privativo Lençóis Maranhenses com pouso

  // ABA 4: EXTRAS
  droneFotografo: 850,
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function PlanejamentoUeinerJajah() {
  const [abaAtiva, setAbaAtiva] = useState('transfer');
  const [precos, setPrecos] = useState(PRECOS_INICIAIS);
  const [modoConsultor, setModoConsultor] = useState(false);
  const [modalResumoAberto, setModalResumoAberto] = useState(false);

  // Modo consultor bloqueado para o cliente — acessível apenas se tiver ?admin=italo na URL
  const isConsultorAutorizado = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === 'italo' || params.get('consultor') === 'italo';
  }, []);

  // Estados de acordeões (para manter a tela limpa)
  const [acordeoes, setAcordeoes] = useState({
    heliTransfer: false,
    lesteBeachClubs: false,
    barrinhaNautico: false,
    heliTabela: false,
    gastronomia: false,
  });

  const toggleAcordeon = (id) => {
    setAcordeoes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --------------------------------------------------------------------------
  // ESTADOS DAS ESCOLHAS
  // --------------------------------------------------------------------------
  // ABA 1: Transfer
  const [transferTerrestre, setTransferTerrestre] = useState('privativo'); // 'privativo' | 'compartilhado' | 'nenhum'
  const [heliTransferSelecionado, setHeliTransferSelecionado] = useState(null); // 'jjd' | 'fortaleza' | 'camocim' | 'parnaiba' | null

  // ABA 2: Passeios Terrestres
  // 1) Litoral Leste
  const [lesteAtivo, setLesteAtivo] = useState(true);
  const [lesteData, setLesteData] = useState('10/11 (Terça)');
  const [lesteVeiculo, setLesteVeiculo] = useState('sw4'); // 'sw4' | 'utv'
  const [lesteBeachClubs, setLesteBeachClubs] = useState({
    buracoAzul: true,
    lagunBeach: false,
    carauba: false,
    alchymist: false,
    blueLagoon: false,
    comboAlchymistBlue: true, // Combo selecionado por padrão
    vipAreaSobConsulta: false,
  });

  // 2) Litoral Oeste
  const [oesteAtivo, setOesteAtivo] = useState(false);
  const [oesteData, setOesteData] = useState('12/11 (Quinta)');
  const [oesteVeiculo, setOesteVeiculo] = useState('sw4');

  // 3) Barrinha & Base Náutica
  const [barrinhaAtivo, setBarrinhaAtivo] = useState(true);
  const [barrinhaData, setBarrinhaData] = useState('13/11 (Sexta)');
  const [barrinhaVeiculo, setBarrinhaVeiculo] = useState('sw4');
  const [barrinhaBeachClub, setBarrinhaBeachClub] = useState('Munzuá Pier Club');
  const [barrinhaVipSobConsulta, setBarrinhaVipSobConsulta] = useState(false);
  const [barrinhaNautico, setBarrinhaNautico] = useState({
    jetSki12Min: true,
    jetSkiSegmar25Min: false,
    jetSki1Hora: false,
    jetSkiIndividual2Pax: false,
    wakeboard2Pax: false,
    esqui2Pax: false,
    boiaJetDuo: false,
    bicicletaAquatica: false,
    caiaque2Pax: false,
    sup2Pax: false,
    bananaBoat2Pax: false,
    lanchaPrivativaSobConsulta: true,
  });

  // 4) Oeste Extremo
  const [oesteExtremoAtivo, setOesteExtremoAtivo] = useState(false);
  const [oesteExtremoData, setOesteExtremoData] = useState('14/11 (Sábado)');

  // 5) Pôr do Sol Dunas do Amâncio
  const [porDoSolAtivo, setPorDoSolAtivo] = useState(false);
  const [porDoSolData, setPorDoSolData] = useState('11/11 (Quarta)');

  // ABA 3: Voos de Helicóptero & Gastronomia
  const [heliRoteiroSelecionado, setHeliRoteiroSelecionado] = useState(null); // 1 a 11 ou null
  const [gastronomiaSobConsulta, setGastronomiaSobConsulta] = useState(false);
  const [gastronomiaObs, setGastronomiaObs] = useState('');

  // ABA 4: Extras & Pedidos Especiais
  const [droneAtivo, setDroneAtivo] = useState(false);
  const [pedidosEspeciais, setPedidosEspeciais] = useState([
    { id: 'esp_1', texto: 'Prioridade absoluta de ar-condicionado e cabine fechada na SW4', sobConsulta: false },
  ]);
  const [novoPedidoInput, setNovoPedidoInput] = useState('');

  // --------------------------------------------------------------------------
  // REGRAS DE NEGÓCIO ESPECIAIS (ex: Combo Alchymist + Blue Lagoon)
  // --------------------------------------------------------------------------
  const toggleBeachClubLeste = (id) => {
    setLesteBeachClubs((prev) => {
      if (id === 'comboAlchymistBlue') {
        const novoValor = !prev.comboAlchymistBlue;
        return {
          ...prev,
          comboAlchymistBlue: novoValor,
          alchymist: false,
          blueLagoon: false,
        };
      }
      if (id === 'alchymist' || id === 'blueLagoon') {
        return {
          ...prev,
          [id]: !prev[id],
          comboAlchymistBlue: false,
        };
      }
      return {
        ...prev,
        [id]: !prev[id],
      };
    });
  };

  const toggleNauticoBarrinha = (id) => {
    setBarrinhaNautico((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const adicionarPedidoEspecial = (e) => {
    e.preventDefault();
    if (!novoPedidoInput.trim()) return;
    setPedidosEspeciais((prev) => [
      ...prev,
      { id: `ped_${Date.now()}`, texto: novoPedidoInput.trim(), sobConsulta: true },
    ]);
    setNovoPedidoInput('');
  };

  const removerPedidoEspecial = (id) => {
    setPedidosEspeciais((prev) => prev.filter((p) => p.id !== id));
  };

  // --------------------------------------------------------------------------
  // BOTÃO DE DÚVIDA CONTEXTUAL PARA O WHATSAPP
  // --------------------------------------------------------------------------
  const abrirDuvidaWhatsApp = (topico) => {
    const texto = `Olá, Ítalo! Aqui é o Ueiner Jajah. Estou no meu Portal de Planejamento e fiquei com uma dúvida sobre o tópico: *${topico}*. Pode me explicar melhor?`;
    window.open(`https://wa.me/${WHATSAPP_ITALO}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  // --------------------------------------------------------------------------
  // FORMATADOR DE MOEDA
  // --------------------------------------------------------------------------
  const formatarMoeda = (val) =>
    Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // --------------------------------------------------------------------------
  // CÁLCULO CENTRAL DO ORÇAMENTO (CONFIRMADO VS SOB CONSULTA)
  // --------------------------------------------------------------------------
  const resumoCalculado = useMemo(() => {
    const confirmados = [];
    const sobConsulta = [];

    // 1. Transfer
    if (transferTerrestre === 'privativo') {
      confirmados.push({
        categoria: 'Transfer',
        titulo: 'Transfer Privativo 4x4 Hilux/SW4 (Ida e Volta)',
        detalhe: 'Aeroporto JJD ⇄ Essenza Dune (2 pessoas com total privacidade)',
        valor: precos.transferPrivativoSW4IdaVolta,
      });
    } else if (transferTerrestre === 'compartilhado') {
      confirmados.push({
        categoria: 'Transfer',
        titulo: 'Transfer Terrestre Compartilhado (Ida e Volta)',
        detalhe: 'Aeroporto JJD ⇄ Jeri (2 pessoas)',
        valor: precos.transferCompartilhadoIdaVolta,
      });
    }

    if (heliTransferSelecionado === 'jjd') {
      confirmados.push({
        categoria: 'Transfer',
        titulo: 'Transfer de Helicóptero Jeri ⇄ Aeroporto JJD',
        detalhe: 'Voo privativo direto para o aeroporto',
        valor: precos.heliTransferJJD,
      });
    } else if (heliTransferSelecionado === 'fortaleza') {
      confirmados.push({
        categoria: 'Transfer',
        titulo: 'Transfer de Helicóptero Jeri ⇄ Fortaleza',
        detalhe: 'Voo privativo direto',
        valor: precos.heliTransferFortaleza,
      });
    } else if (heliTransferSelecionado === 'camocim') {
      confirmados.push({
        categoria: 'Transfer',
        titulo: 'Transfer de Helicóptero Jeri ⇄ Camocim',
        detalhe: 'Voo privativo',
        valor: precos.heliTransferCamocim,
      });
    } else if (heliTransferSelecionado === 'parnaiba') {
      confirmados.push({
        categoria: 'Transfer',
        titulo: 'Transfer de Helicóptero Jeri ⇄ Parnaíba',
        detalhe: 'Voo privativo',
        valor: precos.heliTransferParnaiba,
      });
    }

    // 2. Passeios Terrestres
    // Leste
    if (lesteAtivo) {
      const precoVeiculo = lesteVeiculo === 'sw4' ? precos.lesteSW4 : precos.lesteUTV;
      confirmados.push({
        categoria: 'Passeio Leste',
        titulo: `Litoral Leste em ${lesteVeiculo === 'sw4' ? 'SW4 4x4 Privativa' : 'UTV Can-Am Adventure'}`,
        detalhe: `Data selecionada: ${lesteData} (09:30 às 15:30)`,
        valor: precoVeiculo,
      });

      if (lesteBeachClubs.buracoAzul) {
        confirmados.push({
          categoria: 'Beach Clubs Leste',
          titulo: 'Buraco Azul — Ingressos (2 pessoas)',
          detalhe: 'Acesso às águas azul-turquesa de Caiçara',
          valor: precos.buracoAzul2Pax,
        });
      }
      if (lesteBeachClubs.lagunBeach) {
        confirmados.push({
          categoria: 'Beach Clubs Leste',
          titulo: 'Lagun Beach / Lagoa Azul (2 pessoas)',
          detalhe: 'Acesso e lounge',
          valor: precos.lagunBeach2Pax,
        });
      }
      if (lesteBeachClubs.carauba) {
        confirmados.push({
          categoria: 'Beach Clubs Leste',
          titulo: 'Caraúba Beach (2 pessoas)',
          detalhe: 'Acesso e lounge na Lagoa do Paraíso',
          valor: precos.carauba2Pax,
        });
      }
      if (lesteBeachClubs.comboAlchymistBlue) {
        confirmados.push({
          categoria: 'Beach Clubs Leste',
          titulo: 'COMBO ESPECIAL: Alchymist + Blue Lagoon (2 pessoas)',
          detalhe: 'Acesso aos 2 lounges mais exclusivos com tarifa especial promocional',
          valor: precos.comboAlchymistBlue2Pax,
        });
      } else {
        if (lesteBeachClubs.alchymist) {
          confirmados.push({
            categoria: 'Beach Clubs Leste',
            titulo: 'Alchymist Beach Club (2 pessoas)',
            detalhe: 'Acesso individual padrão',
            valor: precos.alchymist2Pax,
          });
        }
        if (lesteBeachClubs.blueLagoon) {
          confirmados.push({
            categoria: 'Beach Clubs Leste',
            titulo: 'Blue Lagoon (2 pessoas)',
            detalhe: 'Acesso individual padrão',
            valor: precos.blueLagoon2Pax,
          });
        }
      }

      if (lesteBeachClubs.vipAreaSobConsulta) {
        sobConsulta.push({
          categoria: 'Beach Clubs Leste',
          titulo: 'Área VIP / Bangalô Exclusivo no Leste',
          detalhe: 'Reserva de espaço privativo com garçom dedicado',
        });
      }
    }

    // Oeste
    if (oesteAtivo) {
      const precoVeiculo = oesteVeiculo === 'sw4' ? precos.oesteSW4 : precos.oesteUTV;
      confirmados.push({
        categoria: 'Passeio Oeste',
        titulo: `Litoral Oeste em ${oesteVeiculo === 'sw4' ? 'SW4 4x4 Privativa' : 'UTV Can-Am Adventure'}`,
        detalhe: `Data: ${oesteData} • Inclui Balsa, Mangue Seco, Dunas de Tatajuba e Lagoas`,
        valor: precoVeiculo,
      });
    }

    // Barrinha
    if (barrinhaAtivo) {
      const precoVeiculo = barrinhaVeiculo === 'sw4' ? precos.barrinhaSW4 : precos.barrinhaUTV;
      confirmados.push({
        categoria: 'Passeio Barrinha',
        titulo: `Passeio Barrinha em ${barrinhaVeiculo === 'sw4' ? 'SW4 4x4 Privativa' : 'UTV Can-Am'}`,
        detalhe: `Data: ${barrinhaData} • Base: ${barrinhaBeachClub}`,
        valor: precoVeiculo,
      });

      if (barrinhaVipSobConsulta) {
        sobConsulta.push({
          categoria: 'Passeio Barrinha',
          titulo: `Espaço VIP Privativo no ${barrinhaBeachClub}`,
          detalhe: 'Lounge reservado com atendimento exclusivo',
        });
      }

      // Esportes Náuticos Barrinha
      if (barrinhaNautico.jetSki12Min) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Jet Ski — Passeio 12 min (2 pessoas na moto)',
          detalhe: 'Navegação pela orla da Barrinha com instrutor de apoio',
          valor: precos.nauticoJetSki12Min,
        });
      }
      if (barrinhaNautico.jetSkiSegmar25Min) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Jet Ski — Segmar Experience 25 min (Até 2 pax)',
          detalhe: 'Circuito estendido em alta cilindrada',
          valor: precos.nauticoJetSkiSegmar25Min,
        });
      }
      if (barrinhaNautico.jetSki1Hora) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Jet Ski — Aluguel 1 Hora Compartilhado',
          detalhe: 'Tempo livre para pilotagem assistida',
          valor: precos.nauticoJetSki1Hora,
        });
      }
      if (barrinhaNautico.jetSkiIndividual2Pax) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Jet Ski — Passeio Individual (2 motos separadas)',
          detalhe: 'Uma moto dedicada para cada passageiro',
          valor: precos.nauticoJetSkiIndividual2Pax,
        });
      }
      if (barrinhaNautico.wakeboard2Pax) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Wakeboard (Surf + Jet Ski 30 min • 2 pessoas)',
          detalhe: 'Equipamento e prancha inclusos',
          valor: precos.nauticoWakeboard2Pax,
        });
      }
      if (barrinhaNautico.esqui2Pax) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Esqui Aquático (Surf + Jet Ski 30 min • 2 pessoas)',
          detalhe: 'Esporte clássico de adrenalina na água',
          valor: precos.nauticoEsqui2Pax,
        });
      }
      if (barrinhaNautico.boiaJetDuo) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Boia Jet Duo Adventure (2 pessoas)',
          detalhe: 'Passeio divertido puxado por moto aquática',
          valor: precos.nauticoBoiaJetDuo,
        });
      }
      if (barrinhaNautico.bicicletaAquatica) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Bicicleta Aquática (25 min • até 2 pax)',
          detalhe: 'Passeio tranquilo pelas águas calmas',
          valor: precos.nauticoBicicletaAquatica,
        });
      }
      if (barrinhaNautico.caiaque2Pax) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Caiaque Duplo (25 min • 2 pessoas)',
          detalhe: 'Remada cênica pela orla',
          valor: precos.nauticoCaiaque2Pax,
        });
      }
      if (barrinhaNautico.sup2Pax) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Stand Up Paddle (25 min • 2 pessoas)',
          detalhe: '2 pranchas de SUP inclusas',
          valor: precos.nauticoSup2Pax,
        });
      }
      if (barrinhaNautico.bananaBoat2Pax) {
        confirmados.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Banana Boat na Barrinha (2 pessoas)',
          detalhe: 'Atração aquática em grupo',
          valor: precos.nauticoBananaBoat2Pax,
        });
      }
      if (barrinhaNautico.lanchaPrivativaSobConsulta) {
        sobConsulta.push({
          categoria: 'Náutico Barrinha',
          titulo: 'Lancha Privativa na Barrinha (Capacidade 7 a 8 pax)',
          detalhe: 'Fretamento exclusivo para navegar e atracar nos melhores bancos de areia',
        });
      }
    }

    // Oeste Extremo
    if (oesteExtremoAtivo) {
      confirmados.push({
        categoria: 'Passeio Oeste Extremo',
        titulo: 'Passeio Oeste Extremo (Hilux/SW4 Privativa)',
        detalhe: `Data: ${oesteExtremoData} • Rota de dunas selvagens e praias desertas`,
        valor: precos.oesteExtremoSW4,
      });
    }

    // Pôr do Sol
    if (porDoSolAtivo) {
      confirmados.push({
        categoria: 'Pôr do Sol',
        titulo: 'Passeio Pôr do Sol nas Dunas do Amâncio em SW4',
        detalhe: `Data: ${porDoSolData} (16:30 às 18:00)`,
        valor: precos.porDoSolSW4,
      });
    }

    // 3. Voos de Helicóptero
    if (heliRoteiroSelecionado) {
      const dadosVoos = {
        1: { nome: 'Passeio 01 — Compartilhado (5 min)', preco: precos.heli01, desc: 'Saída Buraco Azul ou Lagun Beach (2 pessoas)' },
        2: { nome: 'Passeio 02 — Parque Nacional & Jeri (10 min Privativo)', preco: precos.heli02, desc: 'Árvore Preguiça, Farol, Pedra Furada, Duna Pôr do Sol (até 3 pax)' },
        3: { nome: 'Passeio 03 — Circuito Oeste (15 min Privativo)', preco: precos.heli03, desc: 'Pedra Furada, Guriú, Mangue Seco, Tatajuba e Laguna' },
        4: { nome: 'Passeio 04 — Circuito Leste (15 min Privativo)', preco: precos.heli04, desc: 'Lagoa Paraíso, Lagoa Azul, Lagun Beach, Buraco Azul, Preá' },
        5: { nome: 'Passeio 05 — Extremo Leste (25 min Privativo)', preco: precos.heli05, desc: 'Lagoas, Buraco Azul, Beira D\'Água, Barrinha e Preá' },
        6: { nome: 'Passeio 06 — Lagun Beach COM POUSO (22 min Privativo)', preco: precos.heli06, desc: 'Saída 10h30 + Parada de 4h30 no Buraco Azul + Retorno 15h' },
        7: { nome: 'Passeio 07 — Promocional Leste + Oeste (30 min Privativo)', preco: precos.heli07, desc: 'Passeios 2, 3 e 4 completos em um único sobrevoo' },
        8: { nome: 'Passeio 08 — Laguna COM POUSO (25 min Privativo)', preco: precos.heli08, desc: 'Saída 11h30 + Parada de 3h30 no Lago Grande + Retorno 15h' },
        9: { nome: 'Passeio 09 — Beira D\'Água COM POUSO (25 min Privativo)', preco: precos.heli09, desc: 'Saída 10h30 + Parada de 4h30 no Beira D\'Água + Retorno 15h' },
        10: { nome: 'Passeio 10 — Barra Grande (1h40 Privativo)', preco: precos.heli10, desc: 'Jeri, Tatajuba, Camocim e Barra Grande' },
        11: { nome: 'Passeio 11 — Lençóis Maranhenses COM POUSO (4h Privativo)', preco: precos.heli11, desc: 'Delta do Parnaíba, Atins, Lençóis + 2h30 em Barreirinhas' },
      };
      const voo = dadosVoos[heliRoteiroSelecionado];
      if (voo) {
        confirmados.push({
          categoria: 'Voo de Helicóptero',
          titulo: voo.nome,
          detalhe: voo.desc,
          valor: voo.preco,
        });
      }
    }

    // Gastronomia
    if (gastronomiaSobConsulta) {
      sobConsulta.push({
        categoria: 'Gastronomia',
        titulo: 'Reserva VIP em Restaurantes Exclusivos de Jeri',
        detalhe: gastronomiaObs || 'Melhores mesas e horários reservados pelo Concierge',
      });
    }

    // 4. Extras
    if (droneAtivo) {
      confirmados.push({
        categoria: 'Extras & Mídia',
        titulo: 'Cobertura com Drone & Fotógrafo Privativo',
        detalhe: 'Profissional com drone acompanhando um dos passeios',
        valor: precos.droneFotografo,
      });
    }

    pedidosEspeciais.forEach((p) => {
      if (p.sobConsulta) {
        sobConsulta.push({
          categoria: 'Pedido Personalizado',
          titulo: p.texto,
          detalhe: 'Solicitação especial a ser confirmada com o consultor',
        });
      }
    });

    const totalConfirmado = confirmados.reduce((acc, curr) => acc + curr.valor, 0);

    return {
      confirmados,
      sobConsulta,
      totalConfirmado,
      totalItens: confirmados.length + sobConsulta.length,
    };
  }, [
    precos,
    transferTerrestre,
    heliTransferSelecionado,
    lesteAtivo,
    lesteData,
    lesteVeiculo,
    lesteBeachClubs,
    oesteAtivo,
    oesteData,
    oesteVeiculo,
    barrinhaAtivo,
    barrinhaData,
    barrinhaVeiculo,
    barrinhaBeachClub,
    barrinhaVipSobConsulta,
    barrinhaNautico,
    oesteExtremoAtivo,
    oesteExtremoData,
    porDoSolAtivo,
    porDoSolData,
    heliRoteiroSelecionado,
    gastronomiaSobConsulta,
    gastronomiaObs,
    droneAtivo,
    pedidosEspeciais,
  ]);

  // --------------------------------------------------------------------------
  // ENVIO DO ROTEIRO COMPLETO PARA O WHATSAPP DO ÍTALO
  // --------------------------------------------------------------------------
  const enviarPlanejamentoWhatsApp = () => {
    const { confirmados, sobConsulta, totalConfirmado } = resumoCalculado;

    const linhasConfirmadas = confirmados.map(
      (c) => `  ✓ *${c.titulo}*: ${formatarMoeda(c.valor)}\n    _${c.detalhe}_`
    );

    const linhasSobConsulta = sobConsulta.map(
      (s) => `  ⏳ *${s.titulo}* (Sob Consulta)\n    _${s.detalhe}_`
    );

    const mensagem = [
      `Olá, Ítalo! Aqui é o *${DADOS_CLIENTE.nome}*.`,
      `Finalizei meu roteiro personalizado para *${DADOS_CLIENTE.viajantes}* no Portal da *Jericoacoara Premium*:`,
      ``,
      `🏨 *Hospedagem:* ${DADOS_CLIENTE.hotel}`,
      `📅 *Período:* ${DADOS_CLIENTE.periodo}`,
      `🛬 *Chegada:* ${DADOS_CLIENTE.chegada}`,
      `🛫 *Retorno:* ${DADOS_CLIENTE.retorno}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💎 *ITENS SELECIONADOS & CONFIRMADOS:*`,
      ...linhasConfirmadas,
      ``,
      `💰 *VALOR TOTAL CONFIRMADO:* *${formatarMoeda(totalConfirmado)}*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ...(linhasSobConsulta.length > 0
        ? [
            ``,
            `📋 *ITENS ADICIONAIS SOB CONSULTA:*`,
            ...linhasSobConsulta,
            ``,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          ]
        : []),
      ``,
      `Podemos revisar os horários e prosseguir com a reserva formal?`,
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_ITALO}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  // --------------------------------------------------------------------------
  // LISTA DOS 11 VOOS DE HELICÓPTERO (ABA 3)
  // --------------------------------------------------------------------------
  const listaVoosHelicoptero = [
    {
      id: 1,
      titulo: 'Passeio 01 — Compartilhado (5 min)',
      tag: 'Econômico',
      duracao: '5 min',
      tipo: 'Compartilhado (2 pax)',
      roteiro: 'Voo panorâmico saindo do Buraco Azul ou Lagun Beach com sobrevoo pelas águas azul-turquesa.',
      precoKey: 'heli01',
    },
    {
      id: 2,
      titulo: 'Passeio 02 — Parque Nacional & Jeri (10 min)',
      tag: 'Mais Popular',
      duracao: '10 min',
      tipo: 'Privativo até 3 pax',
      roteiro: 'Parque Nacional, Árvore da Preguiça, Serrote, Farol, Pedra Furada, Praia da Malhada, Vila de Jeri e Duna do Pôr do Sol.',
      precoKey: 'heli02',
    },
    {
      id: 3,
      titulo: 'Passeio 03 — Circuito Oeste (15 min)',
      tag: 'Dunas & Mangue',
      duracao: '15 min',
      tipo: 'Privativo até 3 pax',
      roteiro: 'Parque Nacional, Pedra Furada, Guriú, Mangue Seco, Dunas de Tatajuba e Laguna.',
      precoKey: 'heli03',
    },
    {
      id: 4,
      titulo: 'Passeio 04 — Circuito Leste (15 min)',
      tag: 'Lagoas Voadoras',
      duracao: '15 min',
      tipo: 'Privativo até 3 pax',
      roteiro: 'Lagoa do Paraíso, Lagoa Azul, Lagun Beach, Buraco Azul, Preá, Pedra Furada e Jeri.',
      precoKey: 'heli04',
    },
    {
      id: 5,
      titulo: 'Passeio 05 — Extremo Leste (25 min)',
      tag: 'Costa Completa',
      duracao: '25 min',
      tipo: 'Privativo até 3 pax',
      roteiro: 'Lagoas, Buraco Azul, Muicuarí, Beira D\'Água, Praia e Dunas da Barrinha, Preá, Pedra Furada e Jeri.',
      precoKey: 'heli05',
    },
    {
      id: 6,
      titulo: 'Passeio 06 — Lagun Beach COM POUSO',
      tag: 'Experiência c/ Pouso',
      duracao: '22 min voo + 4h30 parada',
      tipo: 'Privativo VIP',
      roteiro: 'Decola às 10h30 sobrevoando o Leste, pousa com parada de 4h30 no Buraco Azul / Lagun Beach e retorna às 15h.',
      precoKey: 'heli06',
    },
    {
      id: 7,
      titulo: 'Passeio 07 — Promocional Leste + Oeste (30 min)',
      tag: 'Super Completo',
      duracao: '30 min',
      tipo: 'Privativo até 3 pax',
      roteiro: 'Combinação dos Passeios 2, 3 e 4 em um único sobrevoo épico cobrindo toda a extensão litorânea.',
      precoKey: 'heli07',
    },
    {
      id: 8,
      titulo: 'Passeio 08 — Laguna COM POUSO',
      tag: 'Experiência c/ Pouso',
      duracao: '25 min voo + 3h30 parada',
      tipo: 'Privativo VIP',
      roteiro: 'Decola às 11h30 sobrevoando o Oeste, pousa no Lago Grande (Tatajuba) com 3h30 de parada e retorna às 15h.',
      precoKey: 'heli08',
    },
    {
      id: 9,
      titulo: 'Passeio 09 — Beira D\'Água COM POUSO',
      tag: 'Experiência c/ Pouso',
      duracao: '25 min voo + 4h30 parada',
      tipo: 'Privativo VIP',
      roteiro: 'Decola às 10h30 sobrevoando o Leste, pousa com 4h30 de Day Use no Beach Club Beira D\'Água e retorna às 15h.',
      precoKey: 'heli09',
    },
    {
      id: 10,
      titulo: 'Passeio 10 — Barra Grande (1h40 min)',
      tag: 'Expedição Piauí',
      duracao: '1h40 min voo',
      tipo: 'Privativo até 3 pax',
      roteiro: 'Sobrevoo espetacular ligando Jeri, Tatajuba, Camocim e a famosa praia de Barra Grande (PI).',
      precoKey: 'heli10',
    },
    {
      id: 11,
      titulo: 'Passeio 11 — Lençóis Maranhenses COM POUSO',
      tag: 'Expedição Máxima',
      duracao: '4h totais (2h30 parada)',
      tipo: 'Privativo Exclusivo',
      roteiro: 'Sobrevoo Delta do Parnaíba, Atins e Lençóis Maranhenses com pouso e parada de 2h30 em Barreirinhas.',
      precoKey: 'heli11',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans pb-36 selection:bg-amber-200">
      <Helmet>
        <title>Planejamento Exclusivo — Ueiner Jajah | Jericoacoara Premium</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ==================================================================== */}
      {/* HEADER DE LUXO DO CONCIERGE */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#121314]/95 backdrop-blur-md text-stone-100 border-b border-amber-500/25 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">
                Jericoacoara Premium • Private Concierge
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white mt-0.5">
              Planejamento — {DADOS_CLIENTE.nome} ({DADOS_CLIENTE.viajantes})
            </h1>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[11px] sm:text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-semibold">
              {DADOS_CLIENTE.hotel} • {DADOS_CLIENTE.periodo}
            </span>
            {isConsultorAutorizado && (
              <button
                onClick={() => setModoConsultor(!modoConsultor)}
                className="text-[10px] sm:text-[11px] text-stone-400 hover:text-amber-300 mt-1 underline transition-colors"
                title="Permite que o Ítalo altere os valores base em tempo real"
              >
                {modoConsultor ? '✕ Fechar Painel do Consultor' : '⚙️ Modo Consultor Ítalo (Editar Preços)'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* PAINEL RÁPIDO DO CONSULTOR ÍTALO (QUANDO AUTORIZADO E ATIVADO) */}
      {/* ==================================================================== */}
      {isConsultorAutorizado && modoConsultor && (
        <div className="bg-[#1C1917] text-amber-100 border-b-2 border-amber-500 px-4 py-4 shadow-xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ⚙️ Modo Consultor Ítalo — Ajuste os preços base na tela em tempo real:
              </span>
              <button
                onClick={() => setPrecos(PRECOS_INICIAIS)}
                className="text-[11px] text-amber-300/80 hover:text-white underline"
              >
                Restaurar Preços Padrão
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs max-h-64 overflow-y-auto p-1 bg-black/40 rounded-xl">
              {Object.keys(precos).map((chave) => (
                <div key={chave} className="flex flex-col bg-stone-900/90 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-[10px] text-stone-400 truncate mb-1" title={chave}>
                    {chave}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 font-bold">R$</span>
                    <input
                      type="number"
                      value={precos[chave]}
                      onChange={(e) =>
                        setPrecos((prev) => ({ ...prev, [chave]: Number(e.target.value) || 0 }))
                      }
                      className="w-full bg-stone-950 text-amber-300 font-bold px-2 py-1 rounded border border-amber-500/40 text-right focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* NAVEGAÇÃO EM 4 ABAS LIMPAS ESTILO LUXO */}
      {/* ==================================================================== */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-5">
        <div className="bg-stone-200/80 p-1.5 rounded-2xl flex items-center justify-between gap-1 border border-stone-300/70 shadow-inner overflow-x-auto no-scrollbar">
          {[
            { id: 'transfer', label: '1. Transfer (Aeroporto)' },
            { id: 'passeios', label: '2. Passeios Terrestres' },
            { id: 'experiencias', label: '3. Helicóptero & Gastronomia' },
            { id: 'extras', label: '4. Extras & Revisão' },
          ].map((aba) => {
            const ativa = abaAtiva === aba.id;
            return (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex-1 min-w-fit py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  ativa
                    ? 'bg-[#121314] text-amber-300 shadow-md scale-[1.01]'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-300/50'
                }`}
              >
                {aba.label}
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* ABA 1: TRANSFER (AEROPORTO JJD 09/11 E 16/11) */}
        {/* ==================================================================== */}
        {abaAtiva === 'transfer' && (
          <div className="mt-5 space-y-4">
            {/* CARD INFORMATIVO DE HORÁRIOS */}
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Logística dos Voos do Sr. Ueiner Jajah (2 Viajantes):
                </span>
                <p className="text-xs sm:text-sm text-stone-800 font-semibold mt-0.5">
                  Chegada: <strong>09/11 às 12:00</strong> (JJD) • Retorno: <strong>16/11 às 12:40</strong> (Sugestão saída do Essenza: <strong>10:40</strong>)
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirDuvidaWhatsApp('Transfer Aeroporto JJD')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-full border border-amber-300/80 transition-colors whitespace-nowrap shrink-0"
              >
                <span>💬</span>
                <span>Dúvida sobre o Transfer? Chamar Ítalo</span>
              </button>
            </div>

            {/* OPÇÕES DE TRANSFER TERRESTRE */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center justify-between">
                <span>Escolha o Transfer Terrestre (Ida e Volta para 2 Pessoas):</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Privativo 4x4 */}
                <div
                  onClick={() => setTransferTerrestre('privativo')}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                    transferTerrestre === 'privativo'
                      ? 'border-amber-500 bg-amber-50/30 shadow-md ring-1 ring-amber-500/30'
                      : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Recomendado VIP
                    </span>
                    <span className="text-base font-extrabold text-stone-900">
                      {formatarMoeda(precos.transferPrivativoSW4IdaVolta)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">Privativo 4x4 Hilux/SW4 (Ida e Volta)</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    R$ 275 por trecho/veículo. Sem esperas, motorista dedicado aguardando no desembarque e trajeto 100% climatizado com conforto térmico.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-800">
                    <span>{transferTerrestre === 'privativo' ? '✓ Selecionado' : 'Toque para escolher'}</span>
                  </div>
                </div>

                {/* 2. Compartilhado */}
                <div
                  onClick={() => setTransferTerrestre('compartilhado')}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                    transferTerrestre === 'compartilhado'
                      ? 'border-amber-500 bg-amber-50/30 shadow-md ring-1 ring-amber-500/30'
                      : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                      Compartilhado
                    </span>
                    <span className="text-base font-extrabold text-stone-900">
                      {formatarMoeda(precos.transferCompartilhadoIdaVolta)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">Transfer Terrestre Compartilhado (2 pax)</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    R$ 100 por pessoa por trecho (Total R$ 400 Ida e Volta para 2 pessoas). Veículo compartilhado com outros passageiros com saídas coordenadas.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-stone-600">
                    <span>{transferTerrestre === 'compartilhado' ? '✓ Selecionado' : 'Toque para escolher'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPANSÍVEL: TRANSFER DE HELICÓPTERO */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAcordeon('heliTransfer')}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚁</span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-stone-900">
                      Transfer Aéreo de Helicóptero (Opcional VIP)
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Pouse diretamente em Jericoacoara sem enfrentar estradas ou areia.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {heliTransferSelecionado && (
                    <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                      1 Selecionado
                    </span>
                  )}
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    {acordeoes.heliTransfer ? '− Recolher opções' : '+ Ver opções de Transfer Aéreo'}
                  </span>
                </div>
              </button>

              {acordeoes.heliTransfer && (
                <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'jjd', nome: 'Jeri ⇄ Aeroporto JJD (por trecho)', preco: precos.heliTransferJJD, desc: 'Apenas 10 min de voo até a pista de pouso' },
                      { id: 'fortaleza', nome: 'Jeri ⇄ Fortaleza (por trecho)', preco: precos.heliTransferFortaleza, desc: 'Voo executivo sem conexões terrestres' },
                      { id: 'camocim', nome: 'Jeri ⇄ Camocim (por trecho)', preco: precos.heliTransferCamocim, desc: 'Conexão rápida com a orla Oeste' },
                      { id: 'parnaiba', nome: 'Jeri ⇄ Parnaíba (por trecho)', preco: precos.heliTransferParnaiba, desc: 'Ligação direta para o Delta e Rota das Emoções' },
                    ].map((item) => {
                      const sel = heliTransferSelecionado === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setHeliTransferSelecionado(sel ? null : item.id)}
                          className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                            sel
                              ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/30'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs sm:text-sm text-stone-900">{item.nome}</span>
                            <span className="font-extrabold text-xs sm:text-sm text-amber-800">
                              {formatarMoeda(item.preco)}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                          <div className="mt-2 text-[11px] font-bold text-amber-700">
                            {sel ? '✓ Incluído no Roteiro' : '+ Selecionar este voo'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {heliTransferSelecionado && (
                    <button
                      type="button"
                      onClick={() => setHeliTransferSelecionado(null)}
                      className="text-xs text-stone-400 hover:text-red-600 underline pt-1 block"
                    >
                      Remover helicóptero e usar apenas transfer terrestre
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: PASSEIOS TERRESTRES (SAÍDA 09:30 ÀS 15:30/16:00 | PÔR DO SOL) */}
        {/* ==================================================================== */}
        {abaAtiva === 'passeios' && (
          <div className="mt-5 space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Horários Padrão dos Passeios Privativos:
                </span>
                <p className="text-xs sm:text-sm text-stone-800 font-semibold mt-0.5">
                  Saída matutina: <strong>09:30 às 15:30 / 16:00</strong> • Passeio Pôr do Sol: <strong>16:30 às 18:00</strong> (Saindo do Essenza Dune)
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirDuvidaWhatsApp('Passeios Terrestres')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-full border border-amber-300/80 transition-colors whitespace-nowrap shrink-0"
              >
                <span>💬</span>
                <span>Dúvida sobre os Passeios? Chamar Ítalo</span>
              </button>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* 1. LITORAL LESTE */}
            {/* ---------------------------------------------------------------- */}
            <div
              className={`rounded-2xl border transition-all ${
                lesteAtivo
                  ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white/80 border-stone-200'
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={lesteAtivo}
                      onChange={() => setLesteAtivo(!lesteAtivo)}
                      className="w-5 h-5 accent-stone-900 rounded cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-stone-900">1. Litoral Leste VIP</h3>
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          Imperdível
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Árvore da Preguiça, Praia do Preá, Duna do Amâncio, Pedra Furada e Lagoas cristalinas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => abrirDuvidaWhatsApp('Litoral Leste VIP')}
                      className="text-[11px] text-stone-500 hover:text-amber-800 underline"
                    >
                      💬 Dúvida Leste?
                    </button>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-extrabold text-stone-900">
                        {formatarMoeda(lesteVeiculo === 'sw4' ? precos.lesteSW4 : precos.lesteUTV)}
                      </span>
                      <span className="block text-[10px] text-stone-500">veículo privativo</span>
                    </div>
                  </div>
                </div>

                {lesteAtivo && (
                  <div className="pt-4 space-y-4">
                    {/* SELEÇÃO DE DATA E VEÍCULO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                          📅 Associar Data do Passeio:
                        </label>
                        <select
                          value={lesteData}
                          onChange={(e) => setLesteData(e.target.value)}
                          className="w-full bg-white text-xs sm:text-sm font-semibold text-stone-800 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-stone-900"
                        >
                          {DATAS_DISPONIVEIS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                          🚘 Escolha do Veículo:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setLesteVeiculo('sw4')}
                            className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                              lesteVeiculo === 'sw4'
                                ? 'bg-stone-900 text-amber-300 border-amber-400'
                                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            Hilux SW4 ({formatarMoeda(precos.lesteSW4)})
                          </button>
                          <button
                            type="button"
                            onClick={() => setLesteVeiculo('utv')}
                            className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                              lesteVeiculo === 'utv'
                                ? 'bg-stone-900 text-amber-300 border-amber-400'
                                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            UTV Can-Am ({formatarMoeda(precos.lesteUTV)})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BOTÃO EXPANSÍVEL: BEACH CLUBS DO LESTE */}
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleAcordeon('lesteBeachClubs')}
                        className="w-full p-3.5 bg-stone-100/70 hover:bg-stone-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏖️</span>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                              + Escolher Paradas e Beach Clubs do Leste (Calculados p/ 2 pessoas)
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Árvore da Preguiça e Preá inclusos sem custo • Adicione os lounges preferidos
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-800 bg-white border border-stone-200 px-3 py-1 rounded-lg">
                          {acordeoes.lesteBeachClubs ? '− Fechar' : '+ Personalizar paradas'}
                        </span>
                      </button>

                      {acordeoes.lesteBeachClubs && (
                        <div className="p-4 bg-white border-t border-stone-200 space-y-2.5">
                          {/* INCLUSOS */}
                          <div className="p-2.5 bg-stone-50 rounded-lg text-xs text-stone-600 border border-stone-200">
                            <strong>✓ Paradas inclusas sem custo adicional:</strong> Árvore da Preguiça, Praia do Preá, Duna do Amâncio e caminhada à Pedra Furada.
                          </div>

                          {/* COMBO DESTAQUE */}
                          <div
                            onClick={() => toggleBeachClubLeste('comboAlchymistBlue')}
                            className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                              lesteBeachClubs.comboAlchymistBlue
                                ? 'bg-amber-50/60 border-amber-500 shadow-sm'
                                : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={lesteBeachClubs.comboAlchymistBlue}
                                onChange={() => toggleBeachClubLeste('comboAlchymistBlue')}
                                className="w-4 h-4 accent-stone-900 rounded"
                              />
                              <div>
                                <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                                  ⭐ COMBO ESPECIAL: Alchymist + Blue Lagoon (2 pessoas)
                                </span>
                                <span className="text-[11px] text-stone-600">
                                  De R$ 300 por apenas <strong>{formatarMoeda(precos.comboAlchymistBlue2Pax)}</strong> (R$ 130/pax • Economia de R$ 40)
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-extrabold text-amber-900 whitespace-nowrap">
                              {formatarMoeda(precos.comboAlchymistBlue2Pax)}
                            </span>
                          </div>

                          {/* INDIVIDUAIS */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {[
                              { id: 'buracoAzul', nome: 'Buraco Azul (2 pax)', preco: precos.buracoAzul2Pax, desc: 'R$ 50/pax' },
                              { id: 'lagunBeach', nome: 'Lagun Beach / Lagoa Azul (2 pax)', preco: precos.lagunBeach2Pax, desc: 'R$ 50/pax' },
                              { id: 'carauba', nome: 'Caraúba Beach (2 pax)', preco: precos.carauba2Pax, desc: 'R$ 40/pax' },
                              { id: 'alchymist', nome: 'Alchymist Individual (2 pax)', preco: precos.alchymist2Pax, desc: 'R$ 70/pax' },
                              { id: 'blueLagoon', nome: 'Blue Lagoon Individual (2 pax)', preco: precos.blueLagoon2Pax, desc: 'R$ 80/pax' },
                            ].map((club) => {
                              const ativo = lesteBeachClubs[club.id];
                              return (
                                <label
                                  key={club.id}
                                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                                    ativo ? 'bg-amber-50/40 border-amber-400' : 'bg-stone-50/50 border-stone-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={ativo}
                                      onChange={() => toggleBeachClubLeste(club.id)}
                                      className="w-3.5 h-3.5 accent-stone-900 rounded"
                                    />
                                    <div>
                                      <span className="font-semibold text-stone-800 block">{club.nome}</span>
                                      <span className="text-[10px] text-stone-500">{club.desc}</span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-stone-900">{formatarMoeda(club.preco)}</span>
                                </label>
                              );
                            })}
                          </div>

                          {/* ÁREA VIP SOB CONSULTA */}
                          <label className="flex items-center justify-between p-2.5 rounded-lg border border-dashed border-amber-400 bg-amber-50/30 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={lesteBeachClubs.vipAreaSobConsulta}
                                onChange={() =>
                                  setLesteBeachClubs((prev) => ({
                                    ...prev,
                                    vipAreaSobConsulta: !prev.vipAreaSobConsulta,
                                  }))
                                }
                                className="w-3.5 h-3.5 accent-stone-900 rounded"
                              />
                              <div>
                                <span className="font-bold text-xs text-amber-950 block">
                                  👑 Solicitar Área VIP Exclusiva / Bangalô Privativo
                                </span>
                                <span className="text-[10px] text-stone-600">
                                  Garçom dedicado e melhor localização na lagoa (Sob Consulta com Ítalo)
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                              Sob Consulta
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* 2. LITORAL OESTE */}
            {/* ---------------------------------------------------------------- */}
            <div
              className={`rounded-2xl border transition-all ${
                oesteAtivo
                  ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white/80 border-stone-200'
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={oesteAtivo}
                      onChange={() => setOesteAtivo(!oesteAtivo)}
                      className="w-5 h-5 accent-stone-900 rounded cursor-pointer"
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900">2. Litoral Oeste</h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Travessia de Balsa em Guriú, Mangue Seco, Dunas de Tatajuba, Toboágua e Lagoa Grande.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => abrirDuvidaWhatsApp('Litoral Oeste')}
                      className="text-[11px] text-stone-500 hover:text-amber-800 underline"
                    >
                      💬 Dúvida Oeste?
                    </button>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-extrabold text-stone-900">
                        {formatarMoeda(oesteVeiculo === 'sw4' ? precos.oesteSW4 : precos.oesteUTV)}
                      </span>
                      <span className="block text-[10px] text-stone-500">veículo privativo</span>
                    </div>
                  </div>
                </div>

                {oesteAtivo && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                        📅 Associar Data do Passeio:
                      </label>
                      <select
                        value={oesteData}
                        onChange={(e) => setOesteData(e.target.value)}
                        className="w-full bg-white text-xs sm:text-sm font-semibold text-stone-800 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-stone-900"
                      >
                        {DATAS_DISPONIVEIS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                        🚘 Escolha do Veículo:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOesteVeiculo('sw4')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                            oesteVeiculo === 'sw4'
                              ? 'bg-stone-900 text-amber-300 border-amber-400'
                              : 'bg-white text-stone-700 border-stone-300'
                          }`}
                        >
                          Hilux SW4 ({formatarMoeda(precos.oesteSW4)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOesteVeiculo('utv')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                            oesteVeiculo === 'utv'
                              ? 'bg-stone-900 text-amber-300 border-amber-400'
                              : 'bg-white text-stone-700 border-stone-300'
                          }`}
                        >
                          UTV Can-Am ({formatarMoeda(precos.oesteUTV)})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* 3. PASSEIO BARRINHA (COM BASE NÁUTICA) */}
            {/* ---------------------------------------------------------------- */}
            <div
              className={`rounded-2xl border transition-all ${
                barrinhaAtivo
                  ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white/80 border-stone-200'
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={barrinhaAtivo}
                      onChange={() => setBarrinhaAtivo(!barrinhaAtivo)}
                      className="w-5 h-5 accent-stone-900 rounded cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-stone-900">
                          3. Passeio Barrinha (Com Base Náutica)
                        </h3>
                        <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                          Mar & Náutica
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Dunas de areias brancas, vila de pescadores e os melhores Beach Clubs com saída de Lancha e Jet Ski.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => abrirDuvidaWhatsApp('Passeio Barrinha e Náutica')}
                      className="text-[11px] text-stone-500 hover:text-amber-800 underline"
                    >
                      💬 Dúvida Barrinha?
                    </button>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-extrabold text-stone-900">
                        {formatarMoeda(barrinhaVeiculo === 'sw4' ? precos.barrinhaSW4 : precos.barrinhaUTV)}
                      </span>
                      <span className="block text-[10px] text-stone-500">veículo privativo</span>
                    </div>
                  </div>
                </div>

                {barrinhaAtivo && (
                  <div className="pt-4 space-y-4">
                    {/* DATA E VEÍCULO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                          📅 Associar Data do Passeio:
                        </label>
                        <select
                          value={barrinhaData}
                          onChange={(e) => setBarrinhaData(e.target.value)}
                          className="w-full bg-white text-xs sm:text-sm font-semibold text-stone-800 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-stone-900"
                        >
                          {DATAS_DISPONIVEIS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                          🚘 Escolha do Veículo:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setBarrinhaVeiculo('sw4')}
                            className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                              barrinhaVeiculo === 'sw4'
                                ? 'bg-stone-900 text-amber-300 border-amber-400'
                                : 'bg-white text-stone-700 border-stone-300'
                            }`}
                          >
                            Hilux SW4 ({formatarMoeda(precos.barrinhaSW4)})
                          </button>
                          <button
                            type="button"
                            onClick={() => setBarrinhaVeiculo('utv')}
                            className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                              barrinhaVeiculo === 'utv'
                                ? 'bg-stone-900 text-amber-300 border-amber-400'
                                : 'bg-white text-stone-700 border-stone-300'
                            }`}
                          >
                            UTV Can-Am ({formatarMoeda(precos.barrinhaUTV)})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ESCOLHA DO BEACH CLUB BASE NA BARRINHA */}
                    <div className="p-4 bg-white border border-stone-200 rounded-xl">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-2">
                        Escolha o Beach Club Base na Barrinha:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { nome: 'Munzuá Pier Club', desc: 'Píer exclusivo sobre a água, gastronomia premium e ambiente sofisticado.' },
                          { nome: "Beira D'Água Beach Club", desc: 'Lounge pé na areia rústico chique com embarque náutico direto.' },
                        ].map((club) => {
                          const sel = barrinhaBeachClub === club.nome;
                          return (
                            <div
                              key={club.nome}
                              onClick={() => setBarrinhaBeachClub(club.nome)}
                              className={`cursor-pointer p-3 rounded-xl border transition-all ${
                                sel
                                  ? 'bg-[#121314] text-white border-amber-400 shadow-md'
                                  : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs sm:text-sm">{club.nome}</span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    sel ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-600'
                                  }`}
                                >
                                  {sel ? '✓ Escolhido' : 'Escolher'}
                                </span>
                              </div>
                              <p className={`text-[11px] mt-1 ${sel ? 'text-stone-300' : 'text-stone-500'}`}>
                                {club.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* VIP SOB CONSULTA NA BARRINHA */}
                      <label className="mt-3 flex items-center justify-between p-2.5 rounded-lg border border-dashed border-amber-400 bg-amber-50/30 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={barrinhaVipSobConsulta}
                            onChange={() => setBarrinhaVipSobConsulta(!barrinhaVipSobConsulta)}
                            className="w-3.5 h-3.5 accent-stone-900 rounded"
                          />
                          <div>
                            <span className="font-bold text-xs text-amber-950 block">
                              👑 Solicitar Lounge VIP no {barrinhaBeachClub}
                            </span>
                            <span className="text-[10px] text-stone-600">
                              Reserva de gazebos / bangalôs VIP no clube (Sob Consulta com Ítalo)
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                          Sob Consulta
                        </span>
                      </label>
                    </div>

                    {/* BOTÃO EXPANSÍVEL: ESPORTES NÁUTICOS NA BARRINHA */}
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleAcordeon('barrinhaNautico')}
                        className="w-full p-3.5 bg-stone-100/70 hover:bg-stone-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌊</span>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                              + Adicionar Experiências na Água (Jet Ski, Lancha e Adventure)
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Tabela oficial já calculada para 2 pessoas • Saída direto do Beach Club
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-800 bg-white border border-stone-200 px-3 py-1 rounded-lg">
                          {acordeoes.barrinhaNautico ? '− Fechar' : '+ Ver tabela náutica'}
                        </span>
                      </button>

                      {acordeoes.barrinhaNautico && (
                        <div className="p-4 bg-white border-t border-stone-200 space-y-2">
                          {/* LANCHA PRIVATIVA SOB CONSULTA */}
                          <label className="flex items-center justify-between p-3 rounded-xl border border-dashed border-amber-400 bg-amber-50/50 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={barrinhaNautico.lanchaPrivativaSobConsulta}
                                onChange={() => toggleNauticoBarrinha('lanchaPrivativaSobConsulta')}
                                className="w-4 h-4 accent-stone-900 rounded"
                              />
                              <div>
                                <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                                  🛥️ Lancha Privativa na Barrinha (7 a 8 Lugares)
                                </span>
                                <span className="text-[11px] text-stone-600">
                                  Navegação exclusiva pela orla com paradas para banho e cooler a bordo
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                              Valor Sob Consulta
                            </span>
                          </label>

                          {/* LISTA COMPLETA DOS ESPORTES NÁUTICOS */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            {[
                              { id: 'jetSki12Min', nome: 'Jet Ski — 12 min (2 pax na moto)', preco: precos.nauticoJetSki12Min, desc: 'Passeio dinâmico para 2 na mesma moto' },
                              { id: 'jetSkiSegmar25Min', nome: 'Jet Ski — Segmar Experience 25 min', preco: precos.nauticoJetSkiSegmar25Min, desc: 'Até 2 pax na moto' },
                              { id: 'jetSki1Hora', nome: 'Jet Ski — Aluguel 1 Hora', preco: precos.nauticoJetSki1Hora, desc: 'Compartilhado com guia de apoio' },
                              { id: 'jetSkiIndividual2Pax', nome: 'Jet Ski — Passeio Individual (2 motos)', preco: precos.nauticoJetSkiIndividual2Pax, desc: '1 moto para cada passageiro (R$ 160 cada)' },
                              { id: 'wakeboard2Pax', nome: 'Wakeboard (Surf + Jet Ski • 2 pax)', preco: precos.nauticoWakeboard2Pax, desc: '30 min de sessão para 2 pessoas' },
                              { id: 'esqui2Pax', nome: 'Esqui Aquático (Surf + Jet Ski • 2 pax)', preco: precos.nauticoEsqui2Pax, desc: '30 min de sessão para 2 pessoas' },
                              { id: 'boiaJetDuo', nome: 'Boia Jet Duo Adventure (2 pax)', preco: precos.nauticoBoiaJetDuo, desc: 'Emoção e manobras na água puxadas a jet' },
                              { id: 'bicicletaAquatica', nome: 'Bicicleta Aquática (25 min • até 2 pax)', preco: precos.nauticoBicicletaAquatica, desc: 'Passeio ecológico e relaxante' },
                              { id: 'caiaque2Pax', nome: 'Caiaque (25 min • 2 pessoas)', preco: precos.nauticoCaiaque2Pax, desc: 'R$ 50 por pessoa' },
                              { id: 'sup2Pax', nome: 'Stand Up Paddle (25 min • 2 pessoas)', preco: precos.nauticoSup2Pax, desc: 'R$ 50 por pessoa (2 pranchas)' },
                              { id: 'bananaBoat2Pax', nome: 'Banana Boat (2 pessoas)', preco: precos.nauticoBananaBoat2Pax, desc: 'R$ 50 por pessoa' },
                            ].map((item) => {
                              const ativo = barrinhaNautico[item.id];
                              return (
                                <label
                                  key={item.id}
                                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                                    ativo ? 'bg-amber-50/40 border-amber-400' : 'bg-stone-50/50 border-stone-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={ativo}
                                      onChange={() => toggleNauticoBarrinha(item.id)}
                                      className="w-3.5 h-3.5 accent-stone-900 rounded"
                                    />
                                    <div>
                                      <span className="font-semibold text-stone-800 block">{item.nome}</span>
                                      <span className="text-[10px] text-stone-500">{item.desc}</span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-stone-900">{formatarMoeda(item.preco)}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* 4. PASSEIO OESTE EXTREMO */}
            {/* ---------------------------------------------------------------- */}
            <div
              className={`rounded-2xl border transition-all ${
                oesteExtremoAtivo
                  ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white/80 border-stone-200'
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={oesteExtremoAtivo}
                    onChange={() => setOesteExtremoAtivo(!oesteExtremoAtivo)}
                    className="w-5 h-5 accent-stone-900 rounded cursor-pointer"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">4. Passeio Oeste Extremo</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Expedição estendida até praias desertas e dunas virgens em Hilux SW4 privativa.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => abrirDuvidaWhatsApp('Passeio Oeste Extremo')}
                    className="text-[11px] text-stone-500 hover:text-amber-800 underline"
                  >
                    💬 Dúvida?
                  </button>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-extrabold text-stone-900">
                      {formatarMoeda(precos.oesteExtremoSW4)}
                    </span>
                    <span className="block text-[10px] text-stone-500">veículo privativo</span>
                  </div>
                </div>
              </div>

              {oesteExtremoAtivo && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 max-w-sm">
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      📅 Data do Oeste Extremo:
                    </label>
                    <select
                      value={oesteExtremoData}
                      onChange={(e) => setOesteExtremoData(e.target.value)}
                      className="w-full bg-white text-xs sm:text-sm font-semibold text-stone-800 border border-stone-300 rounded-lg p-2 focus:outline-none"
                    >
                      {DATAS_DISPONIVEIS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* 5. PASSEIO PÔR DO SOL NAS DUNAS DO AMÂNCIO */}
            {/* ---------------------------------------------------------------- */}
            <div
              className={`rounded-2xl border transition-all ${
                porDoSolAtivo
                  ? 'bg-white border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white/80 border-stone-200'
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={porDoSolAtivo}
                    onChange={() => setPorDoSolAtivo(!porDoSolAtivo)}
                    className="w-5 h-5 accent-stone-900 rounded cursor-pointer"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      5. Passeio Pôr do Sol nas Dunas do Amâncio
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Horário especial das 16:30 às 18:00 em veículo privativo nas dunas mais altas de Jeri.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => abrirDuvidaWhatsApp('Pôr do Sol nas Dunas do Amâncio')}
                    className="text-[11px] text-stone-500 hover:text-amber-800 underline"
                  >
                    💬 Dúvida?
                  </button>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-extrabold text-stone-900">
                      {formatarMoeda(precos.porDoSolSW4)}
                    </span>
                    <span className="block text-[10px] text-stone-500">veículo privativo</span>
                  </div>
                </div>
              </div>

              {porDoSolAtivo && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 max-w-sm">
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      📅 Data do Pôr do Sol:
                    </label>
                    <select
                      value={porDoSolData}
                      onChange={(e) => setPorDoSolData(e.target.value)}
                      className="w-full bg-white text-xs sm:text-sm font-semibold text-stone-800 border border-stone-300 rounded-lg p-2 focus:outline-none"
                    >
                      {DATAS_DISPONIVEIS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 3: EXPERIÊNCIAS EXCLUSIVAS (HELICÓPTERO & GASTRONOMIA) */}
        {/* ==================================================================== */}
        {abaAtiva === 'experiencias' && (
          <div className="mt-5 space-y-4">
            {/* 1. CARD PRINCIPAL DOS 11 VOOS DE HELICÓPTERO */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚁</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-stone-900">
                        Voos Panorâmicos de Helicóptero (@JericoacoaraPremium)
                      </h3>
                      <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        11 Roteiros Oficiais
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Voe pelas lagoas, cânions de areia e lençóis cearenses com a maior operadora de Jeri.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => abrirDuvidaWhatsApp('Voos de Helicóptero')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200/80 transition-colors"
                  >
                    <span>💬</span>
                    <span>Dúvida Helicóptero?</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAcordeon('heliTabela')}
                    className="text-xs font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    {acordeoes.heliTabela ? '− Fechar Tabela de Voos' : '+ Abrir Tabela dos 11 Roteiros'}
                  </button>
                </div>
              </div>

              {/* TABELA COMPLETA COM OS 11 ROTEIROS EXPANSÍVEL */}
              {acordeoes.heliTabela ? (
                <div className="p-4 sm:p-5 bg-stone-50/60 space-y-3">
                  <p className="text-xs text-stone-600 font-medium">
                    Selecione um dos 11 roteiros para somar automaticamente ao seu orçamento:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listaVoosHelicoptero.map((voo) => {
                      const sel = heliRoteiroSelecionado === voo.id;
                      const valorAtual = precos[voo.precoKey];
                      return (
                        <div
                          key={voo.id}
                          onClick={() => setHeliRoteiroSelecionado(sel ? null : voo.id)}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                            sel
                              ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/30'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                {voo.tag} • {voo.duracao}
                              </span>
                              <span className="text-base font-extrabold text-stone-900">
                                {formatarMoeda(valorAtual)}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-stone-900">{voo.titulo}</h4>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{voo.roteiro}</p>
                            <span className="inline-block text-[10px] text-stone-500 mt-1 font-semibold">
                              Formato: {voo.tipo}
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-800">
                              {sel ? '✓ Voo Selecionado' : '+ Selecionar este Roteiro'}
                            </span>
                            {sel && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHeliRoteiroSelecionado(null);
                                }}
                                className="text-[11px] text-stone-400 hover:text-red-600 underline"
                              >
                                Remover
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50/50 flex items-center justify-between text-xs text-stone-600">
                  <span>
                    {heliRoteiroSelecionado
                      ? `✓ Roteiro selecionado: ${listaVoosHelicoptero.find((v) => v.id === heliRoteiroSelecionado)?.titulo} (${formatarMoeda(
                          precos[listaVoosHelicoptero.find((v) => v.id === heliRoteiroSelecionado)?.precoKey]
                        )})`
                      : 'Nenhum voo de helicóptero selecionado no momento.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAcordeon('heliTabela')}
                    className="font-bold text-amber-800 underline"
                  >
                    Ver os 11 voos →
                  </button>
                </div>
              )}
            </div>

            {/* 2. CARD DE GASTRONOMIA (SOB CONSULTA) */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍷</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      Reserva em Jantares e Restaurantes Exclusivos em Jeri
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Mesas VIP reservadas nos melhores spots gastronômicos da vila pelo concierge.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => abrirDuvidaWhatsApp('Gastronomia e Restaurantes')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200/80 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>💬</span>
                  <span>Dúvida Restaurantes?</span>
                </button>
              </div>

              <div className="pt-4 space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-dashed border-amber-400 bg-amber-50/40 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={gastronomiaSobConsulta}
                      onChange={() => setGastronomiaSobConsulta(!gastronomiaSobConsulta)}
                      className="w-4 h-4 accent-stone-900 rounded"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        Desejo que o Ítalo cuide das nossas reservas gastronômicas
                      </span>
                      <span className="text-[11px] text-stone-600">
                        Alchymist Bistrô, Restaurante do Essenza, Pescador da Vila ou Jantar Romântico na praia
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg whitespace-nowrap">
                    Sob Consulta
                  </span>
                </label>

                {gastronomiaSobConsulta && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                      Preferências culinárias ou datas especiais (Opcional):
                    </label>
                    <input
                      type="text"
                      value={gastronomiaObs}
                      onChange={(e) => setGastronomiaObs(e.target.value)}
                      placeholder="Ex: Frutos do mar frescos, mesa ao ar livre, carta de vinhos..."
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 4: EXTRAS & REVISÃO FINAL */}
        {/* ==================================================================== */}
        {abaAtiva === 'extras' && (
          <div className="mt-5 space-y-5">
            {/* EXTRAS SUGERIDOS */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>Experiências Extras & Mídia:</span>
                <button
                  type="button"
                  onClick={() => abrirDuvidaWhatsApp('Serviço de Drone e Fotógrafo')}
                  className="text-xs text-amber-800 underline"
                >
                  💬 Dúvida Drone?
                </button>
              </h3>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  droneAtivo ? 'bg-amber-50/50 border-amber-500 shadow-sm' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={droneAtivo}
                    onChange={() => setDroneAtivo(!droneAtivo)}
                    className="w-4 h-4 accent-stone-900 rounded"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      📸 Cobertura com Drone & Fotógrafo Privativo
                    </span>
                    <span className="text-[11px] text-stone-600">
                      Profissional acompanhando os viajantes com captação 4K nas dunas e lagoas
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm sm:text-base text-stone-900">
                  {formatarMoeda(precos.droneFotografo)}
                </span>
              </label>
            </div>

            {/* ADICIONAR PEDIDOS ESPECIAIS LIVRES */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Pedidos Especiais & Personalização Sob Medida:
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Acrescente qualquer solicitação para o Ítalo (ex: bebidas específicas na SW4, horário diferenciado, bagagens...)
              </p>

              <form onSubmit={adicionarPedidoEspecial} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={novoPedidoInput}
                  onChange={(e) => setNovoPedidoInput(e.target.value)}
                  placeholder="Ex: Espumante Brut no cooler da SW4, parada rápida em Jijoca..."
                  className="flex-1 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                />
                <button
                  type="submit"
                  className="bg-[#121314] text-amber-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors whitespace-nowrap"
                >
                  + Adicionar
                </button>
              </form>

              <div className="space-y-2">
                {pedidosEspeciais.map((ped) => (
                  <div
                    key={ped.id}
                    className="flex items-center justify-between gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs"
                  >
                    <span className="text-stone-800 font-medium">✓ {ped.texto}</span>
                    <button
                      type="button"
                      onClick={() => removerPedidoEspecial(ped.id)}
                      className="text-stone-400 hover:text-red-600 px-2 py-0.5"
                      title="Excluir"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUMO COMPLETO DO ROTEIRO COM AS DUAS SEÇÕES */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">
                    Revisão Completa do Roteiro
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">
                    {DADOS_CLIENTE.nome} ({DADOS_CLIENTE.viajantes}) • {DADOS_CLIENTE.hotel}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Total Confirmado:</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-800">
                    {formatarMoeda(resumoCalculado.totalConfirmado)}
                  </span>
                </div>
              </div>

              {/* SEÇÃO 1: CONFIRMADOS COM PREÇO FIXO */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Itens Confirmados com Valores Fixos ({resumoCalculado.confirmados.length}):
                </h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
                  {resumoCalculado.confirmados.length === 0 ? (
                    <div className="p-3 text-xs text-stone-500">Nenhum item fixo marcado ainda.</div>
                  ) : (
                    resumoCalculado.confirmados.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs sm:text-sm">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400 block">
                            {item.categoria}
                          </span>
                          <span className="font-bold text-stone-900">{item.titulo}</span>
                          <span className="text-stone-500 text-xs block">{item.detalhe}</span>
                        </div>
                        <span className="font-bold text-stone-900 whitespace-nowrap ml-3">
                          {formatarMoeda(item.valor)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SEÇÃO 2: ITENS SOB CONSULTA */}
              {resumoCalculado.sobConsulta.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Itens Adicionais Sob Consulta ({resumoCalculado.sobConsulta.length}):
                  </h4>
                  <div className="divide-y divide-stone-100 border border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
                    {resumoCalculado.sobConsulta.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs sm:text-sm">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-amber-800 block">
                            {item.categoria}
                          </span>
                          <span className="font-bold text-stone-900">{item.titulo}</span>
                          <span className="text-stone-600 text-xs block">{item.detalhe}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded whitespace-nowrap ml-3">
                          Sob Consulta
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTÃO FINAL WHATSAPP */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={enviarPlanejamentoWhatsApp}
                  className="w-full bg-[#121314] text-amber-300 font-extrabold py-4 px-6 rounded-2xl text-sm sm:text-base shadow-xl hover:bg-stone-900 transition-all flex items-center justify-center gap-2 border border-amber-500/40"
                >
                  <span>Enviar Planejamento para o Consultor Ítalo no WhatsApp</span>
                  <span>→</span>
                </button>
                <p className="text-center text-[11px] text-stone-500 mt-2">
                  Abre uma conversa direta no WhatsApp ({WHATSAPP_ITALO}) com todo o roteiro discriminado.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MODAL DE RESUMO DETALHADO (QUANDO O CLIENTE CLICA NO RODAPÉ) */}
      {/* ==================================================================== */}
      {modalResumoAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">
                  Resumo do Planejamento
                </span>
                <h2 className="text-lg font-bold text-stone-900">
                  {DADOS_CLIENTE.nome} ({DADOS_CLIENTE.viajantes})
                </h2>
              </div>
              <button
                onClick={() => setModalResumoAberto(false)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold px-2 py-1"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="bg-stone-100 p-3 rounded-xl flex justify-between text-stone-700">
                <span>Hospedagem & Período:</span>
                <strong className="text-stone-900 text-right">
                  {DADOS_CLIENTE.hotel} • {DADOS_CLIENTE.periodo}
                </strong>
              </div>

              <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 max-h-60 overflow-y-auto">
                {resumoCalculado.confirmados.map((c, i) => (
                  <div key={i} className="p-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-stone-900 block">{c.titulo}</span>
                      <span className="text-[11px] text-stone-500">{c.categoria}</span>
                    </div>
                    <span className="font-bold text-stone-900 whitespace-nowrap ml-2">
                      {formatarMoeda(c.valor)}
                    </span>
                  </div>
                ))}
                {resumoCalculado.sobConsulta.map((s, i) => (
                  <div key={i} className="p-2.5 flex justify-between items-center bg-amber-50/40">
                    <div>
                      <span className="font-semibold text-stone-900 block">{s.titulo}</span>
                      <span className="text-[11px] text-amber-800">{s.categoria}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                      Sob Consulta
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-base">
                <span className="font-bold text-stone-700">Total Confirmado:</span>
                <span className="text-xl font-black text-amber-900">
                  {formatarMoeda(resumoCalculado.totalConfirmado)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setModalResumoAberto(false);
                enviarPlanejamentoWhatsApp();
              }}
              className="w-full bg-[#121314] text-amber-300 font-extrabold py-3.5 rounded-2xl text-sm shadow-lg hover:bg-stone-900 transition-all flex items-center justify-center gap-2"
            >
              <span>Confirmar & Enviar para Ítalo no WhatsApp</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* BARRA FIXA FLUTUANTE NO RODAPÉ — SOMA EM TEMPO REAL & CTA WHATSAPP */}
      {/* ==================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#121314]/95 backdrop-blur-md text-white border-t border-amber-500/30 px-4 py-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div onClick={() => setModalResumoAberto(true)} className="cursor-pointer group">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-400">Total Confirmado:</span>
              <span className="text-[11px] text-amber-400 underline group-hover:text-amber-300">
                Ver resumo ({resumoCalculado.totalItens} itens)
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-2xl font-black text-amber-300 tracking-tight">
                {formatarMoeda(resumoCalculado.totalConfirmado)}
              </span>
              {resumoCalculado.sobConsulta.length > 0 && (
                <span className="text-[10px] text-stone-400">
                  + {resumoCalculado.sobConsulta.length} sob consulta
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalResumoAberto(true)}
              className="hidden sm:inline-flex bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs px-3.5 py-3 rounded-xl border border-stone-600 transition-all"
            >
              Ver Detalhes
            </button>
            <button
              type="button"
              onClick={enviarPlanejamentoWhatsApp}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all whitespace-nowrap"
            >
              Finalizar & Enviar p/ Ítalo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
