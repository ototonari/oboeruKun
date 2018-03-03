import { dateToFormatString } from "../dateToFormatString";
import { getNotice, getMaster, getParams, testGetTitle } from "../database";

export async function initializeCalender(target) {
  const self = target
  let items = {}
  items = await createEmptyCalender()
  let noticeArray = []
  noticeArray =  await getNotice()
  let itemsObj = {}
  itemsObj = await makeItems(items, noticeArray)
  //console.log('hogehgoehgoeeogh', items, noticeArray, itemsObj)
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

    console.log('setCalender title: ', title, ' page : ', page, ' memo : ', memo)
    const item = {
      id: id,
      noticeDate: day,
      title: title,
      page: page,
      memo: memo
    }
    items[day].push(item)
  }
  return items
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

