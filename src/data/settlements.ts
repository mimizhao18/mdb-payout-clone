export type SettlementTag = 'no-proof' | 'uncapped';
export type SettlementCategory = 'Upcoming' | 'Privacy' | 'False Ads' | 'Overbilling';

export type Settlement = {
  id: string;
  company: string;
  title: string;
  /** Short amount label shown on list rows, e.g. "$3000+". */
  amount: string;
  /** Headline shown on the details screen, e.g. "claim at least $3,000". */
  headline: string;
  dueInDays: number;
  tag?: SettlementTag;
  category: SettlementCategory;
  color: string;
  letter: string;
  summary: string;
  description: string;
};

export const FEATURED: Settlement & { claimsFiled: number; claimsTotal: number } = {
  id: 'featured-tyson',
  company: 'Tyson Foods',
  title: 'Tyson Chicken Price-Fixing Settlement',
  amount: '$20-$50',
  headline: 'claim between $20 and $50',
  dueInDays: 5,
  tag: 'no-proof',
  category: 'Upcoming',
  color: '#DC2626',
  letter: 'T',
  summary: 'You may be eligible if you bought Tyson chicken products in the past 6 years.',
  description:
    'A group of grocery shoppers alleged that major poultry producers coordinated prices. Eligible purchasers can claim a flat payment without receipts.',
  claimsFiled: 1274,
  claimsTotal: 12000,
};

export const SETTLEMENTS: Settlement[] = [
  {
    id: 'bartz-anthropic',
    company: 'Stolen Books',
    title: 'Bartz v. Anthropic – Copyright Settlement',
    amount: '$3000+',
    headline: 'claim at least $3,000',
    dueInDays: 28,
    tag: 'no-proof',
    category: 'Upcoming',
    color: '#7F1D1D',
    letter: 'A',
    summary:
      'You may get a cut of a $1500M settlement over pro rata payments from a $1.5b fund for rightsholders of books on the anthropic works list (≈ $3,000/work before costs).',
    description:
      'Authors and publishers whose books were used without permission can file a claim. Payments are split pro rata across all valid claims.',
  },
  {
    id: 'instagram-addiction',
    company: 'Instagram',
    title: 'Instagram Social Media Addiction Arbitration Claims',
    amount: '$1000+',
    headline: 'claim at least $1,000',
    dueInDays: 576,
    tag: 'uncapped',
    category: 'Privacy',
    color: '#C026D3',
    letter: 'I',
    summary:
      'You may get a cut of a $1M settlement over potential arbitration claims for harms from an allegedly addictive design.',
    description:
      'Users who experienced harm tied to heavy platform use may be able to pursue an individual arbitration claim and receive a share of the settlement.',
  },
  {
    id: 'doordash-fees',
    company: 'DoorDash',
    title: 'DoorDash Hidden Fees Settlement',
    amount: '$1000',
    headline: 'claim up to $1,000',
    dueInDays: 576,
    tag: 'uncapped',
    category: 'False Ads',
    color: '#EF4444',
    letter: 'D',
    summary: 'Customers who were charged undisclosed service fees may claim a refund.',
    description:
      'Orders placed in the covered period that included a fee not shown at checkout qualify. No receipt is needed for claims under the cap.',
  },
  {
    id: 'microsoft-ads',
    company: 'Microsoft',
    title: 'Microsoft Advertising Practices Settlement',
    amount: '$500+',
    headline: 'claim at least $500',
    dueInDays: 576,
    tag: 'uncapped',
    category: 'Overbilling',
    color: '#2563EB',
    letter: 'M',
    summary: 'Account holders affected by misleading ad targeting may claim a payment.',
    description:
      'Anyone with an eligible account during the class period can file. Payment amounts depend on the number of valid claims.',
  },
];

/** Second card in the Featured carousel (the Figma frame peeks a second card). */
export const FEATURED_2: typeof FEATURED = {
  ...FEATURED,
  id: 'featured-doordash',
  company: 'DoorDash',
  title: 'DoorDash Delivery Fee Settlement',
  amount: '$15-$40',
  tag: 'uncapped',
  claimsFiled: 3820,
  claimsTotal: 9000,
};

export const FEATURED_LIST = [FEATURED, FEATURED_2];

export const ALL_SETTLEMENTS: Settlement[] = [FEATURED, FEATURED_2, ...SETTLEMENTS];

export function getSettlement(id: string) {
  return ALL_SETTLEMENTS.find((s) => s.id === id);
}

export const CATEGORIES = ['All', 'Upcoming', 'Privacy', 'False Ads', 'Overbilling'] as const;

export type WalletClaim = {
  id: string;
  amount: string;
  dueInDays: number;
  status: 'in-progress' | 'finished';
};

export const WALLET_CLAIMS: WalletClaim[] = [
  { id: 'w1', amount: '$3000', dueInDays: 49, status: 'in-progress' },
  { id: 'w2', amount: '$3000', dueInDays: 49, status: 'in-progress' },
  { id: 'w3', amount: '$3000', dueInDays: 49, status: 'finished' },
  { id: 'w4', amount: '$3000', dueInDays: 49, status: 'finished' },
];

export const WALLET_SUMMARY = { estimatedPayout: 94, claimed: 3, notified: 2 };

export type FormStatus = 'Pending' | 'Payment Sent' | 'Case Closed';
export const FORM_STATUSES: FormStatus[] = ['Pending', 'Payment Sent', 'Case Closed'];

export type SavedForm = { id: string; title: string; submitted: string; status: FormStatus };

export const SAVED_FORMS: SavedForm[] = [
  { id: 'f1', title: 'Apple Data Breach', submitted: 'Feb 14, 2026', status: 'Pending' },
  { id: 'f2', title: 'Facebook Retail', submitted: 'Jan 12, 2025', status: 'Payment Sent' },
  { id: 'f3', title: 'Tesla Emissions', submitted: 'Jan 12, 2025', status: 'Case Closed' },
];

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

export const PAYOUT_METHODS = ['Credit Card', 'Debit Card', 'Prepaid Card', 'Zelle', 'Venmo'] as const;
