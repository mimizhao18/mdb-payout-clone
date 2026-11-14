import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

import { supabase } from './supabase';

/**
 * Gives every user a private account without a login screen.
 *
 * On launch we check for a saved session. If there is none, we ask Supabase for
 * an "anonymous" user: a real account id that the database uses to keep each
 * person's claims and forms separate. The session is saved on the device, so
 * the same person gets the same account next time.
 */
type SessionState = {
  userId: string | null;
  ready: boolean;
  error: string | null;
  retry: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>.');
  return value;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const existing = await supabase.auth.getSession();
      if (existing.error) throw existing.error;
      if (existing.data.session) return existing.data.session.user.id;

      const created = await supabase.auth.signInAnonymously();
      if (created.error) throw created.error;
      return created.data.user?.id ?? null;
    }

    start()
      .then((id) => {
        if (cancelled) return;
        setUserId(id);
        setError(null);
        setReady(true);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  const value = useMemo(() => ({ userId, ready, error, retry }), [userId, ready, error, retry]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Shows a spinner until the user has an account, or an error with a retry button. */
export function SessionGate({ children }: { children: ReactNode }) {
  const { ready, error, retry } = useSession();

  if (ready) return <>{children}</>;

  return (
    <View style={styles.center}>
      {error ? (
        <>
          <Text style={styles.title}>Can’t connect right now</Text>
          <Text style={styles.body}>Check your connection and try again.</Text>
          <Text style={styles.detail}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={retry} style={styles.button}>
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator color={Brand.purple} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 32,
    backgroundColor: Brand.surface,
  },
  title: { fontSize: 18, fontWeight: '700', color: Brand.ink },
  body: { fontSize: 14, color: Brand.muted, textAlign: 'center' },
  detail: { fontSize: 11, color: Brand.muted, textAlign: 'center', opacity: 0.8 },
  button: {
    marginTop: 8,
    backgroundColor: Brand.purple,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  buttonLabel: { color: Brand.white, fontWeight: '600', fontSize: 15 },
});
