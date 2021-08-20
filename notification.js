import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export async function cancelNotification(notificationId) {
  Platform.select({
    ios: () => Notifications.cancelScheduledNotificationAsync(notificationId),
    android: () => Notifications.dismissNotificationAsync(notificationId),
  });
}

// notificationId の配列を返す
export async function registerNotification(
  notification,
  registerdDate,
  notificationDates
) {
  return new Promise((resolve) => {
    const notificationIdList = [];
    for (let i = 0, j = notificationDates.length; i < j; i++) {
      //const schedulingOptions = { time: testChangeDate(registerdDate, notificationDates[i]) }
      // const schedulingOptions = {
      //   time: changeDate(registerdDate, notificationDates[i]),
      // };
      // Notifications.scheduleLocalNotificationAsync(
      //   notification,
      //   schedulingOptions
      // ).then((notificationId) => {
      //   notificationIdList.push(notificationId);
      // });
      const notificationRequestInput = {
        content: notification,
        trigger: changeDate(registerdDate, notificationDates[i]),
      };

      schedulePushNotification(notificationRequestInput).then(
        (notificationId) => notificationIdList.push(notificationId)
      );
    }

    resolve(notificationIdList);
  });
}

async function changeDate(registerdDate, afterDay) {
  let tmpDate = new Date(registerdDate);
  // 通知する日時をセットする
  tmpDate.setDate(registerdDate.getDate() + afterDay);
  tmpDate.setHours(7);
  tmpDate.setMinutes(0);
  tmpDate.setSeconds(0);
  return tmpDate;
}

// function testChangeDate(registerdDate, afterDay) {
//   let tmpDate = new Date(registerdDate);
//   // 通知する日時をセットする
//   tmpDate.setDate(tmpDate.getDate());
//   //tmpDate.setHours(7)
//   tmpDate.setMinutes(tmpDate.getMinutes() + 1);
//   tmpDate.setSeconds(0);
//   tmpDate.setMilliseconds(0);
//   console.log(tmpDate);
//   return tmpDate;
// }

// 通知用オブジェクトの生成
export async function createNotificationObject(dataObject) {
  // 通知API用のパラメータ初期値
  let notification = {
    sound: true,
  };
  notification["title"] = dataObject.title !== null ? dataObject.title : "";
  notification["body"] =
    dataObject.body !== null
      ? `本日は p. ${dataObject.page.startPage} ~ p. ${dataObject.page.endPage} を復習しましょう。`
      : `本日は ${dataObject.title} を復習しましょう。`;
  notification["data"] = dataObject; // TODO あやしい
  return notification;
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function schedulePushNotification(notificationRequestInput) {
  return await Notifications.scheduleNotificationAsync(notificationRequestInput);
}

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}