import {INoticeInterval} from "../../IO/SQLite";
import dayjs from "dayjs";
import {contentProp, register, toRegisterDto} from "../../Notification/register";
import {locale} from "../../Config/Locale";
import {checkTitle, insertMaster, insertMemo, insertNotice, insertPage} from "../../../database";
import {dateToFormatString} from "../../../dateToFormatString";
import {isDebugMode} from "../../Config/Libs";

type Range = {
  start: number;
  end: number
}

export interface IRemindUsageSituation {
  canUseRange: boolean;
  canUseMemo: boolean;
  isRepeatable: boolean;
  isNotice: boolean;
}

export const remindUsageSituationDto = (props: IRemindUsageSituation): IRemindUsageSituation => {
  return {
    canUseMemo: props.canUseMemo,
    canUseRange: props.canUseRange,
    isRepeatable: props.isRepeatable,
    isNotice: props.isNotice
  }
}

interface IRemind {
  title: string;
  range: Range;
  memo: string;
}

export class Remind implements IRemind {
  title: string;
  range: Range;
  memo: string;

  constructor(props?: IRemind) {
    if (props) {
      this.title = props.title;
      this.range = props.range;
      this.memo = props.memo;
    } else {
      this.title = "";
      this.range = {
        start: 0,
        end: 0
      };
      this.memo = "";
    }
  }

  isValid = () => {
    return this.title !== "";
  }

  setTitle = (title: string) => {
    this.title = title;

    return new Remind(this);
  }

  setRange = (range: Range) => {
    this.range = range;

    return new Remind(this);
  }

  setStartRange = (num: number) => {
    this.range = {
      start: num,
      end: this.range.end
    };

    return new Remind(this);
  }

  setEndRange = (num: number) => {
    this.range = {
      start: this.range.start,
      end: num
    }

    return new Remind(this);
  }

  setMemo = (memo: string) => {
    this.memo = memo;

    return new Remind(this)
  }

  toContent = (usageSituation: IRemindUsageSituation): contentProp => {
    const myself = new Remind(this);
    let body = "";

    if (usageSituation.canUseRange) {
      const {start, end} = this.range;
      body += `${locale.data.page}: p.${start} ~ p.${end}\n`;
    }

    if (usageSituation.canUseMemo) {
      body += `${locale.data.memo}: ${this.memo}`;
    }

    return {
      sound: true,
      title: this.title,
      body: body !== "" ? body : undefined,
      data: {
        remind: JSON.stringify(myself)
      }
    }
  }
}

export interface IRepeatSetting {
  ownSettings: INoticeInterval[];
  currentId?: number
}

export class RepeatSetting implements IRepeatSetting {
  ownSettings: INoticeInterval[]
  currentId: number

  constructor(props?: IRepeatSetting) {
    if (props) {
      const {ownSettings, currentId} = props
      if (ownSettings.length === 0) throw new Error("invalid settings. it must be at least 1 in length.");

      if (currentId) {
        this.ownSettings = ownSettings;
        this.currentId = currentId
      } else {
        this.ownSettings = ownSettings;
        this.currentId = 1;
      }
    } else {
      this.ownSettings = [];
      this.currentId = -1;
    }
  }

  setCurrentSetting = (id: number) => {
    this.currentId = id;
    return new RepeatSetting(this)
  }

  setOwnSettings = (settings: INoticeInterval[]) => {
    this.ownSettings = settings;
    return new RepeatSetting(this)
  }

  getCurrentSetting = () => {
    if (this.ownSettings.length === 0) throw new Error("invalid settings. it must be at least 1 in length.")
    return this.ownSettings[this.currentId - 1];
  }

  toNotification = (content: contentProp) => {
    if (this.ownSettings.length === 0) throw new Error("invalid settings. it must be at least 1 in length.")

    const today = dayjs().hour(7).minute(0).second(0);
    const notificationDates = this.getCurrentSetting()
    .interval.map((addDayCount) => today.add(addDayCount, "day").toDate())

    return notificationDates.map((date) => {
      if (isDebugMode()) {
        return toRegisterDto(null, content);
      } else {
        return toRegisterDto(date, content)
      }
    });
  }
}

/**
 * Remindを通知と保存を行う。
 * @param remind
 * @param repeatSetting
 * @param usageSituation
 */
export const remindService = async (remind: Remind, repeatSetting: RepeatSetting, usageSituation: IRemindUsageSituation) => {
  checkTitle(remind.title);
  const masterId = await insertMaster(remind.title);

  if (usageSituation.canUseRange) {
    const pageInfo = JSON.stringify({startPage: remind.range.start, endPage: remind.range.end});
    await insertPage(masterId, pageInfo);
  }

  if (usageSituation.canUseMemo) {
    await insertMemo(masterId, remind.memo);
  }

  const content = remind.toContent(usageSituation);
  const registerProps = repeatSetting.toNotification(content);

  for (const prop of registerProps) {
    let notificationId = null;
    if (usageSituation.isNotice) {
      notificationId = await register(prop);
    }

    if (!isDebugMode()) {
      const registeredDate = dateToFormatString(prop.trigger, "%YYYY%-%MM%-%DD%");
      await insertNotice(masterId, notificationId, registeredDate);
    }
  }
}