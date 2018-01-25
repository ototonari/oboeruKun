import { Alert } from 'react-native';
import { Constants, Notifications, Permissions } from 'expo';
import { Actions } from "react-native-router-flux";
import { selectAll, insertInto, addTaskData, addNotice } from "../database";


export function validation(target, callback) {
  const self = target
  
  // エラー処理
  if (self.state.title === '') {
    self.setState({titleError: 'タイトルを入力してください'})
    return;

  } else {
    self.setState({titleError: ''})
    // コールバックに投げる
    if (callback) {
      callback(self)
    }
  }
}

export function registerTask(target) {
  const self = target

  const title = self.state.title
  let body = self.state.title + '  p.' + self.state.startPage + '  ~  ' + 'p.' + self.state.endPage + '\n'
  body += '本日は「 ' + self.state.title + ' 」を復習しましょう。'

  // dbの性質上、textで格納する
  const page = self.state.page === true ? JSON.stringify({ startPage: self.state.startPage, endPage: self.state.endPage }) : JSON.stringify(null)

  const registerdDate = new Date()
  // notification に投げるためのデータ作成
  let taskData = {
    title: title,
    body: body,
    page: page,
    data: {
      title: title,
      body: body,
      page: page,
    },
    android: {
      sound: true,
    },
    ios: {
      sound: true,
    },
    registerd: registerdDate,

  }

  // db
  //addTaskData(taskData)

  // Notification API に登録
  //notificationTestCalls(taskData)
  notificationBasedOnForgettingCurve(taskData)

  // ユーザーに通知
  Alert.alert('登録しました')
  Actions.pop()
}

// NotificationAPIを叩くメソッド
//  通知間隔の処理を挟んで、複数登録する。
function addNotification(taskData) {
  const localnotification = taskData;

  // 通知間隔を分離して管理する
  
}

async function notificationBasedOnForgettingCurve(notification) {
  const localnotification = notification
  const registerdDate = notification.registerd
  const notificationDates = [
    1,
    3,
    7,
    14
  ]
  for (let i = 0; i < notificationDates.length; i++) {
    const schedulingOptions = { time: changeDate(registerdDate, notificationDates[i]) };
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    ).then(function (notificationId) {
      // 非同期処理成功
      addNotice(localnotification, schedulingOptions.time, notificationId)
    }).catch(function (error) {
      console.log(error)
    })
  }
}

async function notificationTestCalls(notification) {
  const localnotification = notification
  let sendAfterFiveSeconds = localnotification.registerd
  
  // とりあえず、前回からの差分のパラメーターを入力せよ
  const notificationSeconds = [
    10,
    20,
    30
  ]
  for (let i = 0; i < notificationSeconds.length; i++) {
    const schedulingOptions = { time: changeSeconds(sendAfterFiveSeconds, notificationSeconds[i]) };
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    ).then(function (value) {
      // 非同期処理成功
      //console.log('notificationId' + value)
      addNotice(localnotification, schedulingOptions.time, value)
    }).catch(function (error) {
      // 非同期処理失敗。
      console.log(error)
    })
  }
}

function changeSeconds (registerdDate, seconds) {
  let tmpDate = new Date(registerdDate)
  tmpDate.setSeconds(registerdDate.getSeconds() + seconds)
  return tmpDate
}

function changeDate(registerdDate, date) {
  let tmpDate = new Date(registerdDate)
  // 通知する日時をセットする
  tmpDate.setDate(registerdDate.getDate() + date)
  tmpDate.setHours(7)
  tmpDate.setMinutes(0)
  tmpDate.setSeconds(0)
  return tmpDate
}