import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOW_CLASS_ACTIONS_WORK, InfoModal } from '@/components/mode/info-modal';
import {
  BrandBadge,
  Chip,
  ModeLogo,
  SmallButton,
  Tag,
} from '@/components/mode/primitives';
import { Brand } from '@/constants/theme';
import { CATEGORIES, FEATURED, SETTLEMENTS, type Settlement } from '@/data/settlements';

const MENU = ['How does this work', 'Privacy Policy', 'Terms of Use', 'Contact Support'] as const;

function SettlementRow({ item }: { item: Settlement }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/settlement/[id]', params: { id: item.id } })}
      style={styles.row}>
      <BrandBadge letter={item.letter} color={item.color} size={48} />
      <View style={{ flex: 1 }}>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>{item.amount}</Text>
          {item.tag ? <Tag kind={item.tag} /> : null}
        </View>
        <Text style={styles.due}>Due in {item.dueInDays} days</Text>
      </View>
      <SmallButton
        label="Claim"
        onPress={() => router.push({ pathname: '/settlement/[id]', params: { id: item.id } })}
      />
    </Pressable>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const list = category === 'All' ? SETTLEMENTS : SETTLEMENTS.filter((s) => s.category === category);
  const progress = FEATURED.claimsFiled / FEATURED.claimsTotal;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ModeLogo size={26} />
        <Text style={styles.headerTitle}>Settlements</Text>
        <Pressable
          accessibilityLabel="Menu"
          accessibilityRole="button"
          onPress={() => setMenuOpen((v) => !v)}
          style={styles.menuButton}>
          <Text style={styles.menuGlyph}>≡</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Featured</Text>

        <Pressable
          onPress={() => router.push({ pathname: '/settlement/[id]', params: { id: FEATURED.id } })}
          style={styles.featured}>
          <View style={styles.featuredTop}>
            <BrandBadge letter={FEATURED.letter} color={FEATURED.color} size={52} />
            <View style={{ flex: 1 }}>
              <View style={styles.amountRow}>
                <Text style={styles.featuredAmount}>{FEATURED.amount}</Text>
                {FEATURED.tag ? <Tag kind={FEATURED.tag} /> : null}
              </View>
              <Text style={styles.due}>Due in {FEATURED.dueInDays} days</Text>
            </View>
            <SmallButton
              label="Claim"
              onPress={() => router.push({ pathname: '/settlement/[id]', params: { id: FEATURED.id } })}
            />
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 4)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {FEATURED.claimsFiled} out of {FEATURED.claimsTotal} claims filled 🎉
          </Text>
        </Pressable>

        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Unlimited Claims</Text>
            <Text style={styles.bannerBody}>Become a member for only $9.99</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/paywall')} style={styles.upgrade}>
            <Text style={styles.upgradeLabel}>Upgrade</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        {list.length === 0 ? (
          <Text style={styles.empty}>No settlements in this category right now.</Text>
        ) : (
          list.map((item) => <SettlementRow key={item.id} item={item} />)
        )}
      </ScrollView>

      {menuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menu, { top: insets.top + 56 }]}>
            {MENU.map((label) => (
              <Pressable
                key={label}
                accessibilityRole="menuitem"
                onPress={() => {
                  setMenuOpen(false);
                  if (label === 'How does this work') setInfoOpen(true);
                }}>
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Brand.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Brand.ink },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuGlyph: { fontSize: 20, color: Brand.muted, marginTop: -2 },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  section: { fontSize: 22, fontWeight: '800', color: Brand.ink },
  featured: {
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featuredAmount: { fontSize: 24, fontWeight: '800', color: Brand.ink },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { fontSize: 20, fontWeight: '800', color: Brand.ink },
  due: { fontSize: 14, color: Brand.muted },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: Brand.chip, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: Brand.purple },
  progressLabel: { fontSize: 12, color: Brand.muted },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Brand.purple,
    borderRadius: 14,
    padding: 18,
  },
  bannerTitle: { color: Brand.white, fontSize: 20, fontWeight: '800' },
  bannerBody: { color: '#DDD0F7', fontSize: 14, fontWeight: '700', marginTop: 2 },
  upgrade: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  upgradeLabel: { color: Brand.white, fontWeight: '700', fontSize: 15 },
  chips: { gap: 8, paddingVertical: 2 },
  empty: { textAlign: 'center', color: Brand.muted, paddingVertical: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 12,
  },
  menu: {
    position: 'absolute',
    right: 12,
    width: 238,
    backgroundColor: Brand.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 22,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuItem: { fontSize: 17, fontWeight: '500', color: Brand.inkSoft },
});
