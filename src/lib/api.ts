/**
 * Every call the app makes to the database lives here. Screens import these
 * functions and never write queries themselves, which keeps the "how do we
 * talk to the backend" knowledge in one place.
 *
 * All functions throw on failure so callers can show an error state.
 */
import type { Database } from './database.types';
import { supabase } from './supabase';

type SettlementRow = Database['public']['Tables']['settlements']['Row'];

export type Tag = 'no-proof' | 'uncapped';
export type Category = 'Upcoming' | 'Privacy' | 'False Ads' | 'Overbilling';
export type ClaimStatus = 'notified' | 'in_progress' | 'finished';
export type FormStatus = 'Pending' | 'Payment Sent' | 'Case Closed';

export type Settlement = {
  /** URL-friendly id (the slug). Used in routes like /settlement/<id>. */
  id: string;
  /** The database primary key. Used when saving claims. */
  uuid: string;
  company: string;
  brand: string | null;
  title: string;
  amount: string;
  headline: string;
  dueInDays: number;
  tag?: Tag;
  category: Category;
  summary: string;
  description: string;
  claimUrl: string | null;
  estimatedPayout: number;
  isFeatured: boolean;
  claimsFiled: number;
  claimsTotal: number;
};

export type WalletClaim = {
  id: string;
  amount: string;
  dueInDays: number;
  status: 'in_progress' | 'finished';
};

export type Wallet = {
  estimatedPayout: number;
  claimed: number;
  notified: number;
  claims: WalletClaim[];
};

export type SavedForm = {
  id: string;
  title: string;
  submitted: string;
  status: FormStatus;
};

export type Profile = {
  referralCode: string;
  onboarded: boolean;
  payoutMethod: string | null;
  brands: string[];
};

/** Whole days from today until a YYYY-MM-DD date (never negative). */
function daysUntil(isoDate: string) {
  const due = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((due.getTime() - today.getTime()) / 86_400_000));
}

function toSettlement(row: SettlementRow): Settlement {
  return {
    id: row.slug,
    uuid: row.id,
    company: row.company,
    brand: row.brand,
    title: row.title,
    amount: row.amount_label,
    headline: row.headline,
    dueInDays: daysUntil(row.due_date),
    tag: row.tag === 'no_proof' ? 'no-proof' : row.tag === 'uncapped' ? 'uncapped' : undefined,
    category: row.category as Category,
    summary: row.summary,
    description: row.description,
    claimUrl: row.claim_url,
    estimatedPayout: row.estimated_payout,
    isFeatured: row.is_featured,
    claimsFiled: row.claims_filed,
    claimsTotal: row.claims_total,
  };
}

async function currentUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const id = data.session?.user.id;
  if (!id) throw new Error('You are not signed in yet.');
  return id;
}

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

export async function fetchSettlements(): Promise<Settlement[]> {
  const { data, error } = await supabase
    .from('settlements')
    .select('*')
    .order('estimated_payout', { ascending: false });
  if (error) throw error;
  return data.map(toSettlement);
}

export async function fetchSettlement(slug: string): Promise<Settlement | null> {
  const { data, error } = await supabase.from('settlements').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? toSettlement(data) : null;
}

export async function fetchWallet(): Promise<Wallet> {
  const [summary, claims] = await Promise.all([
    supabase.from('wallet_summary').select('*').maybeSingle(),
    supabase
      .from('claims')
      .select('id, status, settlement:settlements(amount_label, due_date)')
      .in('status', ['in_progress', 'finished'])
      .order('updated_at', { ascending: false }),
  ]);
  if (summary.error) throw summary.error;
  if (claims.error) throw claims.error;

  return {
    estimatedPayout: summary.data?.estimated_payout ?? 0,
    claimed: summary.data?.claimed ?? 0,
    notified: summary.data?.notified ?? 0,
    claims: claims.data.map((c) => ({
      id: c.id,
      amount: c.settlement?.amount_label ?? '',
      dueInDays: c.settlement ? daysUntil(c.settlement.due_date) : 0,
      status: c.status as WalletClaim['status'],
    })),
  };
}

const FORM_LABEL: Record<string, FormStatus> = {
  pending: 'Pending',
  payment_sent: 'Payment Sent',
  case_closed: 'Case Closed',
};

export async function fetchForms(): Promise<SavedForm[]> {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('submitted_on', { ascending: false });
  if (error) throw error;
  return data.map((f) => ({
    id: f.id,
    title: f.title,
    submitted: new Date(`${f.submitted_on}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: FORM_LABEL[f.status] ?? 'Pending',
  }));
}

export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    referralCode: data.referral_code,
    onboarded: data.onboarded_at !== null,
    payoutMethod: data.payout_method,
    brands: data.brands,
  };
}

/** The signed-in user's status for one settlement, or null if they have no claim. */
export async function fetchMyClaimStatus(settlementUuid: string): Promise<ClaimStatus | null> {
  const { data, error } = await supabase
    .from('claims')
    .select('status')
    .eq('settlement_id', settlementUuid)
    .maybeSingle();
  if (error) throw error;
  return (data?.status as ClaimStatus | undefined) ?? null;
}

// ---------------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------------

/**
 * Saves the answers from onboarding, then asks the database to match the
 * user's brands to settlements (those show up as "notified" in the Wallet).
 */
export async function saveOnboarding(input: { brands: string[]; payoutMethod: string | null }) {
  const userId = await currentUserId();
  const { error } = await supabase
    .from('profiles')
    .update({
      brands: input.brands,
      payout_method: input.payoutMethod,
      onboarded_at: new Date().toISOString(),
    })
    .eq('id', userId);
  if (error) throw error;

  const { error: matchError } = await supabase.rpc('sync_my_matches');
  if (matchError) throw matchError;
}

/**
 * Records that the user filed this claim on the official site: it becomes an
 * in-progress claim (Wallet) and a saved form (Forms tab). Safe to call twice.
 */
export async function fileClaim(settlement: Settlement) {
  const userId = await currentUserId();

  const claim = await supabase
    .from('claims')
    .upsert(
      { user_id: userId, settlement_id: settlement.uuid, status: 'in_progress' },
      { onConflict: 'user_id,settlement_id' },
    );
  if (claim.error) throw claim.error;

  const form = await supabase
    .from('forms')
    .upsert(
      { user_id: userId, settlement_id: settlement.uuid, title: settlement.title },
      { onConflict: 'user_id,settlement_id', ignoreDuplicates: true },
    );
  if (form.error) throw form.error;
}
