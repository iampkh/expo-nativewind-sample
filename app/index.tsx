import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAppDispatch } from '@/src/store';
import { restoreSessionThunk } from '@/src/modules/auth/store';

export default function RootScreen() {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  // Initialize app on startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Restore any existing session for auth screens
        await dispatch(restoreSessionThunk());
        
        // Wait a moment for the layout to be ready
        setTimeout(() => {
          setIsReady(true);
          // Navigate to home screen for sample app testing
          router.replace('/HomeScreen');
        }, 100);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Still navigate even if auth fails
        setTimeout(() => {
          setIsReady(true);
          router.replace('/HomeScreen');
        }, 100);
      }
    };

    initializeApp();
  }, [dispatch]);

  // This component will only show briefly during initial navigation
  return null;
}