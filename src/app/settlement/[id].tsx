import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillButton, Tag, Thumb } from '@/components/mode/primitives';
import { ErrorState, LoadingState } from '@/components/mode/remote-state';
import { Brand } from '@/constants/theme';
import { useRemote } from '@/hooks/use-remote';
import { confirmAsync, notify } from '@/lib/dialogs';
import {
  fetchMyClaimStatus,
  fetchProfile,
  fetchSettlement,
  fileClaim,
  type Settlement,
} from '@/lib/api';

const GOOGLE = require('@/assets/images/mode/google.png');

export default function SettlementDetails() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [busy, setBusy] = useState(false);

  // One load fetches the settlement, this user's claim on it, and their
  // referral code (used in the share message).
  const load = useCallback(async () => {
    const settlement = await fetchSettlement(id);
    const [claimStatus, profile] = await Promise.all([
      settlement ? fetchMyClaimStatus(settlement.uuid) : Promise.resolve(null),
      fetchProfile(),
    ]);
    return { settlement, claimStatus, referralCode: profile?.referralCode ?? null };
  }, [id]);
  const { data, error, loading, reload } = useRemote(load);

  if (!data) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        {loading || !error ? <LoadingState /> : <ErrorState message={error} onRetry={reload} />}
      </View>
    );
  }

  const { settlement, claimStatus, referralCode } = data;

  if (!settlement) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingText}>That settlement could not be found.</Text>
        <PillButton label="Go back" variant="purple" onPress={() => router.back()} />
      </View>
    );
  }

  const alreadyFiled = claimStatus === 'in_progress' || claimStatus === 'finished';

  const share = () =>
    Share.share({
      message:
        `${settlement.title}: ${settlement.headline}. Found on ModeMobile.` +
        (referralCode ? ` Use my code ${referralCode}.` : ''),
    });

  /**
   * The app never files a claim for the user. We open the official claim site,
   * then ask whether they filed. Only if they say yes do we save it.
   */
  async function start(s: Settlement) {
    if (alreadyFiled) {
      router.replace('/forms');
      return;
    }
    setBusy(true);
    try {
      let message =
        'ModeMobile doesn’t file claims for you. If you finished the claim on the official site, we’ll save it to your Wallet and Forms.';
      if (s.claimUrl) {
        await WebBrowser.openBrowserAsync(s.claimUrl);
      } else {
        message =
          'This settlement doesn’t have an official claim link in the app yet. Save it to your Wallet and Forms anyway?';
      }
      const filed = await confirmAsync('Did you submit your claim?', message, 'Yes, save it', 'Not yet');
      if (!filed) return;
      await fileClaim(s);
      router.replace('/forms');
    } catch (e) {
      notify('Couldn’t save your claim', e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settlement Details</Text>
        <Text style={styles.infoPill}>Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Thumb source={GOOGLE} size={67} radius={8} />
          <Text style={styles.headline}>{settlement.headline}</Text>
          <Text style={styles.company}>{settlement.company}</Text>
        </View>

        <View style={styles.divider} />

        {settlement.tag ? (
          <View style={{ alignSelf: 'flex-start' }}>
            <Tag kind={settlement.tag} large />
          </View>
        ) : null}

        <View style={{ gap: 10 }}>
          <Text style={styles.title}>{settlement.title}</Text>
          <Text style={styles.copy}>{settlement.summary}</Text>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Deadline to claim</Text>
          <View style={styles.deadline}>
            <Text style={styles.calendar}>▦</Text>
            <Text style={styles.copy}>Due in {settlement.dueInDays} days</Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.copy}>{settlement.description}</Text>
        </View>

        <Text style={styles.disclaimer}>
          ModeMobile is not a law firm and does not file claims on your behalf. Payments are made by
          the official settlement administrator and aren’t guaranteed.
        </Text>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={share}
          style={({ pressed }) => [styles.action, styles.share, { opacity: pressed ? 0.85 : 1 }]}>
          <Text style={styles.shareLabel}>Tell your friends</Text>
          <Text style={styles.shareIcon}>➤</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => start(settlement)}
          style={({ pressed }) => [
            styles.action,
            styles.start,
            { opacity: busy ? 0.6 : pressed ? 0.85 : 1 },
          ]}>
          <Text style={styles.startLabel}>{alreadyFiled ? 'View in Forms' : 'Get Started'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FEFFFF' },
  missing: { alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  missingText: { fontSize: 15, color: Brand.muted },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 70 },
  backChevron: { color: Brand.link, fontSize: 34, marginTop: -4 },
  backLabel: { color: Brand.link, fontSize: 18, fontWeight: '500' },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.15, color: Brand.ink },
  infoPill: {
    minWidth: 52,
    textAlign: 'center',
    color: Brand.link,
    backgroundColor: Brand.pillGrey,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  content: { paddingHorizontal: 22, paddingTop: 40, paddingBottom: 40, gap: 25 },
  hero: { alignItems: 'center', gap: 28 },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 0.72,
    color: Brand.ink,
    textAlign: 'center',
  },
  company: { fontSize: 14, letterSpacing: 0.28, color: '#6A757E', marginTop: -10 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Brand.border },
  title: { fontSize: 22, fontWeight: '600', lineHeight: 30, color: Brand.ink },
  copy: { fontSize: 18, lineHeight: 28, letterSpacing: -0.36, color: Brand.mutedLight },
  label: { fontSize: 20, fontWeight: '600', lineHeight: 30, color: Brand.ink },
  deadline: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  calendar: { fontSize: 22, color: Brand.mutedLight },
  disclaimer: { fontSize: 12, lineHeight: 17, color: Brand.mutedLight },
  actions: {
    backgroundColor: Brand.white,
    paddingHorizontal: 25,
    paddingTop: 22,
    gap: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: -2 },
    elevation: 12,
  },
  action: {
    borderRadius: 15,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  share: { backgroundColor: Brand.buttonGrey },
  shareLabel: { fontSize: 18, fontWeight: '600', color: Brand.ink },
  shareIcon: { fontSize: 14, color: Brand.ink },
  start: { backgroundColor: Brand.purple },
  startLabel: { fontSize: 19, fontWeight: '600', color: Brand.white },
});
