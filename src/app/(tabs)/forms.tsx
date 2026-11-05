import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandBadge, Chip } from '@/components/mode/primitives';
import { Brand } from '@/constants/theme';
import { FORM_STATUSES, SAVED_FORMS, type FormStatus } from '@/data/settlements';

const STATUS_COLOR: Record<FormStatus, string> = {
  Pending: Brand.amber,
  'Payment Sent': Brand.green,
  'Case Closed': Brand.red,
};

export default function Forms() {
  const insets = useSafeAreaInsets();
  // Tapping the active chip clears the filter and shows everything again.
  const [filter, setFilter] = useState<FormStatus | null>(null);
  const forms = filter ? SAVED_FORMS.filter((f) => f.status === filter) : SAVED_FORMS;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Forms</Text>
        <Text style={styles.count}>{SAVED_FORMS.length} files</Text>
      </View>

      {SAVED_FORMS.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No saved forms</Text>
          <Text style={styles.emptyBody}>Forms you fill out will be saved here for your records</Text>
        </View>
      ) : (
        <>
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

          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {forms.length === 0 ? (
              <Text style={styles.noMatch}>No forms with this status.</Text>
            ) : (
              forms.map((f) => (
                <View key={f.id} style={styles.item}>
                  <BrandBadge letter="📄" color={Brand.purpleSoft} size={36} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{f.title}</Text>
                    <Text style={styles.itemSub}>Submitted: {f.submitted}</Text>
                  </View>
                  <Text style={[styles.status, { backgroundColor: STATUS_COLOR[f.status] }]}>
                    {f.status}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  title: { fontSize: 15, fontWeight: '700', color: Brand.ink },
  count: { fontSize: 11, color: Brand.muted },
  chipScroll: { flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  list: { padding: 16, gap: 10 },
  noMatch: { textAlign: 'center', color: Brand.muted, paddingVertical: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Brand.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  itemTitle: { fontSize: 14, fontWeight: '700', color: Brand.ink },
  itemSub: { fontSize: 11, color: Brand.muted },
  status: {
    color: Brand.white,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyCard: {
    margin: 16,
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Brand.ink },
  emptyBody: { fontSize: 11, color: Brand.muted, textAlign: 'center' },
});
