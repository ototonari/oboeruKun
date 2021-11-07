import {useEffect} from "react";
import * as Notifications from "expo-notifications";

export const BackGround = () => {

  useEffect(() => {
    const receivListener = Notifications.addNotificationReceivedListener((notification) => {
      // 通知が発火すると、ここでペイロードにアクセスできる。
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // 通知をタップすると、このコールバックが発火する。
    });

    return () => {
      receivListener.remove();
      responseListener.remove();
    }
  })

  return null;
}