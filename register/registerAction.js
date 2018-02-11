import React, { Component } from 'react';
import { Alert, View, Picker, TouchableOpacity, Text } from 'react-native';
import { Constants, Notifications, Permissions } from 'expo';
import { Actions } from "react-native-router-flux";
import { selectAll, insertInto, addTaskData, addNotice, checkTitle, getTitle } from "../database";
import styles from "./registerStyle";


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
  checkTitle(title)

  // Notification API に登録
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
    7,
    30
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


function changeDate(registerdDate, date) {
  let tmpDate = new Date(registerdDate)
  // 通知する日時をセットする
  tmpDate.setDate(registerdDate.getDate() + date)
  tmpDate.setHours(7)
  tmpDate.setMinutes(0)
  tmpDate.setSeconds(0)
  return tmpDate
}

export function renderPageModalContent(target) {
  const self = target
  let func = null
  let selected = null
  const modalNumber = self.state.visibleModal
  if (self.state.visibleModal === 1) {
    func = (page) => {
      self.setState({startPage: page})
      if (Number(page) > Number(self.state.endPage)) {
        self.setState({endPage: page})
      }
    }
    selected = self.state.startPage
  } else if (self.state.visibleModal === 2) {
    func = (page) => {
      if (Number(page) < Number(self.state.startPage)) {
        page = self.state.startPage
      }
      self.setState({endPage: page})
    }
    selected = self.state.endPage
  }
  return (
    <View style={styles.container.pageModal} >
      <Picker onValueChange={ (value) => func(value)} selectedValue = {selected} >
        { _renderPickerItems(modalNumber) }
      </Picker>
      <TouchableOpacity onPress={() => self.setState({visibleModal: null})}>
        <View style={styles.styles.modalButton}>
          <Text style={styles.styles.registerText} >決定</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

function _renderPickerItems(modalNumber) {
  if (modalNumber == 1 || modalNumber == 2) {
    const srvItems = []
    for (let i = 1; i <= 500 ; i++){
      srvItems.push(<Picker.Item key={String(i)} label = {String(i)} value = {String(i)} />)
    }
    return srvItems
  }
}

export function renderTitleModalContent(target) {
  const self = target
  let func = null
  let selected = null
  return (
    <View style={styles.container.pageModal} >
      <Picker onValueChange={ (value) => func(value)} selectedValue = {selected} >
        { _renderTitlePickerItems(self) }
      </Picker>
      <TouchableOpacity onPress={() => self.setState({visibleModal: null})}>
        <View style={styles.styles.modalButton}>
          <Text style={styles.styles.registerText} >決定</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

function _renderTitlePickerItems(target) {
  const self = target
  const srvItems = self.state.titleList.map( (value, index) => {
    return (<Picker.Item key={String(index)} label = {String(index)} value = {String(index)} />)
  })
  return srvItems
}

function testCallback(array) {
  console.log(array)
  return (<Picker.Item key={String(1)} label = {String(1)} value = {String(1)} />)
}