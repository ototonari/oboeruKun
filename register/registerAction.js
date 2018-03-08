import React, { Component } from 'react';
import { Alert, View, Picker, TouchableOpacity, Text } from 'react-native';
import { Constants, Notifications, Permissions } from 'expo';
import { Actions, ActionConst } from "react-native-router-flux";
import { selectAll, insertInto, addTaskData, addNotice, checkTitle, getTitle, insertPage, insertMemo, insertMaster, insertNotice } from "../database";
import styles from "./registerStyle";
import { dateToFormatString } from "../dateToFormatString";
import { registerNotification } from "../notification";

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

export async function arrangement(target) {
  const self = target

  // 各種パラメーターの定義
  // タイトル
  const title = self.state.title
  // ボディ
  let body = ''
  
  // 通知API用のパラメータ
  let notification = {
    android: {
      sound: true,
    },
    ios: {
      sound: true,
    },
  }
  
  // タイトル履歴に保存
  checkTitle(title)
  
  let id = 0
  // id登録後、callback処理にて各種データを登録、処理する
  id = await insertMaster(title)
  // notification用データ
  let data = { title: title }
  if (self.state.page == true) {
    // ページ範囲
    const page = JSON.stringify({ startPage: self.state.startPage, endPage: self.state.endPage })
    console.log(page)
    // dbに保存
    insertPage(id, page)
    data['page'] = page
    body += '本日は ' + 'p.' + self.state.startPage + '  ~  ' + 'p.' + self.state.endPage + ' を復習しましょう。'    
  }
  if (self.state.memo == true) {
    // memo Text
    const memo = self.state.memoValue
    // dbに保存
    insertMemo(id, memo)
    body += `\nメモ: ${memo}`
    data['memo'] = memo
  }
  if (self.state.notice == true) {
    notification['title'] = title
    notification['body'] = body
    notification['data'] = data
    await setNotification(id, notification)
    //Actions.tabbar({ type: ActionConst.PUSH_OR_POP })
    Alert.alert(
      '登録しました','',
      [{text: 'OK', onPress: () => {
        Actions.reset('tabbar')
        
      } }]
    )
  }
}

async function setNotification(id, notification) {
  const localnotification = notification
  const notificationDates = [
    1,
    7,
    30
  ]
  for (let i = 0; i < notificationDates.length; i++) {
    changeDate(notificationDates[i]).then((date) => {
      const schedulingOptions = { time: date }
      Notifications.scheduleLocalNotificationAsync(
        localnotification,
        schedulingOptions
      ).then(async function (notificationId) {
        // 非同期処理成功
        const registerdDate = dateToFormatString(date, '%YYYY%-%MM%-%DD%')
        //console.log('insert notice ::: ', registerdDate)
        await insertNotice(id, notificationId, registerdDate)
        console.log('notification added')
      }).catch(function (error) {
        console.log(error)
      })
    })
  }
  return
}

function changeDate(day) {
  return new Promise(resolve => {
    let tmpDate = new Date()
    tmpDate.setDate(tmpDate.getDate() + day)
    tmpDate.setHours(7,0,0,0)
    resolve(tmpDate)
  })
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
      <Picker onValueChange={ (value) => func(value) } selectedValue = {selected} style={{ width: '100%', height: 200 }} >
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

export function testRenderPageModalContent(target) {
  const self = target
  const flug = self.state.visibleModal
  let selected
  let pageSelectFunction
  // stargPage modal
  if (flug === 1) {
    selected = self.state.startPage
    pageSelectFunction = (page) => {
      self.setState({ startPage: selected})
    }
  } else if (flug === 2) {
    selected = self.state.endPage
    pageSelectFunction = (page) => {
      self.setState({ endPage: selected})
    }
  }
  return (
    <View style={styles.container.pageModal} >
      <Picker onValueChange={ (value) => pageSelectFunction(value) } selectedValue = {self.state.startPage} style={{ width: '100%', height: 200 }} >
        { _renderPickerItems(flug) }
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
  const titleList = self.state.titleList
  let selected = null
  let func = (value) => {
    self.setState({ title: value })
  }
  selected = self.state.title
  return (
    <View style={styles.container.pageModal} >
      <Picker onValueChange={ (value) => func(value)} selectedValue={selected} >
        { _renderTitlePickerItems(titleList) }
      </Picker>
      <TouchableOpacity onPress={() => self.setState({visibleModal: null})}>
        <View style={styles.styles.modalButton}>
          <Text style={styles.styles.registerText} >決定</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

function _renderTitlePickerItems(array) {
  const srvItems = []
  srvItems.push(<Picker.Item key={-1} label = {'選択してください'} value = {''} />)
  array.forEach( (value, index) => {
    srvItems.push(<Picker.Item key={index} label = {String(value.title)} value = {String(value.title)} />)
  })
  return srvItems
}

function testCallback() {
  const testArray = []
  testArray.push(<Picker.Item key={String(1)} label = {String(1)} value = {String(1)} />)
  return testArray
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

  // add to titleDB
  checkTitle(title)

  // add to masterDB and others

  // Notification API に登録
  notificationBasedOnForgettingCurve(taskData)

  // ユーザーに通知
  Alert.alert('登録しました')
  //Actions.reset('tabbar', { reload: true})
  //Actions.tabbar({ type: ActionConst.PUSH_OR_POP })
  //Actions.pop({reload: true})
  //Actions.tabbar({ type: ActionConst.PUSH_OR_POP });
  //Actions.tabbar({ type: ActionConst.REFRESH });
}

