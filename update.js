// those actions need when this app was update.
import { AsyncStorage } from 'react-native';
import { createUpdateTable, updateBuildNumber, getBuildNumber, initializeUpdateTable, initDB, showNotificationTable, dropNotificationTable,insertMaster, insertPage, insertNotice } from "./database";
import { Constants, Notifications, Permissions } from 'expo';
import { Actions, ActionConst } from "react-native-router-flux";
import { dateToFormatString } from "./dateToFormatString";

const currentBuildNumber = Constants.manifest.ios.buildNumber

export function initialize() {
  initDB()
  setup = (array) => {
    const hitCount = array.length
    // initialize
    if (hitCount === 0) {
      // データベースにヒットなし
      console.log('no hit')
      initializeUpdateTable(updateChecker)
    } else if (hitCount > 0) {
      // データベースにヒットあり
      console.log('hit!')
      const buildNumber = array[0].buildNumber
      updateChecker(buildNumber)
    }
  }
  createUpdateTable(setup)
}

function updateChecker(buildNumber) {
  console.log('current: '+currentBuildNumber, 'hitV: '+buildNumber)
  if (buildNumber == currentBuildNumber) {
    // 最新版
    console.log('this is current version.')
    //versionChange('1.0.3')
    return

  } else {
    // バージョンアップ処理を行う
    update()
  }
}

function checkBuildNumber() {
  func = (array) => {
    console.log(array.length)
  }
  getBuildNumber(func)
}

async function update() {
  console.log('update process.')
  startTutorial()
  await transferDataToNewTable()
  versionChange(currentBuildNumber)
}

function versionChange(versionNumber) {
  let buildNumber = '1.0.0'
  if (versionNumber !== null) buildNumber = versionNumber
  updateBuildNumber(buildNumber)
}

export function startTutorial() {
  Actions.tutorial()
}

export function endTutorial() {
  //Actions.tabbar({ type: ActionConst.PUSH_OR_POP })
  Actions.reset('tabbar')
  getiOSNotificationPermission()
}

async function transferDataToNewTable() {
  let array = await showNotificationTable()
  if (array == null || array.length == 0) { console.log('droped notification'); return }
  console.log('start transfer data')
  //console.log('debugShowTable : ', array)
  for(let i=0, j=array.length; i < j; i++) {
    const title = array[i].title
    const page = array[i].page
    const noticeDate = dateToFormatString(new Date(array[i].noticeDate), '%YYYY%-%MM%-%DD%')
    const notificationId = array[i].notificationId
    const debugItem = {
      title: title,
      page: page,
      noticeDate: noticeDate,
      notificationId: notificationId
    }
    console.log('item:',debugItem)

    console.log('start: incertMaster')
    const id = await insertMaster(title)
    console.log('done: insertMaster')

    console.log('start: insertNotice')
    await insertNotice(id, notificationId, noticeDate)
    console.log('done: insertNotice')

    if (page !== null) {
      console.log('start: insertPage')
      await insertPage(id, page)
      console.log('done: insertPage')
    } else {
      console.log('skip: insertPage')
    }

    console.log('dropTable: notification')
    await dropNotificationTable()

    console.log('done transfer data')
  }

}

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

