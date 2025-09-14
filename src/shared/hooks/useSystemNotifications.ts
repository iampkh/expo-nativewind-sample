/**
 * System Notifications Hook
 * 
 * Hook to initialize and manage system push notifications
 * Handles permission requests, notification responses, and app state
 */

import { useEffect, useState } from 'react';
import { SystemNotificationService } from '@/src/core/notifications/SystemNotificationService';
import { router } from 'expo-router';

interface NotificationPermissionState {
  granted: boolean;
  requesting: boolean;
  error: string | null;
}

export const useSystemNotifications = (autoInit: boolean = true) => {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    granted: false,
    requesting: false,
    error: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!autoInit) return;

    initializeNotifications();
  }, [autoInit]);

  const initializeNotifications = async () => {
    setPermissionState(prev => ({ ...prev, requesting: true, error: null }));

    try {
      const success = await SystemNotificationService.initialize();
      const status = await SystemNotificationService.getPermissionStatus();
      
      setPermissionState({
        granted: status === 'granted',
        requesting: false,
        error: success ? null : 'Failed to initialize notifications',
      });

      if (success) {
        setIsInitialized(true);
        setupNotificationListeners();
      }
    } catch (error) {
      setPermissionState({
        granted: false,
        requesting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const setupNotificationListeners = () => {
    const listeners = SystemNotificationService.setupNotificationListeners();
    
    // Cleanup listeners on unmount
    return () => {
      listeners.cleanup();
    };
  };

  const requestPermissions = async (): Promise<boolean> => {
    setPermissionState(prev => ({ ...prev, requesting: true, error: null }));

    try {
      const granted = await SystemNotificationService.requestPermissions();
      
      setPermissionState({
        granted,
        requesting: false,
        error: granted ? null : 'Permissions denied',
      });

      return granted;
    } catch (error) {
      setPermissionState({
        granted: false,
        requesting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  };

  const openSettings = async () => {
    await SystemNotificationService.openNotificationSettings();
  };

  // Convenient notification sending methods
  const sendNotification = async (title: string, body: string, data?: any) => {
    if (!permissionState.granted) {
      const granted = await requestPermissions();
      if (!granted) return null;
    }

    return SystemNotificationService.sendNotification({
      title,
      body,
      data,
      sound: true,
    });
  };

  const sendChatNotification = async (title: string, message: string, chatId: string, userName: string) => {
    if (!permissionState.granted) {
      const granted = await requestPermissions();
      if (!granted) return null;
    }

    return SystemNotificationService.sendChatNotification(title, message, chatId, userName);
  };

  const sendReminderNotification = async (title: string, message: string, reminderId: string) => {
    if (!permissionState.granted) {
      const granted = await requestPermissions();
      if (!granted) return null;
    }

    return SystemNotificationService.sendReminderNotification(title, message, reminderId);
  };

  const scheduleNotification = async (title: string, body: string, date: Date, data?: any) => {
    if (!permissionState.granted) {
      const granted = await requestPermissions();
      if (!granted) return null;
    }

    return SystemNotificationService.scheduleNotification({
      title,
      body,
      data,
      sound: true,
    }, date);
  };

  const cancelNotification = async (notificationId: string) => {
    await SystemNotificationService.cancelNotification(notificationId);
  };

  const cancelAllNotifications = async () => {
    await SystemNotificationService.cancelAllNotifications();
  };

  const getPendingNotifications = async () => {
    return SystemNotificationService.getPendingNotifications();
  };

  return {
    // State
    permissionState,
    isInitialized,

    // Methods
    initializeNotifications,
    requestPermissions,
    openSettings,

    // Notification methods
    sendNotification,
    sendChatNotification,
    sendReminderNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getPendingNotifications,

    // Direct access to service
    service: SystemNotificationService,
  };
};