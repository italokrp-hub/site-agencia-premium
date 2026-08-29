import { supabase } from '@/lib/supabase';
import { sendBookingToHotelOps } from './hotelopsIntegration';

/**
 * Registra a reserva e o cliente no ERP Supabase de forma segura e não destrutiva.
 * 
 * @param {Object} formData - Dados preenchidos no formulário (name, whatsapp, email, date, pickup, passengers, etc)
 * @param {Object} itemData - Dados do item reservado (title, category, etc)
 * @param {Object} paymentInfo - Informações financeiras (fullTotal, chargeTotal, paymentMode, paymentMethod, vehicle, etc)
 * @returns {Promise<{ customerId: string|null, reservationId: string|null }>}
 */
export async function registerBookingToERP(formData, itemData, paymentInfo = {}) {
  // Sincronização não-bloqueante com o CRM central HotelOps
  sendBookingToHotelOps(formData, itemData, paymentInfo).catch((err) => {
    console.error('HotelOps Integration - Erro não bloqueante ao disparar do ERP wrapper:', err);
  });
  try {
    if (!formData || !formData.name) {
      console.warn('registerBookingToERP: Dados do formulário incompletos.');
      return { customerId: null, reservationId: null };
    }

    // 1. Tabela agency_customers: Busca por WhatsApp ou Email, ou insere um novo registro
    let customerId = null;

    try {
      if (formData.whatsapp || formData.email) {
        let query = supabase.from('agency_customers').select('id');
        if (formData.whatsapp) {
          query = query.eq('whatsapp', formData.whatsapp);
        } else if (formData.email) {
          query = query.eq('email', formData.email);
        }

        const { data: existingCustomers } = await query;
        if (existingCustomers && existingCustomers.length > 0) {
          customerId = existingCustomers[0].id;
        }
      }

      if (!customerId) {
        const { data: newCustomer, error: createCustError } = await supabase
          .from('agency_customers')
          .insert([
            {
              name: formData.name.trim(),
              whatsapp: formData.whatsapp ? formData.whatsapp.trim() : null,
              phone: formData.whatsapp ? formData.whatsapp.trim() : null,
              email: formData.email ? formData.email.trim() : null,
            },
          ])
          .select('id')
          .single();

        if (createCustError) {
          console.error('ERP Supabase - Erro ao criar cliente:', createCustError);
        } else if (newCustomer) {
          customerId = newCustomer.id;
        }
      }
    } catch (custErr) {
      console.error('ERP Supabase - Falha na etapa do cliente:', custErr);
    }

    // 2. Busca o primeiro property_id se necessário para o relacionamento
    let propertyId = null;
    try {
      const { data: props } = await supabase.from('properties').select('id').limit(1);
      if (props && props.length > 0) {
        propertyId = props[0].id;
      }
    } catch (pErr) {
      // Ignora erro se property_id puder ser nulo
    }

    // Formata datas para o formato YYYY-MM-DD
    const dateFormatted = formData.date
      ? new Date(formData.date).toISOString().split('T')[0]
      : null;

    // 3. Tabela agency_reservations: Insere nova reserva
    let reservationId = null;
    try {
      const reservationPayload = {
        customer_id: customerId || null,
        ...(propertyId ? { property_id: propertyId } : {}),
        date: dateFormatted,
        pax_adults: Number(formData.passengers || 1),
        pickup_location: formData.pickup ? formData.pickup.trim() : null,
        price_gross: paymentInfo.fullTotal || 0,
        price_final: paymentInfo.chargeTotal || paymentInfo.fullTotal || 0,
        payment_method: paymentInfo.paymentMethod || 'Pix',
        payment_status: 'Pendente',
        reservation_status: 'Pendente',
        sale_source: 'Site',
      };

      const { data: newRes, error: resError } = await supabase
        .from('agency_reservations')
        .insert([reservationPayload])
        .select('id')
        .single();

      if (resError) {
        console.error('ERP Supabase - Erro ao criar reserva:', resError);
      } else if (newRes) {
        reservationId = newRes.id;
      }
    } catch (resErr) {
      console.error('ERP Supabase - Falha na etapa da reserva:', resErr);
    }

    // 4. Tabela agency_reservation_items: Insere o item da reserva se a reserva foi criada
    if (reservationId) {
      try {
        const itemPayload = {
          reservation_id: reservationId,
          category: itemData?.category || 'tour',
          service_name: itemData?.title || 'Serviço',
          vehicle_type: paymentInfo.vehicle || formData.selectedVehicleType || null,
          trecho: formData.tripType || null,
          date_start: dateFormatted,
          pax_adults: Number(formData.passengers || 1),
          price_total: paymentInfo.fullTotal || 0,
        };

        const { error: itemError } = await supabase
          .from('agency_reservation_items')
          .insert([itemPayload]);

        if (itemError) {
          console.error('ERP Supabase - Erro ao criar item da reserva:', itemError);
        }
      } catch (itemErr) {
        console.error('ERP Supabase - Falha na etapa do item da reserva:', itemErr);
      }
    }

    return { customerId, reservationId };
  } catch (globalErr) {
    console.error('ERP Supabase - Erro inesperado no fluxo de sincronização:', globalErr);
    return { customerId: null, reservationId: null };
  }
}
