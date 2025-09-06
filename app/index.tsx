import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { restoreSessionThunk } from '@/src/modules/auth/store';

export default function RootScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);

  // Try to restore session on app start
  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  // Navigate based on auth state
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // User is authenticated, redirect to main app
        router.replace('/(app)');
      } else {
        // User is not authenticated, redirect to login
        router.replace('/login');
      }
    }
  }, [isAuthenticated, user, loading]);

  // Show loading screen while checking auth state
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="mb-4" />
        <Text variant="secondary" size="base">
          Loading...
        </Text>
      </View>
    </SafeAreaView>
  );
}