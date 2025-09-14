/**
 * Sample Notifications Module
 * 
 * Example module showing system push notifications
 * All notifications appear in device system notification tray
 */

// System notification service - the main export
export { SampleNotificationService } from './services/SystemNotificationService';

// Re-export core system notification manager for convenience
export { baseNotificationManager } from '@/src/core/notifications/BaseNotificationManager';