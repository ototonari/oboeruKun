// those actions need when this app was update.
import {
  updateBuildNumber,
  getBuildNumber,
  initializeUpdateTable,
  initDB,
  showNotificationTable,
  dropNotificationTable,
  insertMaster,
  insertPage,
  insertNotice,
} from "./database";
import Constants from "expo-constants";
import { Actions } from "react-native-router-flux";
import { dateToFormatString } from "./dateToFormatString";
import {requestNotificationPermission} from "./notification";

const currentBuildNumber = Constants.manifest.ios.buildNumber;

export async function initialize() {
  await initDB();
  let buildNumber = await getBuildNumber();
  //console.log(buildNumber)
  if (buildNumber.length > 0) {
    buildNumber = buildNumber[0].buildNumber;
  } else {
    // first run
    buildNumber = "1.0.0";
    // update管理用のrowを追加する
    await initializeUpdateTable();
  }
  updateChecker(buildNumber);
}

function updateChecker(buildNumber) {
  console.log("current: " + currentBuildNumber, "hitV: " + buildNumber);
  if (buildNumber == currentBuildNumber) {
    // 最新版
    console.log("this is current version.");
    //versionChange('1.0.3')
    return;
  } else {
    // バージョンアップ処理を行う
    update();
  }
}

// function checkBuildNumber() {
//   func = (array) => {
//     console.log(array.length);
//   };
//   getBuildNumber(func);
// }

async function update() {
  console.log("update process.");
  await transferDataToNewTable();
  await versionChange(currentBuildNumber);
  startTutorial();
}

async function versionChange(versionNumber) {
  let buildNumber = "1.0.0";
  if (versionNumber !== null) buildNumber = versionNumber;
  await updateBuildNumber(buildNumber);
}

export function startTutorial() {
  Actions.tutorial();
}

export async function endTutorial() {
  await requestNotificationPermission();
  Actions.reset("tabbar");
}

async function transferDataToNewTable() {
  let array = await showNotificationTable();
  if (array == null || array.length == 0) {
    console.log("exit notification");
    return;
  }
  console.log("start transfer data");
  //console.log('debugShowTable : ', array)
  for (let i = 0, j = array.length; i < j; i++) {
    const title = array[i].title;
    const page = array[i].page;
    const noticeDate = dateToFormatString(
      new Date(array[i].noticeDate),
      "%YYYY%-%MM%-%DD%"
    );
    const notificationId = array[i].notificationId;
    const debugItem = {
      title: title,
      page: page,
      noticeDate: noticeDate,
      notificationId: notificationId,
    };
    console.log("item:", debugItem);

    console.log("start: incertMaster");
    const id = await insertMaster(title);
    console.log("done: insertMaster");

    console.log("start: insertNotice");
    await insertNotice(id, notificationId, noticeDate);
    console.log("done: insertNotice");

    if (page !== null) {
      console.log("start: insertPage");
      await insertPage(id, page);
      console.log("done: insertPage");
    } else {
      console.log("skip: insertPage");
    }

    console.log("dropTable: notification");
    await dropNotificationTable();

    console.log("done transfer data");
  }
}

// async function getiOSNotificationPermission() {
//   const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//   if (status !== "granted") {
//     await Permissions.askAsync(Permissions.NOTIFICATIONS);
//   }
// }
