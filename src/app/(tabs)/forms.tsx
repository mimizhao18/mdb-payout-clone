import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar, Chip, Thumb } from '@/components/mode/primitives';
import { Brand, Shadow } from '@/constants/theme';
import { FORM_STATUSES, SAVED_FORMS, type FormStatus } from '@/data/settlements';

const GOOGLE = require('@/assets/images/mode/google.png');

const DOT: Record<FormStatus, string> = {
  Pending: Brand.dotPending,
  'Payment Sent': Brand.dotSent,
  'Case Closed': Brand.dotClosed,
};

export default function Forms() {
  const insets = useSafeAreaInsets();
  // Tapping the active chip clears the filter and shows everything again.
  const [filter, setFilter] = useState<FormStatus | null>(null);
  const forms = filter ? SAVED_FORMS.filter((f) => f.status === filter) : SAVED_FORMS;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <AppBar
        title="Forms"
        logo={false}
        titleAlign="left"
        right={<Text style={styles.count}>{SAVED_FORMS.length} files</Text>}
      />

      {SAVED_FORMS.length === 0 ? (
        <View style={[styles.emptyCard, Shadow.card]}>
          <Text style={styles.emptyTitle}>No saved forms</Text>
          <Text style={styles.emptyBody}>Forms you fill out will be saved here for your records</Text>
        </View>
      ) : (
        <>
          <View style={styles.legend}>
            {FORM_STATUSES.map((s) => (
              <View key={s} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: DOT[s] }]} />
                <Text style={styles.legendLabel}>{s}</Text>
              </View>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {forms.length === 0 ? (
              <Text style={styles.noMatch}>No forms with this status.</Text>
            ) : (
              forms.map((f) => (
                <View key={f.id} style={[styles.item, Shadow.card]}>
                  <Thumb source={GOOGLE} size={48} radius={8} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={styles.itemTitle}>{f.title}</Text>
                    <Text style={styles.itemSub}>Submitted: {f.submitted}</Text>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: DOT[f.status] }]} />
                </View>
              ))
            )}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chips}>
            {FORM_STATUSES.map((s) => (
              <Chip
                key={s}
                label={s}
                active={filter === s}
                onPress={() => setFilter((cur) => (cur === s ? null : s))}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surface },
  count: { fontSize: 15, fontWeight: '500', letterSpacing: 0.5, color: 'rgba(0,0,0,0.56)' },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
    paddingHorizontal: 23,
    paddingTop: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 15, height: 15, borderRadius: 8 },
  legendLabel: { fontSize: 15, fontWeight: '600', color: 'rgba(0,0,0,0.46)' },
  list: { paddingHorizontal: 19, paddingTop: 22, paddingBottom: 16, gap: 12, flexGrow: 1 },
  noMatch: { textAlign: 'center', color: Brand.muted, paddingVertical: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Brand.white,
    borderRadius: 20,
    height: 80,
    paddingHorizontal: 17,
  },
  itemTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.15, color: Brand.ink },
  itemSub: { fontSize: 15, color: Brand.muted },
  statusDot: { position: 'absolute', top: 8, right: 25, width: 15, height: 15, borderRadius: 8 },
  chipScroll: { flexGrow: 0, marginBottom: 12 },
  chips: { paddingHorizontal: 23, gap: 6 },
  emptyCard: {
    margin: 19,
    marginTop: 22,
    backgroundColor: Brand.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Brand.ink },
  emptyBody: { fontSize: 11, color: Brand.muted, textAlign: 'center' },
});
