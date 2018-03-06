import { Constants, Notifications, Permissions } from 'expo';
import { insertNotice } from "./database";
import { dateToFormatString } from "./dateToFormatString";

export async function cancelNotification(notificationId) {
  Notifications.cancelScheduledNotificationAsync(notificationId)
}

// notificationId の配列を返す
export async function registerNotification(notification, registerdDate, notificationDates) {
  return new Promise(resolve => {
    let notificationIdList = []
    for (let i=0,j=notificationDates.length; i < j; i++) {
      //const schedulingOptions = { time: testChangeDate(registerdDate, notificationDates[i]) }
      const schedulingOptions = { time: changeDate(registerdDate, notificationDates[i]) }
      Notifications.scheduleLocalNotificationAsync(
        notification, schedulingOptions
      ).then((notificationId) => {
        notificationIdList.push(notificationId)
      })
    }
    return notificationIdList
  })
}

async function changeDate(registerdDate, afterDay) {
  let tmpDate = new Date(registerdDate)
  // 通知する日時をセットする
  tmpDate.setDate(registerdDate.getDate() + afterDay)
  tmpDate.setHours(7)
  tmpDate.setMinutes(0)
  tmpDate.setSeconds(0)
  return tmpDate
}

async function testChangeDate(registerdDate, afterDay) {
  let tmpDate = new Date(registerdDate)
  // 通知する日時をセットする
  tmpDate.setDate(tmpDate.getDate())
  //tmpDate.setHours(7)
  tmpDate.setMinutes(tmpDate.getMinutes() + 1)
  tmpDate.setSeconds(0)
  tmpDate.setMilliseconds(0)
  console.log(tmpDate)
  return tmpDate
}

// 通知用オブジェクトの生成
export async function createNotificationObject(dataObject) {
  // 通知API用のパラメータ初期値
  let notification = {
    android: {
      sound: true,
    },
    ios: {
      sound: true,
    },
  }
  notification['title'] = dataObject.title !== null ? dataObject.title : ''
  notification['body'] = dataObject.body !== null ? (
    `本日は p. ${dataObject.page.startPage} ~ p. ${dataObject.page.endPage} を復習しましょう。` ) : (
    `本日は ${dataObject.title} を復習しましょう。` )
  notification['data'] = dataObject
  return notification
}

async function sampleSetNotification(id, notification) {
  const localnotification = notification
  const registerdDate = notification.registerd
  const notificationDates = [
    1,
    7,
    30
  ]
  for (let i = 0; i < notificationDates.length; i++) {
    const schedulingOptions = { time: testChangeDate(registerdDate, notificationDates[i]) };
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    ).then(async function (notificationId) {
      // 非同期処理成功
      //addNotice(localnotification, schedulingOptions.time, notificationId)
      const registerdDate = dateToFormatString(schedulingOptions.time, '%YYYY%-%MM%-%DD%')
      //console.log('insert notice ::: ', registerdDate)
      insertNotice(id, notificationId, registerdDate)
    }).catch(function (error) {
      console.log(error)
    })
  }
  return
}

