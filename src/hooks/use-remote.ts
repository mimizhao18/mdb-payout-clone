import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

type RemoteState<T> = { data: T | null; error: string | null; loading: boolean };

/**
 * Loads data from the backend and keeps it fresh: it runs when the screen
 * first appears AND every time the user comes back to it (for example after
 * filing a claim and returning to the Wallet tab).
 *
 * `load` must be a stable function (a module-level function or one wrapped in
 * useCallback), otherwise it would reload on every render.
 */
export function useRemote<T>(load: () => Promise<T>) {
  const [state, setState] = useState<RemoteState<T>>({ data: null, error: null, loading: true });

  const run = useCallback(async () => {
    try {
      const data = await load();
      setState({ data, error: null, loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setState((prev) => ({ data: prev.data, error: message, loading: false }));
    }
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      run();
    }, [run]),
  );

  return { ...state, reload: run };
}
