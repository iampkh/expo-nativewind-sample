/**
 * DeviceModel - Multi-device session tracking
 * 
 * PURPOSE:
 * Manages user sessions across different devices and platforms.
 * Tracks presence, stores push notification tokens, and handles device-specific features.
 * Enables multi-device sync and targeted notifications.
 * 
 * RELATIONS:
 * - Belongs to User (device owner)
 * 
 * DEVICE TYPES:
 * - ANDROID: Android mobile app
 * - IOS: iPhone/iPad app
 * - WEB: Browser-based access
 * 
 * FEATURES:
 * - Push notification token management
 * - Online/offline presence tracking
 * - Session management
 * - Device-specific capabilities
 * - Privacy-conscious IP masking
 */

import { Model } from '@nozbe/watermelondb'
import { text, date, readonly, writer, relation } from '@nozbe/watermelondb/decorators'
import type { Associations } from '@nozbe/watermelondb/Model'
import type { Relation } from '@nozbe/watermelondb'
import { DeviceType } from '../types'
import UserModel from '../core/UserModel'

export default class DeviceModel extends Model {
  static table = 'devices'

  static associations: Associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  }

  @text('user_id') userId!: string
  @text('device_type') deviceType!: DeviceType
  @text('device_token') deviceToken!: string
  @text('ip_address') ipAddress!: string
  @date('last_active_at') lastActiveAt!: Date

  @readonly @date('created_at') createdAt!: Date

  // Relations
  @relation('users', 'user_id') user!: Relation<UserModel>

  @writer async updateLastActive() {
    return await this.update(device => {
      device.lastActiveAt = new Date()
    })
  }

  @writer async updateDeviceToken(newToken: string) {
    return await this.update(device => {
      device.deviceToken = newToken
    })
  }

  @writer async updateIpAddress(newIp: string) {
    return await this.update(device => {
      device.ipAddress = newIp
    })
  }

  // Helper methods
  get isAndroid() {
    return this.deviceType === DeviceType.ANDROID
  }

  get isIOS() {
    return this.deviceType === DeviceType.IOS
  }

  get isWeb() {
    return this.deviceType === DeviceType.WEB
  }

  get isMobile() {
    return this.isAndroid || this.isIOS
  }

  get deviceName() {
    switch (this.deviceType) {
      case DeviceType.ANDROID: return 'Android'
      case DeviceType.IOS: return 'iOS'
      case DeviceType.WEB: return 'Web'
      default: return 'Unknown'
    }
  }

  get deviceIcon() {
    switch (this.deviceType) {
      case DeviceType.ANDROID: return '📱'
      case DeviceType.IOS: return '📱'
      case DeviceType.WEB: return '💻'
      default: return '📱'
    }
  }

  get canReceivePushNotifications() {
    return !!this.deviceToken && this.deviceToken.trim().length > 0
  }

  get lastActiveTimeAgo() {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - this.lastActiveAt.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Active now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Active ${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Active ${hours}h ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `Active ${days}d ago`
    }
  }

  get isActiveRecently() {
    const now = new Date()
    const diffInMinutes = (now.getTime() - this.lastActiveAt.getTime()) / (1000 * 60)
    return diffInMinutes <= 15 // Within last 15 minutes
  }

  get isOnline() {
    return this.isActiveRecently
  }

  get statusColor() {
    return this.isOnline ? '#10b981' : '#6b7280' // green if online, gray if offline
  }

  get maskedIpAddress() {
    if (!this.ipAddress) return 'Unknown'
    // Mask the last octet for privacy
    const parts = this.ipAddress.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.***`
    }
    return this.ipAddress
  }
}