import { dateToFormatString } from "../../../dateToFormatString";
import { getNotice, getParams, getSpecificNotice } from "../../../database";
import {
  registerNotification,
  cancelNotification,
  createNotificationObject,
} from "../../../notification";
import { LocaleConfig } from "react-native-calendars";
import {isJP, locale} from "../../Config/Locale";

interface Day {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
}

interface NoticeProps {
  id: number;
  notificationId: null | any;
  noticeDate: string;
  done: number;
}

interface Items {
  [key: string]: [];
}

export async function initializeCalender(day: Day) {
  const rangeList = await getThisMonth(day);
  const items: Items = await rangeEmptyCalender(rangeList);
  const noticeArray: NoticeProps[] = await getNotice(rangeList);
  const itemsObj = await makeItems(items, noticeArray);
  return itemsObj;
}

async function rangeEmptyCalender(rangeList: [string, string]) {
  let makeDay = new Date(rangeList[0]);
  let makeString: string = dateToFormatString(makeDay, "%YYYY%-%MM%-%DD%");
  const endDay = new Date(rangeList[1]);
  const endString: string = dateToFormatString(endDay, "%YYYY%-%MM%-%DD%");
  // loadedMonth[makeString] = [];
  let loadedMonth: { [key: string]: [] } = {
    [makeString]: [],
  };
  //console.log('add item : ', makeString)
  //first incriment
  while (makeString !== endString) {
    makeDay.setDate(makeDay.getDate() + 1);
    makeString = dateToFormatString(makeDay, "%YYYY%-%MM%-%DD%");
    loadedMonth = {
      ...loadedMonth,
      [makeString]: [],
    };
    //console.log('add item : ', makeString)
  }
  return loadedMonth;
}

async function getThisMonth(day: Day): Promise<[string, string]> {
  if (day == null) {
    let thisMonth = new Date();
    thisMonth.setDate(1);
    const firstDay: string = dateToFormatString(thisMonth, "%YYYY%-%MM%-%DD%");
    thisMonth.setMonth(thisMonth.getMonth() + 2);
    thisMonth.setDate(thisMonth.getDate() - 1);
    const endDay: string = dateToFormatString(thisMonth, "%YYYY%-%MM%-%DD%");
    console.log("first Day ; ", firstDay, "end Day ; ", endDay);
    return [firstDay, endDay];
  } else {
    let thisMonth = new Date(day.dateString);
    thisMonth.setDate(1);
    const firstDay = dateToFormatString(thisMonth, "%YYYY%-%MM%-%DD%");
    thisMonth.setMonth(day.month + 1);
    thisMonth.setDate(thisMonth.getDate() - 1);
    const endDay = dateToFormatString(thisMonth, "%YYYY%-%MM%-%DD%");
    console.log("first Day ; ", firstDay, "end Day ; ", endDay);
    return [firstDay, endDay];
  }
}

async function makeItems(items: any, array: NoticeProps[]) {
  for (let i = 0; i < array.length; i++) {
    const id = array[i].id;
    const day = array[i].noticeDate;
    let title = await getParams("title", "master", id);
    let page = await getParams("value", "page", id);
    let memo = await getParams("value", "memo", id);
    title = title[0].title;
    page = page.length > 0 ? JSON.parse(page[0].value) : null;
    memo = memo.length > 0 ? memo[0].value : null;

    const item = {
      id: id,
      noticeDate: day,
      title: title,
      page: page,
      memo: memo,
    };
    //console.log('setCalender obj: ', item)
    items[day].push(item);
  }
  return items;
}

export async function changeNotification(
  item: { noticeDate: any; id: any },
  registerdDate: any
) {
  // キャンセル用通知Idの取得
  let notificationId;
  notificationId = await getSpecificNotice(item.noticeDate, item.id);
  notificationId = notificationId[0].notificationId;
  cancelNotification(notificationId).then(async () => {
    // キャンセル後、新たな通知を登録する
    let notification;
    notification = await createNotificationObject(item);
    let notificationId;
    notificationId = await registerNotification(notification, registerdDate, [
      1,
    ]);
    console.log(notificationId);
    // await changeNotice(item.noticeDate, notificationId, registerdDate, item.id)
  });
}

export function localization() {
  if (isJP()) {
    LocaleConfig.locales["jp"] = locale.agenda.localeConfig;
    LocaleConfig.defaultLocale = "jp";
  } else {
    LocaleConfig.locales["en"] = locale.agenda.localeConfig;
    LocaleConfig.defaultLocale = "en";
  }
}
