import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/src/shared/components/icons';
import { SampleNotificationService } from '@/src/modules/sample-notifications/services/SystemNotificationService';

export default function NotificationDemo() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [customTitle, setCustomTitle] = useState('Notification Title');
  const [customMessage, setCustomMessage] = useState('Your notification message');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    const initialized = await SampleNotificationService.initialize();
    if (initialized) {
      const status = await SampleNotificationService.getPermissionStatus();
      setPermissionGranted(status === 'granted');
    }
  };

  const handleRequestPermissions = async () => {
    const granted = await SampleNotificationService.requestPermissions();
    setPermissionGranted(granted);
    
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Push notifications require permission to appear in your system notification tray.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSendNotification = async () => {
    if (!customTitle.trim() || !customMessage.trim()) {
      Alert.alert('Error', 'Please enter both title and message');
      return;
    }

    const id = await SampleNotificationService.showInfo(customTitle, customMessage);
    if (id) {
      Alert.alert('Success', 'Notification sent to system tray!');
    }
  };

  const handleClearAll = async () => {
    await SampleNotificationService.cancelAllNotifications();
    Alert.alert('Success', 'All notifications cleared!');
    setPendingCount(0);
  };

  const handleCustomNotification = () => handleSendNotification();

  const handleBasicInfo = async () => {
    const id = await SampleNotificationService.showInfo('Info', 'This is an info notification');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleSuccess = async () => {
    const id = await SampleNotificationService.showSuccess('Success!', 'Task completed successfully');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleWarning = async () => {
    const id = await SampleNotificationService.showWarning('Warning', 'Please check your settings');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleError = async () => {
    const id = await SampleNotificationService.showError('Error', 'Something went wrong');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleAchievement = async () => {
    const id = await SampleNotificationService.showAchievement('Achievement Unlocked', 'You completed your first task!');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleChatMessage = async () => {
    const id = await SampleNotificationService.showChatMessage('Alice', 'Hey! How are you doing?', 'chat_demo', '#e11d48');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleReminder = async () => {
    const id = await SampleNotificationService.showReminderNotification('Reminder', 'Don\'t forget your meeting at 3 PM', 'reminder_demo');
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleSystemUpdate = async () => {
    const id = await SampleNotificationService.showSystemUpdate('System Update', 'Updating system components...', 75);
    if (id) setPendingCount(prev => prev + 1);
  };

  const handleScheduledNotification = async () => {
    const scheduleDate = new Date(Date.now() + 10000); // 10 seconds from now
    const id = await SampleNotificationService.scheduleNotification('Scheduled', 'This notification was scheduled 10 seconds ago', scheduleDate, 'info');
    if (id) {
      setPendingCount(prev => prev + 1);
      Alert.alert('Scheduled', 'Notification scheduled for 10 seconds from now');
    }
  };

  const handleMultipleNotifications = async () => {
    await SampleNotificationService.sendMultipleNotifications();
    setPendingCount(prev => prev + 4);
    Alert.alert('Sent', '4 notifications sent with 1-second intervals');
  };

  const handleTestChatNotifications = async () => {
    await SampleNotificationService.sendTestChatNotifications();
    setPendingCount(prev => prev + 3);
    Alert.alert('Sent', '3 chat notifications sent with 2-second intervals');
  };

  const renderPermissionStatus = () => (
    <View className="bg-card rounded-lg border border-border p-4 mb-6">
      <Text className="font-semibold text-foreground mb-2">System Notification Permission</Text>
      <View className="flex-row items-center">
        <Icon 
          name={permissionGranted ? 'checkmark' : 'close-circle'} 
          size={20} 
          color={permissionGranted ? '#10b981' : '#ef4444'} 
        />
        <Text className={`ml-2 ${permissionGranted ? 'text-green-600' : 'text-red-600'}`}>
          {permissionGranted ? 'Permission granted' : 'Permission required'}
        </Text>
      </View>
      {!permissionGranted && (
        <TouchableOpacity
          onPress={handleRequestPermissions}
          className="mt-3 bg-primary rounded-lg py-2 px-4 self-start"
        >
          <Text className="text-primary-foreground font-medium">Grant Permission</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderButton = (
    title: string,
    description: string,
    onPress: () => void,
    variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default'
  ) => {
    const buttonStyles = {
      default: 'bg-card border-border',
      primary: 'bg-primary border-primary',
      success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
      warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
      error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    };

    const textStyles = {
      default: 'text-foreground',
      primary: 'text-primary-foreground',
      success: 'text-green-900 dark:text-green-100',
      warning: 'text-yellow-900 dark:text-yellow-100',
      error: 'text-red-900 dark:text-red-100',
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!permissionGranted}
        className={`rounded-lg border p-4 mb-3 ${buttonStyles[variant]} ${
          !permissionGranted ? 'opacity-50' : ''
        }`}
      >
        <Text className={`font-semibold mb-1 ${textStyles[variant]}`}>{title}</Text>
        <Text className={`text-sm opacity-80 ${textStyles[variant]}`}>{description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-card border border-border rounded-lg items-center justify-center"
          >
            <Icon name="back" size={20} color="#666" />
          </TouchableOpacity>
          <Text variant="primary" size="xl" weight="bold">
            System Notifications
          </Text>
          <TouchableOpacity
            onPress={handleClearAll}
            className="w-10 h-10 bg-red-100 border border-red-200 rounded-lg items-center justify-center"
            disabled={!permissionGranted}
          >
            <Icon name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-3 bg-muted border-b border-border">
        <View className="flex-row justify-center space-x-6">
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground">
              {permissionGranted ? 'Yes' : 'No'}
            </Text>
            <Text className="text-xs text-muted-foreground">Permission</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground">{pendingCount}</Text>
            <Text className="text-xs text-muted-foreground">Scheduled</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground">System</Text>
            <Text className="text-xs text-muted-foreground">Tray Only</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Permission Status */}
        {renderPermissionStatus()}

        {/* Custom Notification */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3 text-foreground">Custom Notification</Text>
          
          <TextInput
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder="Notification Title"
            className="bg-card border border-border rounded-lg px-4 py-3 mb-3 text-foreground"
            placeholderTextColor="#999"
          />
          
          <TextInput
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Notification Message"
            multiline
            numberOfLines={2}
            className="bg-card border border-border rounded-lg px-4 py-3 mb-3 text-foreground"
            placeholderTextColor="#999"
          />
          
          {renderButton(
            'Send Custom Notification',
            'Creates notification in system tray with your custom text',
            handleCustomNotification,
            'primary'
          )}
        </View>

        {/* Basic Notifications */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3 text-foreground">Basic System Notifications</Text>
          
          {renderButton(
            'Info Notification',
            'Blue info notification in system tray',
            handleBasicInfo
          )}
          
          {renderButton(
            'Success Notification',
            'Green success notification in system tray',
            handleSuccess,
            'success'
          )}
          
          {renderButton(
            'Warning Notification',
            'Yellow warning notification in system tray',
            handleWarning,
            'warning'
          )}
          
          {renderButton(
            'Error Notification',
            'Red error notification in system tray',
            handleError,
            'error'
          )}
        </View>

        {/* Advanced Notifications */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3 text-foreground">Advanced System Notifications</Text>
          
          {renderButton(
            'Achievement Notification',
            'Celebration notification with special emoji',
            handleAchievement,
            'success'
          )}
          
          {renderButton(
            'Chat Message',
            'Interactive notification with Reply and View buttons',
            handleChatMessage,
            'primary'
          )}
          
          {renderButton(
            'Reminder Notification',
            'Reminder with Done and Snooze action buttons',
            handleReminder,
            'warning'
          )}
          
          {renderButton(
            'System Update',
            'System notification with update progress',
            handleSystemUpdate
          )}
          
          {renderButton(
            'Schedule Notification',
            'Schedules notification for 10 seconds from now',
            handleScheduledNotification
          )}
        </View>

        {/* Batch Operations */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3 text-foreground">Batch Operations</Text>
          
          {renderButton(
            'Multiple Notifications',
            'Sends 4 different notifications with 1-second intervals',
            handleMultipleNotifications
          )}
          
          {renderButton(
            'Test Chat Notifications',
            'Sends 3 chat notifications with 2-second intervals',
            handleTestChatNotifications,
            'primary'
          )}
        </View>

        {/* Instructions */}
        <View className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
          <Text className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📱 System Notification Features
          </Text>
          <Text className="text-sm text-blue-800 dark:text-blue-200 leading-5">
            ✓ All notifications appear in device system tray{'\n'}
            ✓ Persist when app is closed or minimized{'\n'}
            ✓ Tapping notifications launches the app{'\n'}
            ✓ Interactive action buttons (Reply, Done, etc.){'\n'}
            ✓ Sound and vibration support{'\n'}
            ✓ Scheduling and repeat functionality{'\n'}
            ✓ No in-app overlay notifications
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}