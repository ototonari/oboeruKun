import {NotificationRequestInput, scheduleNotificationAsync} from "expo-notifications";
import {NotificationContentInput} from "expo-notifications/src/Notifications.types";

export interface registerProp extends NotificationRequestInput {}

export interface contentProp extends NotificationContentInput {}

export const toRegisterDto = (trigger: Date, content: contentProp): registerProp => ({
  content, trigger
})

export type NotificationId = string;

export const register = async (requestInput: registerProp): Promise<NotificationId> => {
  return await scheduleNotificationAsync(requestInput);
}

