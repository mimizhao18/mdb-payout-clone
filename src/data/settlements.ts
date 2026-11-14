// Fixed lists the UI needs. The settlements, claims, and forms themselves now
// come from the Supabase database (see src/lib/api.ts), not from this file.

export const CATEGORIES = ['All', 'Upcoming', 'Privacy', 'False Ads', 'Overbilling'] as const;

export const FORM_STATUSES = ['Pending', 'Payment Sent', 'Case Closed'] as const;

/** Brand ids here must match the `brand` column on settlements. */
export const BRANDS = [
  { id: 'apple', name: 'Apple', color: '#111827', letter: '' },
  { id: 'spotify', name: 'Spotify', color: '#16A34A', letter: 'S' },
  { id: 'pepsi', name: 'Pepsi', color: '#1D4ED8', letter: 'P' },
  { id: 'instagram', name: 'Instagram', color: '#C026D3', letter: 'I' },
  { id: 'fortnite', name: 'Fortnite', color: '#1F2937', letter: 'F' },
  { id: 'google', name: 'Google', color: '#EA4335', letter: 'G' },
  { id: 'meta', name: 'Meta', color: '#2563EB', letter: 'M' },
  { id: 'tesla', name: 'Tesla', color: '#B91C1C', letter: 'T' },
] as const;

/** Must match the values allowed by profiles.payout_method. */
export const PAYOUT_METHODS = ['Credit Card', 'Debit Card', 'Prepaid Card', 'Zelle', 'Venmo'] as const;
