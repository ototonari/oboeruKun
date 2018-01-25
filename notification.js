import { Constants, Notifications, Permissions } from 'expo';

export function cancelNotification(notificationId) {
  Notifications.cancelScheduledNotificationAsync(notificationId)
}