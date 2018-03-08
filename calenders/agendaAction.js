import { dateToFormatString } from "../dateToFormatString";
import { getNotice, getMaster, getParams, testGetTitle, getSpecificNotice, changeNotice } from "../database";
import { registerNotification, cancelNotification, createNotificationObject } from "../notification";

export async function initializeCalender(target) {
  const self = target
  let items = {}
  items = await createEmptyCalender()
  let noticeArray = []
  noticeArray =  await getNotice()
  let itemsObj = {}
  itemsObj = await makeItems(items, noticeArray)
  self.setState({ items: itemsObj })
}


async function createEmptyCalender() {
  let loadedMonth = {}
  for (let i = -30; i <= 35; i++) {
    let tmpDate = new Date()
    tmpDate.setDate(tmpDate.getDate() + i)
    loadedMonth[dateToFormatString(tmpDate, '%YYYY%-%MM%-%DD%')] = []
  }
  return loadedMonth
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

// function changeDate(registerdDate, date) {
//   let tmpDate = new Date(registerdDate)
//   // 通知する日時をセットする
//   tmpDate.setDate(registerdDate.getDate() + date)
//   tmpDate.setHours(7)
//   tmpDate.setMinutes(0)
//   tmpDate.setSeconds(0)
//   return tmpDate
// }

