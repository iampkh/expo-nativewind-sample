/**
 * System Notification Components Module
 * 
 * Re-exports system notification manager and types
 * All notifications are sent to device system notification tray
 */

// Re-export system notification manager
export { baseNotificationManager } from '@/src/core/notifications/BaseNotificationManager';

// Re-export core types for convenience
export type {
  BaseNotificationConfig,
  NotificationEventHandlers,
  NotificationType,
  NotificationAction,
} from '@/src/core/notifications/BaseNotificationManager';