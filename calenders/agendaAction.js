import { dateToFormatString } from "../dateToFormatString";
import { getNotice, getMaster, getParams, testGetTitle, getSpecificNotice, changeNotice } from "../database";
import { registerNotification, cancelNotification, createNotificationObject } from "../notification";
import { LocaleConfig } from 'react-native-calendars';
import { locale, localeJSON } from "../components";


export async function initializeCalender(target, day) {
  const self = target
  let items = {}
  let rangeList
  rangeList = await getThisMonth(day)
  items = await rangeEmptyCalender(rangeList)
  let noticeArray = []
  noticeArray =  await getNotice(rangeList)
  let itemsObj = {}
  itemsObj = await makeItems(items, noticeArray)
  self.setState({ items: itemsObj })
}


async function rangeEmptyCalender(rangeList) {
  let loadedMonth = {}
  let makeDay = new Date(rangeList[0])
  let makeString = dateToFormatString(makeDay, '%YYYY%-%MM%-%DD%')
  const endDay = new Date(rangeList[1])
  const endString = dateToFormatString(endDay, '%YYYY%-%MM%-%DD%')
  loadedMonth[makeString] = []
  //console.log('add item : ', makeString)
  //first incriment
  while (makeString !== endString) {
    makeDay.setDate(makeDay.getDate() + 1)
    makeString = dateToFormatString(makeDay, '%YYYY%-%MM%-%DD%')
    loadedMonth[makeString] = []
    //console.log('add item : ', makeString)
  }
  return loadedMonth
}

async function getThisMonth (day) {
  //console.log('day: ', day)
  if (day == null) {
    
    let thisMonth = new Date()
    thisMonth.setDate(1)
    const firstDay = dateToFormatString( thisMonth, '%YYYY%-%MM%-%DD%')
    thisMonth.setMonth(thisMonth.getMonth() + 2)
    thisMonth.setDate(thisMonth.getDate() - 1)
    const endDay = dateToFormatString( thisMonth, '%YYYY%-%MM%-%DD%')
    console.log('first Day ; ', firstDay, 'end Day ; ', endDay)
    return [firstDay, endDay]

  } else {

    let thisMonth = new Date(day.dateString)
    thisMonth.setDate(1)
    const firstDay = dateToFormatString( thisMonth, '%YYYY%-%MM%-%DD%')
    thisMonth.setMonth(day.month + 1)
    thisMonth.setDate(thisMonth.getDate() - 1)
    const endDay = dateToFormatString( thisMonth, '%YYYY%-%MM%-%DD%')
    console.log('first Day ; ', firstDay, 'end Day ; ', endDay)
    return [firstDay, endDay]
  }
}


async function makeItems(items, array) {
  for (let i = 0; i < array.length; i++) {
    const id = array[i].id
    const day = array[i].noticeDate
    let title = await getParams('title', 'master', id)
    let page = await getParams('value', 'page', id)
    let memo = await getParams('value', 'memo', id)
    title = title[0].title
    page = page.length > 0 ? JSON.parse(page[0].value) : null
    memo = memo.length > 0 ? memo[0].value : null

    const item = {
      id: id,
      noticeDate: day,
      title: title,
      page: page,
      memo: memo
    }
    //console.log('setCalender obj: ', item)
    items[day].push(item)
  }
  return items
}

export async function changeNotification(item, registerdDate) {
  // キャンセル用通知Idの取得
  let notificationId
  notificationId = await getSpecificNotice(item.noticeDate, item.id)
  notificationId = notificationId[0].notificationId
  cancelNotification(notificationId).then(async () => {
    // キャンセル後、新たな通知を登録する
    let notification
    notification = await createNotificationObject(item)
    let notificationId
    notificationId = await registerNotification(notification, registerdDate, [1])
    console.log(notificationId)
    // await changeNotice(item.noticeDate, notificationId, registerdDate, item.id)
  })
}

export function localization() {
  console.log(`locale : ${locale.country}`)
  if (locale.country === "JP"){
    LocaleConfig.locales['jp'] = localeJSON.jp.agenda.localeConfig
    LocaleConfig.defaultLocale = 'jp';
  } else if (locale.country !== "JP") {

  }
  
}

// function changeDate(registerdDate, date) {
//   let tmpDate = new Date(registerdDate)
//   // 通知する日時をセットする
//   tmpDate.setDate(registerdDate.getDate() + date)
//   tmpDate.setHours(7)
//   tmpDate.setMinutes(0)
//   tmpDate.setSeconds(0)
//   return tmpDate
// }

