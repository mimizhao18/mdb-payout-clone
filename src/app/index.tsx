import { Redirect } from 'expo-router';

import { ErrorState, LoadingState } from '@/components/mode/remote-state';
import { useRemote } from '@/hooks/use-remote';
import { fetchProfile } from '@/lib/api';

/**
 * First screen: look up the user's profile and send them to onboarding if they
 * haven't finished it, otherwise straight to the app.
 */
export default function Index() {
  const { data, error, loading, reload } = useRemote(fetchProfile);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return <Redirect href={data?.onboarded ? '/home' : '/onboarding'} />;
}
