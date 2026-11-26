import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBRL,
  calculatePassengerSummary,
  buildVoucherEmailContent,
} from '../api/send-voucher-email.js';

function createSamplePackageBooking(overrides = {}) {
  return {
    id: 'res-jp-2027-000001',
    reservation_code: 'JP-2027-000001',
    date: '2027-01-10',
    time: '09:00',
    pax_adults: 2,
    pax_children: 2,
    price_final: 2070,
    amount_paid: 1035,
    payment_method: 'pix',
    payment_status: 'sinal_pago',
    reservation_status: 'confirmada',
    agency_customers: {
      id: 'cust-1',
      name: 'Carlos Eduardo',
      email: 'carlos@cliente.com',
    },
    companions: [
      { name: 'Ana Paula', type: 'Adulto' },
      { name: 'Lucas Eduardo', type: 'Criança' },
      { name: 'Sofia Eduardo', type: 'Criança' },
    ],
    agency_reservation_items: [
      {
        service_name: 'Transfer Aeroporto FOR x Jericoacoara',
        category: 'transfer',
        vehicle_type: 'SW4 4x4',
        trecho: 'ida_e_volta',
        date_start: '2027-01-10',
        time_start: '09:00',
        date_end: '2027-01-15',
        time_end: '14:00',
        pickup_location: 'Aeroporto de Fortaleza (FOR)',
        dropoff_location: 'Hotel Essenza Jericoacoara',
        pax_adults: 2,
        pax_children: 2,
        price_total: 1200,
      },
      {
        service_name: 'Passeio Lado Leste',
        category: 'passeio',
        vehicle_type: 'Hilux 4x4',
        trecho: 'privativo',
        date_start: '2027-01-11',
        time_start: '09:30',
        pickup_location: 'Hotel Essenza Jericoacoara',
        pax_adults: 2,
        pax_children: 2,
        price_total: 320,
      },
      {
        service_name: 'Passeio Lado Oeste',
        category: 'passeio',
        vehicle_type: 'Hilux 4x4',
        trecho: 'privativo',
        date_start: '2027-01-12',
        time_start: '09:30',
        pickup_location: 'Hotel Essenza Jericoacoara',
        pax_adults: 2,
        pax_children: 2,
        price_total: 300,
      },
      {
        service_name: 'Passeio Lagoa do Paraíso',
        category: 'passeio',
        vehicle_type: 'Buggy',
        trecho: 'privativo',
        date_start: '2027-01-13',
        time_start: '10:00',
        pickup_location: 'Hotel Essenza Jericoacoara',
        pax_adults: 2,
        pax_children: 2,
        price_total: 250,
      },
    ],
    agency_payments: [
      { amount: 1035, method: 'pix', status: 'approved' },
    ],
    ...overrides,
  };
}

test('formatBRL formats values in pt-BR with thousands separator', () => {
  assert.equal(formatBRL(2070), 'R$ 2.070,00');
  assert.equal(formatBRL(1035), 'R$ 1.035,00');
  assert.equal(formatBRL(550.5), 'R$ 550,50');
  assert.equal(formatBRL(0), 'R$ 0,00');
});

test('calculatePassengerSummary never sums pax across 4 services (uses parent pax_adults + pax_children)', () => {
  const booking = createSamplePackageBooking();
  const summary = calculatePassengerSummary({
    booking,
    items: booking.agency_reservation_items.map((it) => ({ ...it, pax: 4 })),
    companions: booking.companions,
    isEnglish: false,
  });

  assert.equal(summary.totalPax, 4);
  assert.equal(summary.adults, 2);
  assert.equal(summary.children, 2);
  assert.equal(summary.label, '4 pessoas (2 adultos, 2 crianças)');
});

test('calculatePassengerSummary falls back to Math.max across items and 1 + companions.length when parent pax is missing', () => {
  const items = [
    { pax: 4, pax_adults: 2, pax_children: 2 },
    { pax: 4, pax_adults: 2, pax_children: 2 },
    { pax: 4, pax_adults: 2, pax_children: 2 },
    { pax: 4, pax_adults: 2, pax_children: 2 },
  ];

  const fromItems = calculatePassengerSummary({
    booking: { pax_adults: null, pax_children: null },
    items,
    companions: [],
    isEnglish: false,
  });
  assert.equal(fromItems.totalPax, 4);
  assert.equal(fromItems.label, '4 pessoas (2 adultos, 2 crianças)');

  const fromCompanions = calculatePassengerSummary({
    booking: { pax_adults: 0, pax_children: 0 },
    items: [{ pax: 1 }, { pax: 1 }, { pax: 1 }, { pax: 1 }],
    companions: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
    isEnglish: false,
  });
  assert.equal(fromCompanions.totalPax, 4);
  assert.equal(fromCompanions.label, '4 pessoas');

  const withoutSplit = calculatePassengerSummary({
    booking: { pax_adults: 4, pax_children: 0 },
    items,
    companions: [],
    isEnglish: false,
  });
  assert.equal(withoutSplit.totalPax, 4);
  assert.equal(withoutSplit.label, '4 pessoas');
});

test('buildVoucherEmailContent renders JP-2027-000001 package with 4 passengers, full-width sections, compact services, and mobile/dark-mode fixes', () => {
  const booking = createSamplePackageBooking();
  const { htmlContent, plainTextContent, passengerSummary } = buildVoucherEmailContent({
    code: 'JP-2027-000001',
    bookingWithRelations: booking,
    clientGreeting: 'Carlos Eduardo',
    isEnglish: false,
  });

  // 1. Passenger count must be 4, never 16
  assert.equal(passengerSummary.totalPax, 4);
  assert.match(htmlContent, /4 pessoas \(2 adultos, 2 crianças\)/);
  assert.match(plainTextContent, /Passageiros: 4 pessoas \(2 adultos, 2 crianças\)/);
  assert.doesNotMatch(htmlContent, /16 pessoa/);
  assert.doesNotMatch(plainTextContent, /16 pessoa/);

  // 2. Full-width layout (colspan="2") for Holder & Companions and Service(s)
  const colspanMatches = htmlContent.match(/colspan="2"/g) || [];
  assert.equal(colspanMatches.length, 2);
  assert.doesNotMatch(htmlContent, /width:\s*32%/);

  // Short 1-line fields remain 2-column rows
  assert.match(htmlContent, />[\s\n]*Passageiros[\s\n]*<\/td>\s*<td[^>]*>[\s\n]*4 pessoas \(2 adultos, 2 crianças\)/);
  assert.match(htmlContent, />[\s\n]*Valor Total[\s\n]*<\/td>\s*<td[^>]*>[\s\n]*R\$ 2\.070,00/);
  assert.match(htmlContent, />[\s\n]*Valor Pago \(Sinal\)[\s\n]*<\/td>\s*<td[^>]*>[\s\n]*R\$ 1\.035,00/);
  assert.match(htmlContent, />[\s\n]*Saldo no Embarque[\s\n]*<\/td>\s*<td[^>]*>[\s\n]*R\$ 1\.035,00/);

  // 3. Compact services grouped into Transfers & Translados and Passeios & Experiências
  assert.match(htmlContent, /Transfers &amp; Translados/);
  assert.match(htmlContent, /Passeios &amp; Experiências/);
  assert.match(htmlContent, /Ida:<\/span>\s*10\/01\/2027 às 09:00h/);
  assert.match(htmlContent, /Volta:<\/span>\s*15\/01\/2027 às 14:00h/);
  assert.match(htmlContent, /📅 11\/01\/2027 às 09:30h/);
  assert.doesNotMatch(htmlContent, /Embarque: Hotel Essenza/);
  assert.doesNotMatch(htmlContent, /👥/);
  assert.doesNotMatch(plainTextContent, /Embarque: Hotel Essenza/);
  assert.doesNotMatch(plainTextContent, /\| 4 pax\]/);
  assert.match(
    htmlContent,
    /Consulte locais de embarque e orientações completas no seu Voucher Digital abaixo\./
  );
  assert.match(
    plainTextContent,
    /Consulte locais de embarque e orientações completas no seu Voucher Digital abaixo\./
  );

  // 4. Currency formatting, nowrap locator, and dark-mode CTA white text
  assert.match(htmlContent, /R\$ 2\.070,00/);
  assert.doesNotMatch(htmlContent, /R\$ 2070,00/);
  assert.match(plainTextContent, /R\$ 2\.070,00/);
  assert.doesNotMatch(plainTextContent, /R\$ 2070,00/);

  assert.match(
    htmlContent,
    /<p style="[^"]*font-size:\s*21px;[^"]*white-space:\s*nowrap;[^"]*">[\s\n]*JP-2027-000001[\s\n]*<\/p>/
  );

  const ctaMatches = htmlContent.match(/color:\s*#ffffff\s*!important/g) || [];
  assert.ok(ctaMatches.length >= 4, 'Expected !important white text on CTA links and inner spans');
  assert.match(htmlContent, /Acessar Meu Voucher Digital Oficial/);
  assert.match(htmlContent, /Falar com o Concierge no WhatsApp/);
});

test('buildVoucherEmailContent supports English bookings accurately', () => {
  const booking = createSamplePackageBooking();
  const { htmlContent, plainTextContent, passengerSummary } = buildVoucherEmailContent({
    code: 'JP-2027-000001',
    bookingWithRelations: booking,
    clientGreeting: 'John Doe',
    isEnglish: true,
  });

  assert.equal(passengerSummary.label, '4 people (2 adults, 2 children)');
  assert.match(htmlContent, /4 people \(2 adults, 2 children\)/);
  assert.match(plainTextContent, /Passengers: 4 people \(2 adults, 2 children\)/);
  assert.match(
    htmlContent,
    /View full pickup locations and boarding instructions in your Digital Voucher below\./
  );
  assert.match(htmlContent, /Access Official Digital Voucher/);
  assert.match(htmlContent, /Speak with Concierge on WhatsApp/);
});
