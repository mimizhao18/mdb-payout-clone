import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientCard } from '@/components/mode/gradient-card';
import { HOW_PAYOUTS_WORK, InfoModal } from '@/components/mode/info-modal';
import { AppBar, Thumb } from '@/components/mode/primitives';
import { ErrorState, LoadingState } from '@/components/mode/remote-state';
import { Brand, Shadow } from '@/constants/theme';
import { useRemote } from '@/hooks/use-remote';
import { fetchWallet, type WalletClaim } from '@/lib/api';

const GOOGLE = require('@/assets/images/mode/google.png');

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>◷</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

function ClaimRow({ claim }: { claim: WalletClaim }) {
  return (
    <View style={[styles.claim, Shadow.card]}>
      <Thumb source={GOOGLE} size={48} radius={8} />
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.claimAmount}>{claim.amount}</Text>
        <Text style={styles.claimDue}>Due in {claim.dueInDays} days</Text>
      </View>
      <View style={styles.claimed}>
        <Text style={styles.claimedLabel}>Claimed</Text>
        <Text style={styles.claimedCheck}>✓</Text>
      </View>
    </View>
  );
}

export default function Wallet() {
  const insets = useSafeAreaInsets();
  const [infoOpen, setInfoOpen] = useState(false);
  const { data, error, loading, reload } = useRemote(fetchWallet);

  if (!data) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <AppBar title="Wallet" />
        {loading || !error ? <LoadingState /> : <ErrorState message={error} onRetry={reload} />}
      </View>
    );
  }

  const inProgress = data.claims.filter((c) => c.status === 'in_progress');
  const finished = data.claims.filter((c) => c.status === 'finished');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <AppBar title="Wallet" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <GradientCard tilt={0.12} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Estimated Payout</Text>
            <Pressable
              accessibilityLabel="How estimated payouts work"
              accessibilityRole="button"
              onPress={() => setInfoOpen(true)}
              style={styles.infoButton}>
              <Text style={styles.infoGlyph}>?</Text>
            </Pressable>
          </View>
          <Text style={styles.payout}>${Math.round(data.estimatedPayout).toLocaleString('en-US')}</Text>
          <View style={styles.cardBottom}>
            <View style={{ gap: 9 }}>
              <Text style={styles.statLabel}># Claimed</Text>
              <Text style={styles.statValue}>{data.claimed}</Text>
            </View>
            <View style={{ gap: 10 }}>
              <Text style={styles.statLabel}>Notified</Text>
              <Text style={styles.statValue}>{data.notified}</Text>
            </View>
          </View>
        </GradientCard>

        <View style={styles.group}>
          <Text style={styles.section}>IN-PROGRESS</Text>
          {inProgress.length === 0 ? (
            <EmptyState title="No active claims" body="Claims you’ve submitted will appear here" />
          ) : (
            <View style={styles.rows}>
              {inProgress.map((c) => (
                <ClaimRow key={c.id} claim={c} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.group}>
          <Text style={styles.section}>FINISHED</Text>
          {finished.length === 0 ? (
            <EmptyState title="No completed claims" body="Finished claims will appear here" />
          ) : (
            <View style={styles.rows}>
              {finished.map((c) => (
                <ClaimRow key={c.id} claim={c} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <InfoModal
        visible={infoOpen}
        title={HOW_PAYOUTS_WORK.title}
        paragraphs={HOW_PAYOUTS_WORK.paragraphs}
        onClose={() => setInfoOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surface },
  content: { paddingHorizontal: 21, paddingTop: 25, paddingBottom: 32, gap: 20 },
  card: { minHeight: 217, paddingHorizontal: 29, paddingTop: 25, paddingBottom: 24, gap: 24 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { color: Brand.white, fontSize: 24, lineHeight: 32 },
  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGlyph: { color: Brand.white, fontSize: 14, fontWeight: '700' },
  payout: { color: Brand.white, fontSize: 24, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: 'rgba(255,255,255,0.72)', fontSize: 16, letterSpacing: 0.25 },
  statValue: { color: Brand.white, fontSize: 24, fontWeight: '700', letterSpacing: 0.25 },
  group: { gap: 15 },
  section: { fontSize: 20, fontWeight: '700', color: Brand.heading, lineHeight: 28 },
  rows: { gap: 17 },
  empty: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  emptyIcon: { fontSize: 22, color: Brand.muted },
  emptyTitle: { fontSize: 13, color: Brand.muted, fontWeight: '600' },
  emptyBody: { fontSize: 11, color: Brand.muted },
  claim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Brand.white,
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 16,
  },
  claimAmount: { fontSize: 20, fontWeight: '700', letterSpacing: 0.15, color: Brand.ink },
  claimDue: { fontSize: 15, color: Brand.muted },
  claimed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: Brand.claimed,
    borderRadius: 5,
    height: 36,
    width: 112,
  },
  claimedLabel: { color: Brand.white, fontSize: 15, fontWeight: '600' },
  claimedCheck: { color: Brand.white, fontSize: 16, fontWeight: '700' },
});
