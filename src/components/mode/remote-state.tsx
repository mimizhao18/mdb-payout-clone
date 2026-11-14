import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

export function LoadingState() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Brand.purple} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.detail}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonLabel}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  title: { fontSize: 16, fontWeight: '700', color: Brand.ink },
  detail: { fontSize: 12, color: Brand.muted, textAlign: 'center' },
  button: {
    marginTop: 6,
    backgroundColor: Brand.purple,
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 11,
  },
  buttonLabel: { color: Brand.white, fontWeight: '600', fontSize: 14 },
});
