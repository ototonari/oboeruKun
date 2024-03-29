import * as Localization from "expo-localization";

enum LocaleType {
  JP = "JP",
  EN = "EN",
}

const jpregex = /ja|JP/;

let currentLocaleType: LocaleType;

const localeSets = {
  [LocaleType.JP]: {
    scene: {
      agenda: "カレンダー",
      config: "設定",
      register: "登録画面",
      developer: "開発者情報",
      titleList: "タイトル履歴",
      noticeSetting: "通知間隔の設定",
      tutorial: "チュートリアル",
      privacyPolicy: {
        configText: "プライバシーポリシー",
        alertTitle: "プライバシーポリシーに移動します",
        alertText: "",
      },
    },
    agenda: {
      localeConfig: {
        monthNames: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        monthNamesShort: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        dayNames: ["日", "月", "火", "水", "木", "金", "土"],
        dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
        today: "今日",
      },
    },
    register: {
      title: "タイトル",
      page: "ページ範囲",
      memo: "メモ",
      repeat: "反復学習",
      repeatLabel: "反復方法",
      notice: "通知する",
      registerButton: "登録",
      done: "登録しました",
      errTitle: "タイトルを入力してください。",
      pickerFirstItem: "選択して下さい",
      pickerNoItem: "履歴がありません",
      cancel: "戻る",
      edit: "保存",
    },
    registerSetting: {
      title: "タイトル",
      registerButton: "登録",
      registerLabel: "日後に復習する",
      errTitle: "タイトルを入力してください。",
      errItem: "復習間隔を追加してください。",
      done: "登録しました",
    },
    data: {
      page: "範囲",
      memo: "メモ",
      done: "登録しました",
    },
    titleList: {
      emptyText: "履歴はありません",
    },
    sample: {
      title: "忘却曲線に基づいた復習",
    },
  },
  [LocaleType.EN]: {
    scene: {
      agenda: "Calendar",
      config: "Config",
      register: "Register",
      developer: "Developers",
      titleList: "Title Remind",
      noticeSetting: "Repetitive Config",
      tutorial: "Tutorial",
      privacyPolicy: {
        configText: "Privacy Policy",
        alertTitle: "Jump to Web page of Privacy Policy.",
        alertText: "",
      },
    },
    agenda: {
      localeConfig: {
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthNamesShort: [
          "Jan.",
          "Feb.",
          "Mar.",
          "Apr.",
          "May.",
          "Jun.",
          "Jul.",
          "Aug.",
          "Sep.",
          "Oct.",
          "Nov.",
          "Dec.",
        ],
        dayNames: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        today: "today",
      },
    },
    register: {
      title: "Title",
      page: "Page number",
      memo: "Note",
      repeat: "Repetitive learning",
      repeatLabel: "Repetitive method",
      notice: "Notification",
      registerButton: "Register",
      done: "Register success.",
      errTitle: "Please input title.",
      pickerFirstItem: "Please select.",
      pickerNoItem: "No history.",
      cancel: "Cancel",
      edit: "Save",
    },
    registerSetting: {
      title: "Title",
      registerButton: "Register",
      registerLabel: "day after, Do repeat.",
      errTitle: "Please input title.",
      errItem: "Please add repeat day.",
      done: "Register success.",
    },
    data: {
      page: "Range",
      memo: "Note",
      done: "Register success.",
    },
    titleList: {
      emptyText: "No history",
    },
    sample: {
      title: "Forgetting curve",
    },
  },
};

// 宣言する場所はここで固定、だる。
const initLocale = () => {
  const result = Localization.locale;
  if (jpregex.test(Localization.locale)) {
    currentLocaleType = LocaleType.JP;
  } else {
    currentLocaleType = LocaleType.EN;
  }
  console.debug("current locale is: ", currentLocaleType, result);

  return localeSets[LocaleType[currentLocaleType]];
};

export const locale = initLocale();

export const getLocaleType = () => currentLocaleType;

export const isJP = () => currentLocaleType === LocaleType.JP;
