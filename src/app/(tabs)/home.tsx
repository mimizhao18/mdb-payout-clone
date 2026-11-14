import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientCard } from '@/components/mode/gradient-card';
import { HOW_CLASS_ACTIONS_WORK, InfoModal } from '@/components/mode/info-modal';
import {
  AppBar,
  Chip,
  LegendBadge,
  SmallButton,
  Tag,
  Thumb,
} from '@/components/mode/primitives';
import { ErrorState, LoadingState } from '@/components/mode/remote-state';
import { Brand, Shadow } from '@/constants/theme';
import { CATEGORIES } from '@/data/settlements';
import { useRemote } from '@/hooks/use-remote';
import { fetchSettlements, type Settlement } from '@/lib/api';

const MENU = ['How does this work', 'Privacy Policy', 'Terms of Use', 'Contact Support'] as const;
const MENU_ICON = ['ⓘ', '⛉', '▤', '?'] as const;
const THUMB = require('@/assets/images/mode/thumb.png');

function open(id: string) {
  router.push({ pathname: '/settlement/[id]', params: { id } });
}

function FeaturedCard({ item, width }: { item: Settlement; width: number }) {
  const progress = item.claimsTotal > 0 ? item.claimsFiled / item.claimsTotal : 0;
  return (
    <Pressable onPress={() => open(item.id)} style={[styles.featured, Shadow.card, { width }]}>
      <View style={styles.featuredTop}>
        <Thumb source={THUMB} size={45} />
        <View style={{ flex: 1 }}>
          <View style={styles.amountRow}>
            <Text style={styles.featuredAmount}>{item.amount}</Text>
            {item.tag === 'no-proof' ? (
              <View style={styles.checkCircle}>
                <Text style={styles.checkGlyph}>✓</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.due}>Due in {item.dueInDays} days</Text>
        </View>
        <SmallButton label="Claim" onPress={() => open(item.id)} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 4)}%` }]} />
      </View>
      <Text style={styles.progressLabel}>
        {item.claimsFiled} out of {item.claimsTotal} claims filled 🎉
      </Text>
    </Pressable>
  );
}

function SettlementRow({ item }: { item: Settlement }) {
  return (
    <Pressable onPress={() => open(item.id)} style={[styles.row, Shadow.card]}>
      <Thumb source={THUMB} size={45} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>{item.amount}</Text>
          {item.tag ? <Tag kind={item.tag} /> : null}
        </View>
        <Text style={styles.due}>Due in {item.dueInDays} days</Text>
      </View>
      <SmallButton label="Claim" onPress={() => open(item.id)} />
    </Pressable>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const { data, error, loading, reload } = useRemote(fetchSettlements);

  // The featured cards are nearly full width so the next one peeks in, as in Figma.
  const cardWidth = width - 36 - 16;

  if (!data) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <AppBar title="Settlements" titleSize={17} />
        {loading || !error ? <LoadingState /> : <ErrorState message={error} onRetry={reload} />}
      </View>
    );
  }

  const featured = data.filter((s) => s.isFeatured);
  const rest = data.filter((s) => !s.isFeatured);
  const list = category === 'All' ? rest : rest.filter((s) => s.category === category);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <AppBar
        title="Settlements"
        titleSize={17}
        right={
          <Pressable
            accessibilityLabel="Menu"
            accessibilityRole="button"
            onPress={() => setMenuOpen((v) => !v)}
            style={styles.menuButton}>
            <Text style={styles.menuGlyph}>≡</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionRow}>
          <Text style={styles.section}>Featured</Text>
          <View style={styles.legendRow}>
            <LegendBadge kind="no-proof" />
            <LegendBadge kind="uncapped" />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 16}
          decelerationRate="fast"
          style={styles.carousel}
          contentContainerStyle={styles.carouselContent}>
          {featured.map((item) => (
            <FeaturedCard key={item.id} item={item} width={cardWidth} />
          ))}
        </ScrollView>

        <GradientCard tilt={0.35} style={styles.banner}>
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={styles.bannerTitle}>Unlimited Claims</Text>
            <Text style={styles.bannerBody}>Become a member for only $9.99</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/paywall')} style={styles.upgrade}>
            <Text style={styles.upgradeLabel}>Upgrade</Text>
          </Pressable>
        </GradientCard>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chips}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        <View style={styles.list}>
          {list.length === 0 ? (
            <Text style={styles.empty}>No settlements in this category right now.</Text>
          ) : (
            list.map((item) => <SettlementRow key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>

      {menuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menu, { top: insets.top + 60 }]}>
            {MENU.map((label, i) => (
              <Pressable
                key={label}
                accessibilityRole="menuitem"
                style={styles.menuRow}
                onPress={() => {
                  setMenuOpen(false);
                  if (label === 'How does this work') setInfoOpen(true);
                }}>
                <Text style={styles.menuIcon}>{MENU_ICON[i]}</Text>
                <Text style={styles.menuItem}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <InfoModal
        visible={infoOpen}
        title={HOW_CLASS_ACTIONS_WORK.title}
        paragraphs={HOW_CLASS_ACTIONS_WORK.paragraphs}
        onClose={() => setInfoOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surface },
  menuButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(232,236,239,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuGlyph: { fontSize: 20, color: Brand.muted, marginTop: -2 },
  content: { paddingTop: 22, paddingBottom: 32, gap: 20 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
  },
  section: { fontSize: 24, fontWeight: '700', color: Brand.ink },
  legendRow: { flexDirection: 'row', gap: 11 },
  carousel: { flexGrow: 0 },
  carouselContent: { paddingHorizontal: 21, paddingVertical: 4, gap: 16 },
  featured: {
    backgroundColor: Brand.white,
    borderRadius: 15,
    paddingHorizontal: 23,
    paddingVertical: 22,
    gap: 17,
  },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  featuredAmount: { fontSize: 24, fontWeight: '700', color: Brand.ink },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { fontSize: 20, fontWeight: '700', letterSpacing: 0.15, color: Brand.ink },
  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: Brand.noProofBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkGlyph: { color: Brand.noProofFg, fontSize: 14, fontWeight: '800' },
  due: { fontSize: 15, color: Brand.muted },
  progressTrack: {
    height: 7,
    borderRadius: 16,
    backgroundColor: Brand.track,
    overflow: 'hidden',
  },
  progressFill: { height: 7, borderRadius: 16, backgroundColor: Brand.progress },
  progressLabel: { fontSize: 12, letterSpacing: 0.4, color: Brand.muted, marginTop: -10 },
  banner: {
    marginHorizontal: 21,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 29,
  },
  bannerTitle: { color: Brand.white, fontSize: 20, fontWeight: '700' },
  bannerBody: { color: Brand.white, fontSize: 15, fontWeight: '600', lineHeight: 18 },
  upgrade: {
    backgroundColor: Brand.white,
    borderRadius: 5,
    width: 97,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeLabel: { color: Brand.purpleLink, fontSize: 15, fontWeight: '600' },
  chipScroll: { flexGrow: 0 },
  chips: { paddingHorizontal: 21, gap: 6 },
  list: { paddingHorizontal: 21, gap: 17 },
  empty: { textAlign: 'center', color: Brand.muted, paddingVertical: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: Brand.white,
    borderRadius: 15,
    height: 79,
    paddingHorizontal: 19,
  },
  menu: {
    position: 'absolute',
    right: 0,
    width: 238,
    backgroundColor: Brand.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 19,
    gap: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuIcon: { width: 24, fontSize: 18, color: Brand.inkSoft, textAlign: 'center' },
  menuItem: { fontSize: 17, fontWeight: '500', color: Brand.inkSoft },
});
