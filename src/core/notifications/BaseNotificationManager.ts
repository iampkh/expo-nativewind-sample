/**
 * Base Notification Manager
 * 
 * Unified notification system that creates system push notifications
 * All notifications appear in device notification tray and can launch app when tapped
 */

import { SystemNotificationService, SystemNotificationConfig } from './SystemNotificationService';

export type NotificationId = string;

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'chat'
  | 'reminder'
  | 'system'
  | 'custom';

export interface BaseNotificationConfig {
  id?: NotificationId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  sound?: boolean;
  vibrate?: boolean;
  badge?: number;
  priority?: 'low' | 'normal' | 'high' | 'max';
  persistent?: boolean;
  actions?: NotificationAction[];
  scheduleDate?: Date;
  repeatInterval?: number; // in seconds
}

export interface NotificationAction {
  id: string;
  title: string;
  destructive?: boolean;
  opensApp?: boolean;
}

// Event handlers for notification interactions
export interface NotificationEventHandlers {
  onPress?: (notification: BaseNotificationConfig) => void;
  onAction?: (notification: BaseNotificationConfig, actionId: string) => void;
  onScheduled?: (notification: BaseNotificationConfig, notificationId: string) => void;
  onError?: (error: Error) => void;
}

export class BaseNotificationManager {
  private static instance: BaseNotificationManager;
  private initialized = false;
  private eventHandlers: NotificationEventHandlers = {};

  private constructor() {}

  static getInstance(): BaseNotificationManager {
    if (!BaseNotificationManager.instance) {
      BaseNotificationManager.instance = new BaseNotificationManager();
    }
    return BaseNotificationManager.instance;
  }

  // Initialize the notification system
  async initialize(handlers?: NotificationEventHandlers): Promise<boolean> {
    if (this.initialized) return true;

    if (handlers) {
      this.eventHandlers = handlers;
    }

    try {
      const success = await SystemNotificationService.initialize();
      if (success) {
        // Setup notification response handlers
        SystemNotificationService.setupNotificationListeners();
        this.initialized = true;
      }
      return success;
    } catch (error) {
      console.error('Failed to initialize notification manager:', error);
      this.eventHandlers.onError?.(error as Error);
      return false;
    }
  }

  // Send immediate system notification
  async sendNotification(config: BaseNotificationConfig): Promise<string | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const systemConfig = this.convertToSystemConfig(config);
      const notificationId = await SystemNotificationService.sendNotification(systemConfig);
      
      if (notificationId && config.scheduleDate) {
        this.eventHandlers.onScheduled?.(config, notificationId);
      }

      return notificationId;
    } catch (error) {
      console.error('Failed to send notification:', error);
      this.eventHandlers.onError?.(error as Error);
      return null;
    }
  }

  // Send scheduled notification
  async scheduleNotification(config: BaseNotificationConfig, date: Date): Promise<string | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const systemConfig = this.convertToSystemConfig(config);
      const notificationId = await SystemNotificationService.scheduleNotification(systemConfig, date);
      
      if (notificationId) {
        this.eventHandlers.onScheduled?.(config, notificationId);
      }

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      this.eventHandlers.onError?.(error as Error);
      return null;
    }
  }

  // Send repeating notification
  async scheduleRepeatingNotification(config: BaseNotificationConfig, intervalSeconds: number): Promise<string | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const systemConfig = this.convertToSystemConfig(config);
      const notificationId = await SystemNotificationService.scheduleRepeatingNotification(systemConfig, intervalSeconds);
      
      if (notificationId) {
        this.eventHandlers.onScheduled?.(config, notificationId);
      }

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule repeating notification:', error);
      this.eventHandlers.onError?.(error as Error);
      return null;
    }
  }

  // Convert base config to system notification config
  private convertToSystemConfig(config: BaseNotificationConfig): SystemNotificationConfig {
    let categoryId = 'default';
    
    // Map notification types to appropriate channels/categories
    switch (config.type) {
      case 'chat':
        categoryId = 'chat';
        break;
      case 'reminder':
        categoryId = 'reminder';
        break;
      case 'system':
        categoryId = 'system';
        break;
      case 'info':
      case 'success':
      case 'warning':
      case 'error':
        categoryId = 'default';
        break;
    }

    return {
      title: config.title,
      body: config.message,
      data: {
        ...config.data,
        type: config.type,
        id: config.id,
        originalConfig: config,
      },
      sound: config.sound !== false,
      vibrate: config.vibrate !== false,
      badge: config.badge,
      categoryId,
      trigger: config.scheduleDate ? {
        date: config.scheduleDate,
        repeats: !!config.repeatInterval,
      } : config.repeatInterval ? {
        seconds: config.repeatInterval,
        repeats: true,
      } : undefined,
    };
  }

  // Convenience methods for different notification types

  async showInfo(title: string, message: string, data?: any): Promise<string | null> {
    return this.sendNotification({
      type: 'info',
      title,
      message,
      data,
      sound: true,
    });
  }

  async showSuccess(title: string, message: string, data?: any): Promise<string | null> {
    return this.sendNotification({
      type: 'success',
      title,
      message,
      data,
      sound: true,
    });
  }

  async showWarning(title: string, message: string, data?: any): Promise<string | null> {
    return this.sendNotification({
      type: 'warning',
      title,
      message,
      data,
      sound: true,
      vibrate: true,
    });
  }

  async showError(title: string, message: string, data?: any): Promise<string | null> {
    return this.sendNotification({
      type: 'error',
      title,
      message,
      data,
      sound: true,
      vibrate: true,
      priority: 'high',
    });
  }

  async showChatNotification(
    title: string, 
    message: string, 
    chatId: string, 
    userName: string,
    data?: any
  ): Promise<string | null> {
    return this.sendNotification({
      type: 'chat',
      title,
      message,
      data: {
        ...data,
        chatId,
        userName,
      },
      sound: true,
      vibrate: true,
      actions: [
        { id: 'reply', title: 'Reply', opensApp: true },
        { id: 'view', title: 'View Chat', opensApp: true },
      ],
    });
  }

  async showReminderNotification(
    title: string,
    message: string,
    reminderId: string,
    data?: any
  ): Promise<string | null> {
    return this.sendNotification({
      type: 'reminder',
      title,
      message,
      data: {
        ...data,
        reminderId,
      },
      sound: true,
      actions: [
        { id: 'done', title: 'Mark Done', opensApp: false },
        { id: 'snooze', title: 'Snooze 10min', opensApp: false },
      ],
    });
  }

  async showSystemNotification(
    title: string,
    message: string,
    systemType: string = 'update',
    data?: any
  ): Promise<string | null> {
    return this.sendNotification({
      type: 'system',
      title,
      message,
      data: {
        ...data,
        systemType,
      },
      sound: false,
      priority: 'normal',
    });
  }

  // Management methods
  async cancelNotification(notificationId: string): Promise<void> {
    await SystemNotificationService.cancelNotification(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await SystemNotificationService.cancelAllNotifications();
  }

  async getPendingNotifications() {
    return SystemNotificationService.getPendingNotifications();
  }

  async requestPermissions(): Promise<boolean> {
    return SystemNotificationService.requestPermissions();
  }

  async getPermissionStatus() {
    return SystemNotificationService.getPermissionStatus();
  }

  // Set event handlers
  setEventHandlers(handlers: NotificationEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  // Handle notification interactions (called by system)
  handleNotificationPress(notificationData: any): void {
    const config = notificationData.originalConfig as BaseNotificationConfig;
    if (config) {
      this.eventHandlers.onPress?.(config);
    }
  }

  handleNotificationAction(notificationData: any, actionId: string): void {
    const config = notificationData.originalConfig as BaseNotificationConfig;
    if (config) {
      this.eventHandlers.onAction?.(config, actionId);
    }
  }
}

// Export singleton instance
export const baseNotificationManager = BaseNotificationManager.getInstance();