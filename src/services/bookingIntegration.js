import { sendBookingToHotelOps } from './hotelopsIntegration';

/**
 * Registra a reserva enviando para o CRM HotelOps (/api/booking-public).
 * As chamadas diretas legadas ao Supabase anon client foram desativadas para evitar erros de RLS/schema no browser.
 * 
 * @param {Object} formData - Dados preenchidos no formulário
 * @param {Object} itemData - Dados do item reservado
 * @param {Object} paymentInfo - Informações financeiras
 * @returns {Promise<{ success: boolean }>}
 */
export async function registerBookingToERP(formData, itemData, paymentInfo = {}) {
  try {
    return await sendBookingToHotelOps(formData, itemData, paymentInfo);
  } catch (err) {
    console.error('Erro na sincronização de reserva:', err);
    return { success: false };
  }
}
