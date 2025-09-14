/**
 * System Push Notification Service
 * 
 * Creates actual system push notifications that appear in the device's notification tray
 * Notifications persist even when the app is closed and can launch the app when tapped
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface SystemNotificationConfig {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  vibrate?: boolean;
  badge?: number;
  icon?: string;
  color?: string;
  categoryId?: string;
  trigger?: {
    seconds?: number;
    date?: Date;
    repeats?: boolean;
  };
}

export class SystemNotificationService {
  private static isInitialized = false;

  // Initialize notification system
  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Set notification handler for when app is in foreground
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Request permissions
      const granted = await this.requestPermissions();
      if (!granted) {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Set notification categories for interactive notifications
      await this.setupNotificationCategories();

      this.isInitialized = true;
      console.log('System notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize system notifications:', error);
      return false;
    }
  }

  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      // For Android, set up notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          enableVibrate: true,
          enableLights: true,
          showBadge: true,
        });

        // Create additional channels for different notification types
        await Notifications.setNotificationChannelAsync('chat', {
          name: 'Chat Messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });

        await Notifications.setNotificationChannelAsync('system', {
          name: 'System Notifications',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
          showBadge: false,
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Setup notification categories for interactive notifications
  private static async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('chat', [
        {
          identifier: 'reply',
          buttonTitle: 'Reply',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'view',
          buttonTitle: 'View Chat',
          options: { opensAppToForeground: true },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('reminder', [
        {
          identifier: 'done',
          buttonTitle: 'Mark Done',
          options: { opensAppToForeground: false },
        },
        {
          identifier: 'snooze',
          buttonTitle: 'Snooze 10min',
          options: { opensAppToForeground: false },
        },
      ]);
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }

  // Send immediate system notification
  static async sendNotification(config: SystemNotificationConfig): Promise<string | null> {
    try {
      await this.initialize();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: config.sound !== false ? 'default' : undefined,
          badge: config.badge,
          // categoryId: config.categoryId, // Remove this line as it's not supported
          ...(Platform.OS === 'android' && {
            channelId: config.categoryId || 'default',
            color: config.color,
            icon: config.icon,
          }),
        },
        trigger: config.trigger ? (
          config.trigger.seconds ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: config.trigger.seconds,
            repeats: config.trigger.repeats || false,
          } : config.trigger.date ? {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: config.trigger.date,
          } : null
        ) : null
      });

      console.log('System notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error sending system notification:', error);
      return null;
    }
  }

  // Send scheduled system notification
  static async scheduleNotification(
    config: SystemNotificationConfig,
    triggerDate: Date
  ): Promise<string | null> {
    const scheduledConfig = {
      ...config,
      trigger: {
        date: triggerDate,
        repeats: false,
      },
    };
    return this.sendNotification(scheduledConfig);
  }

  // Send repeating system notification
  static async scheduleRepeatingNotification(
    config: SystemNotificationConfig,
    intervalSeconds: number
  ): Promise<string | null> {
    const repeatingConfig = {
      ...config,
      trigger: {
        seconds: intervalSeconds,
        repeats: true,
      },
    };
    return this.sendNotification(repeatingConfig);
  }

  // Cancel specific notification
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get pending notifications
  static async getPendingNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  // Preset notification types
  static async sendChatNotification(
    title: string,
    message: string,
    chatId: string,
    userName: string
  ): Promise<string | null> {
    return this.sendNotification({
      title,
      body: message,
      data: {
        type: 'chat',
        chatId,
        userName,
      },
      categoryId: 'chat',
      sound: true,
      vibrate: true,
    });
  }

  static async sendReminderNotification(
    title: string,
    message: string,
    reminderId: string
  ): Promise<string | null> {
    return this.sendNotification({
      title,
      body: message,
      data: {
        type: 'reminder',
        reminderId,
      },
      categoryId: 'reminder',
      sound: true,
    });
  }

  static async sendSystemNotification(
    title: string,
    message: string,
    systemType: string = 'update'
  ): Promise<string | null> {
    return this.sendNotification({
      title,
      body: message,
      data: {
        type: 'system',
        systemType,
      },
      categoryId: 'system',
      sound: false,
      badge: 0,
    });
  }

  // Handle notification interactions
  static setupNotificationListeners() {
    // Handle notification received while app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // You can show in-app notification here if needed
    });

    // Handle notification tapped (app opened from notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      
      const data = response.notification.request.content.data;
      
      // Handle different notification types
      if (data.type === 'chat') {
        console.log('Opening chat:', data.chatId);
        // Navigate to chat screen
        // router.push(`/chat/${data.chatId}`);
      } else if (data.type === 'reminder') {
        console.log('Opening reminder:', data.reminderId);
        // Navigate to reminder screen
      } else if (data.type === 'system') {
        console.log('System notification tapped:', data.systemType);
        // Handle system notification
      }
    });

    return {
      foregroundSubscription,
      responseSubscription,
      cleanup: () => {
        foregroundSubscription.remove();
        responseSubscription.remove();
      },
    };
  }

  // Get notification permission status
  static async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting permission status:', error);
      return 'denied';
    }
  }

  // Open device notification settings
  static async openNotificationSettings(): Promise<void> {
    try {
      // Note: openSettingsAsync is not available in current version
      console.log('Please open device settings manually to configure notifications');
    } catch (error) {
      console.error('Error opening notification settings:', error);
    }
  }
}