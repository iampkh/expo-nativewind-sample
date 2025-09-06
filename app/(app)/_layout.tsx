import { Stack } from 'expo-router';
import { useAppSelector } from '@/src/store';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AppLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}