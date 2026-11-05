import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { Brand } from '@/constants/theme';

import { PillButton } from './primitives';

export function InfoModal({
  visible,
  title,
  paragraphs,
  onClose,
}: {
  visible: boolean;
  title: string;
  paragraphs: string[];
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {paragraphs.map((p) => (
            <Text key={p.slice(0, 24)} style={styles.body}>
              {p}
            </Text>
          ))}
          <PillButton label="Got it!" variant="soft" onPress={onClose} style={{ marginTop: 8 }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const HOW_CLASS_ACTIONS_WORK = {
  title: 'How Class Action Lawsuits Work',
  paragraphs: [
    'Class action lawsuits allow groups of people who have been harmed by a company to sue together. When companies settle these lawsuits, they often pay money to affected customers.',
    'This app helps you discover and claim your share of these settlements. Simply tap on any settlement to learn more and submit your claim if you’re eligible.',
  ],
};

export const HOW_PAYOUTS_WORK = {
  title: 'How Estimated Payouts Work',
  paragraphs: [
    'The estimated payout is calculated by summing the estimated amounts from all your claimed settlements. These amounts are based on the settlement terms and your eligibility.',
    'All actual payouts are handled directly by the settlement administrators, not through this app. Payment timing and final amounts may vary based on the settlement process.',
  ],
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Brand.white,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    width: '100%',
    maxWidth: 360,
  },
  title: { fontSize: 17, fontWeight: '700', color: Brand.ink },
  body: { fontSize: 14, lineHeight: 20, color: Brand.inkSoft },
});
