import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppDispatch } from '@/src/store';
import { restoreSessionThunk } from '@/src/modules/auth/store';

export default function RootScreen() {
  const dispatch = useAppDispatch();

  // Initialize app on startup
  useEffect(() => {
    // Restore any existing session for auth screens
    dispatch(restoreSessionThunk());
    
    // Navigate to home screen immediately for sample app testing
    router.replace('/HomeScreen');
  }, [dispatch]);

  // This component will only show briefly during initial navigation
  return null;
}