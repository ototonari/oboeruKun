// those actions need when this app was update.
import { createUpdateTable, updateBuildNumber, getBuildNumber, initializeUpdateTable } from "./database";
import { Constants } from 'expo';

const currentBuildNumber = Constants.manifest.ios.buildNumber

export function initialize() {
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
    console.log('this version is current')
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

function update() {
  console.log('update process.')
  const dummyBuildNumber = '1.0.2'
  updateBuildNumber(dummyBuildNumber)
}