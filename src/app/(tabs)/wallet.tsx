import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOW_PAYOUTS_WORK, InfoModal } from '@/components/mode/info-modal';
import { BrandBadge, ModeLogo } from '@/components/mode/primitives';
import { Brand } from '@/constants/theme';
import { WALLET_CLAIMS, WALLET_SUMMARY, type WalletClaim } from '@/data/settlements';

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
    <View style={styles.claim}>
      <BrandBadge letter="G" color="#EA4335" size={36} />
      <View style={{ flex: 1 }}>
        <Text style={styles.claimAmount}>{claim.amount}</Text>
        <Text style={styles.claimDue}>Due in {claim.dueInDays} days</Text>
      </View>
      <Text style={styles.claimed}>Claimed ✓</Text>
    </View>
  );
}

export default function Wallet() {
  const insets = useSafeAreaInsets();
  const [infoOpen, setInfoOpen] = useState(false);
  const inProgress = WALLET_CLAIMS.filter((c) => c.status === 'in-progress');
  const finished = WALLET_CLAIMS.filter((c) => c.status === 'finished');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <ModeLogo size={26} />
        </View>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Estimated Payout</Text>
            <Pressable accessibilityLabel="How estimated payouts work" onPress={() => setInfoOpen(true)}>
              <Text style={styles.info}>ⓘ</Text>
            </Pressable>
          </View>
          <Text style={styles.payout}>${WALLET_SUMMARY.estimatedPayout}</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.statLabel}># Claimed</Text>
              <Text style={styles.statValue}>{WALLET_SUMMARY.claimed}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statLabel}>Notified</Text>
              <Text style={styles.statValue}>{WALLET_SUMMARY.notified}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.section}>IN-PROGRESS</Text>
        {inProgress.length === 0 ? (
          <EmptyState title="No active claims" body="Claims you’ve submitted will appear here" />
        ) : (
          inProgress.map((c) => <ClaimRow key={c.id} claim={c} />)
        )}

        <Text style={styles.section}>FINISHED</Text>
        {finished.length === 0 ? (
          <EmptyState title="No completed claims" body="Finished claims will appear here" />
        ) : (
          finished.map((c) => <ClaimRow key={c.id} claim={c} />)
        )}
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
  screen: { flex: 1, backgroundColor: Brand.white },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  headerLogo: { position: 'absolute', left: 16 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Brand.ink },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  card: { backgroundColor: Brand.purpleCard, borderRadius: 14, padding: 16, gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: Brand.white, fontSize: 17, fontWeight: '500' },
  info: { color: Brand.white, fontSize: 18 },
  payout: { color: Brand.white, fontSize: 36, fontWeight: '800' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statLabel: { color: '#E5D8FB', fontSize: 12 },
  statValue: { color: Brand.white, fontSize: 18, fontWeight: '700' },
  section: { fontSize: 12, fontWeight: '700', color: Brand.muted, marginTop: 12, letterSpacing: 0.5 },
  empty: { alignItems: 'center', gap: 4, paddingVertical: 16 },
  emptyIcon: { fontSize: 22, color: Brand.muted },
  emptyTitle: { fontSize: 13, color: Brand.muted, fontWeight: '600' },
  emptyBody: { fontSize: 11, color: Brand.muted },
  claim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Brand.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  claimAmount: { fontSize: 15, fontWeight: '800', color: Brand.ink },
  claimDue: { fontSize: 12, color: Brand.muted },
  claimed: {
    backgroundColor: Brand.green,
    color: Brand.white,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
