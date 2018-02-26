import { dateToFormatString } from "../dateToFormatString";
import { getNotice } from "../database";

export function initializeCalender(target) {
  const self = target
  
  createEmptyCalender().then((items) => {
    //console.log('createEmptyCalender : ', items)
    
    const setCalender = (array) => {
      for (let i = 0; i < array.length; i++) {
        const select = array[i].noticeDate
        const item = {
          name: array[i].id
        }
        items[select].push(item)
      }
      self.setState({ items })
      console.log('items : ', items)
    }
    getNotice(setCalender)
  })

}


async function createEmptyCalender() {
  let loadedMonth = {}
  for (let i = -30; i <= 30; i++) {
    let tmpDate = new Date()
    tmpDate.setDate(tmpDate.getDate() + i)
    loadedMonth[dateToFormatString(tmpDate, '%YYYY%-%MM%-%DD%')] = []
  }
  return loadedMonth
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

