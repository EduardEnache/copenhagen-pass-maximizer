export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export const PACKING_CHECKLIST: Checklist = {
  id: 'packing',
  title: 'Packing & prep',
  items: [
    { id: 'packing-passport', label: 'Passport / ID' },
    { id: 'packing-boarding-pass', label: 'Boarding pass (outbound + return)' },
    { id: 'packing-payment-card', label: 'Payment card' },
    { id: 'packing-travel-insurance', label: 'Travel insurance documents' },
    { id: 'packing-cph-card-app', label: 'Copenhagen Card — app installed / voucher saved' },
    { id: 'packing-offline-maps', label: 'Offline maps downloaded (Copenhagen + North Zealand)' },
    { id: 'packing-power-bank', label: 'Power bank' },
    {
      id: 'packing-eu-plug',
      label: 'EU plug adapter — NOT needed',
      detail: 'Denmark uses EU-standard Type C/E/F sockets (230V), same as Romania — Romanian travellers need no adapter.',
    },
    { id: 'packing-weather-layer', label: 'Weather layer (light rain jacket / warm layer for late Sept)' },
    { id: 'packing-hotel-luggage-confirmation', label: 'Confirm CityHub after-checkout luggage policy with the hotel' },
    { id: 'packing-reservation-checks', label: 'Re-check any attraction reservations (Rosenborg timed entry above all)' },
  ],
};

export const BOOKING_CHECKLIST: Checklist = {
  id: 'booking',
  title: 'Booking checklist',
  items: [
    {
      id: 'booking-rosenborg-timeslot',
      label: 'Book Rosenborg Castle timed-entry slot online',
      detail: 'Official site states all time slots sell out — book before travel, not on arrival.',
    },
    {
      id: 'booking-card-activation-steps',
      label: 'Know the Copenhagen Card activation steps before landing',
      detail: 'Activation is irreversible; activate at the airport just before the first Metro ride.',
    },
    { id: 'booking-airport-transport-plan', label: 'Confirm airport transport plan (Metro M2 from Lufthavnen)' },
    { id: 'booking-airline-checkin', label: 'Complete airline online check-in for the return flight' },
  ],
};

export const AIRPORT_READINESS_CHECKLIST: Checklist = {
  id: 'airport-readiness',
  title: 'Airport readiness (departure day)',
  items: [
    { id: 'airport-luggage-collected', label: 'Luggage collected from CityHub before leaving the city' },
    { id: 'airport-leave-time', label: 'Leave the city no later than the configured leave-for-airport time' },
    { id: 'airport-buffer-check', label: 'Confirm at least 2h buffer between airport arrival and boarding' },
    { id: 'airport-card-expiry-check', label: 'Confirm the Copenhagen Card is still valid for the airport Metro ride (expiry is EXCLUSIVE)' },
    { id: 'airport-checkin-done', label: 'Online check-in completed / boarding passes ready' },
  ],
};

export const ALL_CHECKLISTS: Checklist[] = [PACKING_CHECKLIST, BOOKING_CHECKLIST, AIRPORT_READINESS_CHECKLIST];
