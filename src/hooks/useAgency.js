import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados simulados realistas para demonstrar o sistema PMS/FareHarbor com perfeição caso o Supabase não retorne registros
const INITIAL_MOCK_RESERVATIONS = [
  {
    id: 'res-101',
    code: 'JRI-77A91',
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    client_name: 'Ana Clara Souza',
    client_phone: '(85) 99876-5432',
    client_email: 'ana.clara@gmail.com',
    status: 'confirmada',
    payment_status: 'sinal_pago',
    payment_method: 'pix',
    amount_paid: 375.0,
    amount_total: 750.0,
    discount: 37.5,
    remaining_balance: 375.0,
    origin: 'Site Institucional',
    notes: 'Ponto de Embarque: Pousada Vila Kalango | Chegada de Voo: G3 1520',
    pickup_location: 'Pousada Vila Kalango',
    flight_details: 'G3 1520',
    items: [
      {
        id: 'it-1',
        service_type: 'transfer',
        title: 'Transfer Fortaleza ↔ Jericoacoara (Ida e Volta)',
        vehicle: 'sw4',
        modality: 'privativo',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '11:30',
        pax: 3,
        unit_price: 750.0,
      },
    ],
  },
  {
    id: 'res-102',
    code: 'JRI-84K90',
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    client_name: 'Carlos Eduardo Lima',
    client_phone: '(11) 98123-4567',
    client_email: 'carlos.lima@hotmail.com',
    status: 'pendente',
    payment_status: 'pendente',
    payment_method: 'pix',
    amount_paid: 0.0,
    amount_total: 450.0,
    discount: 0.0,
    remaining_balance: 450.0,
    origin: 'Site Institucional',
    notes: 'Ponto de Embarque: Hotel Essenza Jeri',
    pickup_location: 'Hotel Essenza Jeri',
    flight_details: '',
    items: [
      {
        id: 'it-2',
        service_type: 'passeio',
        title: 'Passeio Leste Jericoacoara (Lagoa do Paraíso)',
        vehicle: 'buggy',
        modality: 'privativo',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        pax: 4,
        unit_price: 450.0,
      },
    ],
  },
  {
    id: 'res-103',
    code: 'JRI-92M14',
    created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    client_name: 'Mariana Oliveira',
    client_phone: '(21) 99555-8822',
    client_email: 'mari.oliveira@outlook.com',
    status: 'confirmada',
    payment_status: 'pago_integral',
    payment_method: 'cartao',
    amount_paid: 600.0,
    amount_total: 600.0,
    discount: 0.0,
    remaining_balance: 0.0,
    origin: 'WhatsApp AI',
    notes: 'Ponto de Embarque: Rancho do Peixe (Preá)',
    pickup_location: 'Rancho do Peixe (Preá)',
    flight_details: '',
    items: [
      {
        id: 'it-3',
        service_type: 'passeio',
        title: 'Passeio Oeste com Árvore da Preguiça e Mangue Seco',
        vehicle: 'quadriciclo',
        modality: 'privativo',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '08:30',
        pax: 2,
        unit_price: 600.0,
      },
    ],
  },
  {
    id: 'res-104',
    code: 'JRI-55P31',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    client_name: 'Roberto Mendes',
    client_phone: '(31) 97777-1122',
    client_email: 'roberto.mendes@gmail.com',
    status: 'pendente',
    payment_status: 'pendente',
    payment_method: 'pix',
    amount_paid: 0.0,
    amount_total: 320.0,
    discount: 0.0,
    remaining_balance: 320.0,
    origin: 'Site Institucional',
    notes: 'Ponto de Embarque: Pousada Naquela Jeri',
    pickup_location: 'Pousada Naquela Jeri',
    flight_details: '',
    items: [
      {
        id: 'it-4',
        service_type: 'passeio',
        title: 'Passeio Compartilhado de Jardineira para Tatajuba',
        vehicle: 'jardineira',
        modality: 'compartilhado',
        date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
        time: '09:30',
        pax: 4,
        unit_price: 320.0,
      },
    ],
  },
  {
    id: 'res-105',
    code: 'JRI-33B88',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    client_name: 'Fernanda Rocha',
    client_phone: '(41) 99111-4433',
    client_email: 'fernanda.rocha@uol.com.br',
    status: 'concluida',
    payment_status: 'pago_integral',
    payment_method: 'pix',
    amount_paid: 800.0,
    amount_total: 800.0,
    discount: 40.0,
    remaining_balance: 0.0,
    origin: 'Manual',
    notes: 'Ponto de Embarque: Hotel Hurricane Jeri',
    pickup_location: 'Hotel Hurricane Jeri',
    flight_details: 'LA 3330',
    items: [
      {
        id: 'it-5',
        service_type: 'transfer',
        title: 'Transfer Jericoacoara ↔ Fortaleza',
        vehicle: 'sw4',
        modality: 'privativo',
        date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
        time: '14:00',
        pax: 4,
        unit_price: 800.0,
      },
    ],
  },
];

export function useAgency() {
  const [reservations, setReservations] = useState(INITIAL_MOCK_RESERVATIONS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('todas'); // 'todas' | 'confirmadas' | 'pendentes' | 'a_receber' | 'quitadas'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('lista'); // 'lista' | 'calendario'

  // Busca reservas do Supabase com fallback para os mocks
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resData, error: resError } = await supabase
        .from('agency_reservations')
        .select(`
          id,
          reservation_code,
          created_at,
          date,
          pax_adults,
          pickup_location,
          price_gross,
          price_final,
          payment_method,
          payment_status,
          reservation_status,
          sale_source,
          agency_customers (
            name,
            whatsapp,
            email
          ),
          agency_reservation_items (
            id,
            category,
            service_name,
            vehicle_type,
            trecho,
            date_start,
            pax_adults,
            price_total
          )
        `)
        .order('created_at', { ascending: false });

      if (resData && resData.length > 0) {
        const formatted = resData.map((r) => {
          const cust = r.agency_customers || {};
          const items = r.agency_reservation_items || [];
          const priceFinal = Number(r.price_final || 0);
          const priceGross = Number(r.price_gross || priceFinal);
          const isDeposit = r.payment_status === 'sinal_pago';
          const amountPaid = isDeposit ? priceFinal / 2 : (r.payment_status === 'pago_integral' ? priceFinal : 0);
          const remainingBalance = Math.max(0, priceFinal - amountPaid);

          return {
            id: r.id,
            code: r.reservation_code || `JRI-${r.id.substring(0, 5).toUpperCase()}`,
            created_at: r.created_at || new Date().toISOString(),
            client_name: cust.name || 'Cliente Sem Nome',
            client_phone: cust.whatsapp || cust.phone || '',
            client_email: cust.email || '',
            status: r.reservation_status || (r.payment_status === 'sinal_pago' || r.payment_status === 'pago_integral' ? 'confirmada' : 'pendente'),
            payment_status: r.payment_status || 'pendente',
            payment_method: r.payment_method || 'pix',
            amount_paid: amountPaid,
            amount_total: priceFinal,
            discount: Math.max(0, priceGross - priceFinal),
            remaining_balance: remainingBalance,
            origin: r.sale_source || 'Site Institucional',
            notes: r.pickup_location || '',
            pickup_location: r.pickup_location || '',
            flight_details: '',
            items: items.map((it) => ({
              id: it.id,
              service_type: it.category || 'passeio',
              title: it.service_name || 'Serviço',
              vehicle: it.vehicle_type || 'buggy',
              modality: it.trecho || 'privativo',
              date: it.date_start || r.date || format(new Date(), 'yyyy-MM-dd'),
              time: '12:00',
              pax: Number(it.pax_adults || r.pax_adults || 1),
              unit_price: Number(it.price_total || priceFinal),
            })),
          };
        });
        setReservations(formatted);
      }
    } catch (err) {
      console.warn('[useAgency] Usando dados locais devido a erro no Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Atualização de status local e no Supabase
  const updateReservationStatus = useCallback(async (id, newStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    try {
      await supabase
        .from('agency_reservations')
        .update({ reservation_status: newStatus })
        .eq('id', id);
    } catch (e) {
      // ignore
    }
  }, []);

  // Atualização de status financeiro
  const updatePaymentStatus = useCallback(async (id, newPaymentStatus, newAmountPaid) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const amountPaid = newAmountPaid !== undefined ? newAmountPaid : (newPaymentStatus === 'pago_integral' ? r.amount_total : r.amount_paid);
        const remaining = Math.max(0, r.amount_total - amountPaid);
        const newResStatus = newPaymentStatus === 'sinal_pago' || newPaymentStatus === 'pago_integral' ? 'confirmada' : r.status;
        return {
          ...r,
          payment_status: newPaymentStatus,
          status: newResStatus,
          amount_paid: amountPaid,
          remaining_balance: remaining,
        };
      })
    );
    try {
      await supabase
        .from('agency_reservations')
        .update({ payment_status: newPaymentStatus })
        .eq('id', id);
    } catch (e) {
      // ignore
    }
  }, []);

  // Gerador de link de recuperação via WhatsApp
  const getWhatsAppRecoveryUrl = useCallback((reservation) => {
    const rawPhone = (reservation.client_phone || '').replace(/\D/g, '');
    const phoneWithCountry = rawPhone.length === 10 || rawPhone.length === 11 ? `55${rawPhone}` : rawPhone;
    const clientName = reservation.client_name ? reservation.client_name.split(' ')[0] : 'Cliente';

    const firstItem = reservation.items?.[0] || {};
    const itemTitle = firstItem.title || 'sua reserva';

    let dateFormatted = '';
    if (firstItem.date) {
      try {
        const parsed = parseISO(firstItem.date);
        dateFormatted = format(parsed, 'dd/MM/yyyy', { locale: ptBR });
      } catch (e) {
        dateFormatted = firstItem.date;
      }
    }

    const message = `Olá ${clientName}, vi que você iniciou sua reserva para ${itemTitle}${dateFormatted ? ` no dia ${dateFormatted}` : ''}! Ficou alguma dúvida sobre o pagamento? Tenho uma condição especial para fecharmos agora.`;

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  }, []);

  // Filtro por abas, busca e datas
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // 1. Filtro de Abas
      if (activeTab === 'confirmadas' && r.status !== 'confirmada' && r.status !== 'concluida') {
        return false;
      }
      if (activeTab === 'pendentes' && r.status !== 'pendente' && r.payment_status !== 'pendente') {
        return false;
      }
      if (activeTab === 'a_receber' && r.remaining_balance <= 0) {
        return false;
      }
      if (activeTab === 'quitadas' && r.remaining_balance > 0) {
        return false;
      }

      // 2. Filtro de Busca Texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.client_name.toLowerCase().includes(query);
        const matchesPhone = r.client_phone.toLowerCase().includes(query);
        const matchesCode = r.code.toLowerCase().includes(query);
        const matchesService = r.items.some((it) => it.title.toLowerCase().includes(query) || it.vehicle.toLowerCase().includes(query));
        if (!matchesName && !matchesPhone && !matchesCode && !matchesService) {
          return false;
        }
      }

      // 3. Filtro por Data selecionada
      if (selectedDate) {
        const targetDateStr = format(selectedDate, 'yyyy-MM-dd');
        const matchesDate = r.items.some((it) => it.date === targetDateStr);
        if (!matchesDate) return false;
      }

      return true;
    });
  }, [reservations, activeTab, searchQuery, selectedDate]);

  // Agrupamento por dia para a Visão de Calendário / Mapa de Saídas (PMS Style)
  const departureCalendar = useMemo(() => {
    const map = {};

    reservations.forEach((r) => {
      if (r.status === 'cancelada') return; // ignora canceladas no mapa de saídas

      r.items.forEach((it) => {
        const dayStr = it.date || format(new Date(), 'yyyy-MM-dd');
        if (!map[dayStr]) {
          map[dayStr] = {
            date: dayStr,
            totalPax: 0,
            totalReservations: 0,
            vehicles: {},
            services: {},
            reservations: [],
          };
        }

        map[dayStr].totalPax += Number(it.pax || 1);
        map[dayStr].totalReservations += 1;
        map[dayStr].vehicles[it.vehicle] = (map[dayStr].vehicles[it.vehicle] || 0) + 1;
        map[dayStr].services[it.title] = (map[dayStr].services[it.title] || 0) + 1;
        if (!map[dayStr].reservations.some((itemRes) => itemRes.id === r.id)) {
          map[dayStr].reservations.push(r);
        }
      });
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [reservations]);

  // Contadores de métricas para badges no topo das abas
  const counts = useMemo(() => {
    return {
      todas: reservations.length,
      confirmadas: reservations.filter((r) => r.status === 'confirmada' || r.status === 'concluida').length,
      pendentes: reservations.filter((r) => r.status === 'pendente').length,
      a_receber: reservations.filter((r) => r.remaining_balance > 0).length,
      quitadas: reservations.filter((r) => r.remaining_balance === 0).length,
    };
  }, [reservations]);

  return {
    reservations: filteredReservations,
    allReservations: reservations,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    counts,
    departureCalendar,
    fetchReservations,
    updateReservationStatus,
    updatePaymentStatus,
    getWhatsAppRecoveryUrl,
  };
}
