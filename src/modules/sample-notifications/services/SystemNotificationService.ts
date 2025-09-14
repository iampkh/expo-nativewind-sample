/**
 * Sample System Notification Service
 * 
 * Module-specific notification service that uses base notification manager
 * All notifications are sent to system notification tray
 */

import { baseNotificationManager, BaseNotificationConfig, NotificationEventHandlers } from '@/src/core/notifications/BaseNotificationManager';
import { router } from 'expo-router';

export class SampleNotificationService {
  private static initialized = false;

  // Initialize with app-specific event handlers
  static async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    const eventHandlers: NotificationEventHandlers = {
      onPress: (notification) => {
        console.log('Notification pressed:', notification.title);
        this.handleNotificationPress(notification);
      },
      onAction: (notification, actionId) => {
        console.log('Notification action:', actionId, notification.title);
        this.handleNotificationAction(notification, actionId);
      },
      onError: (error) => {
        console.error('Notification error:', error);
      },
      onScheduled: (notification, id) => {
        console.log('Notification scheduled:', notification.title, id);
      },
    };

    const success = await baseNotificationManager.initialize(eventHandlers);
    if (success) {
      this.initialized = true;
    }
    return success;
  }

  // Handle notification press events
  private static handleNotificationPress(notification: BaseNotificationConfig): void {
    const { data, type } = notification;

    switch (type) {
      case 'chat':
        if (data?.chatId) {
          console.log('Opening chat:', data.chatId);
          // Navigate to specific chat
          // router.push(`/chat/${data.chatId}`);
        }
        break;

      case 'reminder':
        if (data?.reminderId) {
          console.log('Opening reminder:', data.reminderId);
          // Navigate to reminder details
        }
        break;

      case 'system':
        console.log('System notification pressed:', data?.systemType);
        // Handle system notification
        break;

      default:
        // Navigate to notifications screen for general notifications
        router.push('/NotificationDemo');
        break;
    }
  }

  // Handle notification action button presses
  private static handleNotificationAction(notification: BaseNotificationConfig, actionId: string): void {
    const { data, type } = notification;

    switch (type) {
      case 'chat':
        if (actionId === 'reply') {
          console.log('Quick reply to:', data?.userName);
          // Show quick reply interface
        } else if (actionId === 'view') {
          console.log('View chat with:', data?.userName);
          // Navigate to chat
          if (data?.chatId) {
            // router.push(`/chat/${data.chatId}`);
          }
        }
        break;

      case 'reminder':
        if (actionId === 'done') {
          console.log('Mark reminder as done:', data?.reminderId);
          // Mark reminder as completed
        } else if (actionId === 'snooze') {
          console.log('Snooze reminder for 10 minutes:', data?.reminderId);
          // Reschedule reminder for 10 minutes later
          this.scheduleReminderSnooze(notification);
        }
        break;
    }
  }

  // Snooze reminder for 10 minutes
  private static async scheduleReminderSnooze(notification: BaseNotificationConfig): Promise<void> {
    const snoozeDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const snoozeConfig: BaseNotificationConfig = {
      ...notification,
      title: `⏰ ${notification.title} (Snoozed)`,
      scheduleDate: snoozeDate,
    };
    await baseNotificationManager.scheduleNotification(snoozeConfig, snoozeDate);
  }

  // Basic notification methods
  static async showInfo(title: string, message?: string, data?: any): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showInfo(title, message || '', data);
  }

  static async showSuccess(title: string, message?: string, data?: any): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showSuccess(title, message || '', data);
  }

  static async showWarning(title: string, message?: string, data?: any): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showWarning(title, message || '', data);
  }

  static async showError(title: string, message?: string, data?: any): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showError(title, message || '', data);
  }

  // Specialized notification methods
  static async showAchievement(title: string, description: string): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.sendNotification({
      type: 'success',
      title: `🎉 ${title}`,
      message: description,
      data: { type: 'achievement' },
      sound: true,
      vibrate: true,
      priority: 'high',
    });
  }

  static async showChatMessage(
    userName: string, 
    message: string, 
    chatId: string,
    avatarColor?: string
  ): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showChatNotification(
      `New message from ${userName}`,
      message,
      chatId,
      userName,
      { avatarColor }
    );
  }

  static async showReminderNotification(
    title: string,
    message: string,
    reminderId: string
  ): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showReminderNotification(
      title,
      message,
      reminderId
    );
  }

  static async showSystemUpdate(
    title: string, 
    message: string, 
    progress?: number
  ): Promise<string | null> {
    await this.initialize();
    return baseNotificationManager.showSystemNotification(
      title,
      message,
      'update',
      { progress }
    );
  }

  // Scheduling methods
  static async scheduleNotification(
    title: string,
    message: string,
    date: Date,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    data?: any
  ): Promise<string | null> {
    await this.initialize();
    const config: BaseNotificationConfig = {
      type,
      title,
      message,
      data,
      sound: true,
    };
    return baseNotificationManager.scheduleNotification(config, date);
  }

  static async scheduleRepeatingReminder(
    title: string,
    message: string,
    intervalMinutes: number,
    data?: any
  ): Promise<string | null> {
    await this.initialize();
    const config: BaseNotificationConfig = {
      type: 'reminder',
      title,
      message,
      data,
      sound: true,
      actions: [
        { id: 'done', title: 'Mark Done', opensApp: false },
        { id: 'snooze', title: 'Snooze 10min', opensApp: false },
      ],
    };
    return baseNotificationManager.scheduleRepeatingNotification(config, intervalMinutes * 60);
  }

  // Management methods
  static async cancelNotification(notificationId: string): Promise<void> {
    await baseNotificationManager.cancelNotification(notificationId);
  }

  static async cancelAllNotifications(): Promise<void> {
    await baseNotificationManager.cancelAllNotifications();
  }

  static async getPendingNotifications() {
    return baseNotificationManager.getPendingNotifications();
  }

  static async getPermissionStatus() {
    return baseNotificationManager.getPermissionStatus();
  }

  static async requestPermissions(): Promise<boolean> {
    return baseNotificationManager.requestPermissions();
  }

  // Utility methods for demo purposes
  static async sendMultipleNotifications(): Promise<void> {
    await this.initialize();

    const notifications = [
      { title: 'Info Notification', message: 'This is an informational message', type: 'info' as const },
      { title: 'Success Notification', message: 'Task completed successfully!', type: 'success' as const },
      { title: 'Warning Notification', message: 'Please check your settings', type: 'warning' as const },
      { title: 'Error Notification', message: 'Something went wrong', type: 'error' as const },
    ];

    for (let i = 0; i < notifications.length; i++) {
      const notif = notifications[i];
      setTimeout(() => {
        baseNotificationManager.sendNotification({
          type: notif.type,
          title: notif.title,
          message: notif.message,
          data: { batch: true, index: i },
          sound: true,
        });
      }, i * 1000); // Stagger notifications by 1 second
    }
  }

  static async sendTestChatNotifications(): Promise<void> {
    await this.initialize();

    const chatMessages = [
      { user: 'Alice', message: 'Hey! How are you doing?', color: '#e11d48' },
      { user: 'Bob', message: 'Meeting starts in 5 minutes', color: '#3b82f6' },
      { user: 'Charlie', message: 'Check out this cool feature!', color: '#10b981' },
    ];

    chatMessages.forEach((chat, index) => {
      setTimeout(() => {
        this.showChatMessage(chat.user, chat.message, `chat_${index}`, chat.color);
      }, index * 2000); // Stagger by 2 seconds
    });
  }

  static getVisibleCount(): number {
    // For system notifications, we can't get real-time count of visible notifications
    // Return 0 as they're managed by the system
    return 0;
  }

  static getQueuedCount(): number {
    // For system notifications, we can't get real-time count of queued notifications
    // Return 0 as they're managed by the system
    return 0;
  }
}