import { INoticeInterval } from "../../IO/SQLite";
import dayjs from "dayjs";
import { contentProp, toRegisterDto } from "../../Service/NoticeService";
import { locale } from "../../Config/Locale";

type Range = {
  start: number;
  end: number;
};

export interface IRemindUsageSituation {
  canUseRange: boolean;
  canUseMemo: boolean;
  isRepeatable: boolean;
  isNotice: boolean;
}

export const remindUsageSituationDto = (
  props: IRemindUsageSituation
): IRemindUsageSituation => {
  return {
    canUseMemo: props.canUseMemo,
    canUseRange: props.canUseRange,
    isRepeatable: props.isRepeatable,
    isNotice: props.isNotice,
  };
};

export interface IRemind {
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
        end: 0,
      };
      this.memo = "";
    }
  }

  clone = () => new Remind(this);

  isValid = () => {
    return this.title !== "";
  };

  validTitle = () => {
    return this.title !== "";
  };

  setTitle = (title: string) => {
    this.title = title;

    return new Remind(this);
  };

  setRange = (range: Range) => {
    this.range = range;

    return new Remind(this);
  };

  clearRange = () => {
    return this.setRange({
      start: 0,
      end: 0,
    });
  };

  isUseRange = (): boolean => {
    const { start, end } = this.range;
    return start !== 0 && end !== 0;
  };

  setStartRange = (num: number) => {
    this.range = {
      start: num,
      end: this.range.end,
    };

    return new Remind(this);
  };

  setEndRange = (num: number) => {
    this.range = {
      start: this.range.start,
      end: num,
    };

    return new Remind(this);
  };

  isUseMemo = (): boolean => {
    return this.memo !== "";
  };

  setMemo = (memo: string) => {
    this.memo = memo;

    return new Remind(this);
  };

  clearMemo = () => {
    return this.setMemo("");
  };

  toPrint = () => {
    console.log(this.title, this.range.start, this.range.end, this.memo);
  };

  toContent = (usageSituation: IRemindUsageSituation): contentProp => {
    const myself = new Remind(this);
    let body = "";

    if (usageSituation.canUseRange) {
      const { start, end } = this.range;
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
        remind: JSON.stringify(myself),
      },
    };
  };

  areEqualTitle = (aRemind: Remind): boolean => this.title === aRemind.title;

  areEqualRange = (aRemind: Remind): boolean => {
    const a = this.isUseRange();
    const b = aRemind.isUseRange();

    if (a && b) {
      return (
        this.range.start === aRemind.range.start &&
        this.range.end === aRemind.range.end
      );
    } else return !a && !b;
  };

  areEqualMemo = (aRemind: Remind): boolean => {
    const a = this.isUseMemo();
    const b = aRemind.isUseMemo();

    if (a && b) {
      return this.memo === aRemind.memo;
    } else return !a && !b;
  };

  areEqual = (aRemind: Remind): boolean =>
    this.areEqualTitle(aRemind) &&
    this.areEqualRange(aRemind) &&
    this.areEqualMemo(aRemind);
}

export interface IRepeatSetting {
  ownSettings: INoticeInterval[];
  currentId?: number;
}

export class RepeatSetting implements IRepeatSetting {
  ownSettings: INoticeInterval[];
  currentId: number;

  constructor(props?: IRepeatSetting) {
    if (props) {
      const { ownSettings, currentId } = props;
      if (ownSettings.length === 0)
        throw new Error("invalid settings. it must be at least 1 in length.");

      if (currentId) {
        this.ownSettings = ownSettings;
        this.currentId = currentId;
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
    return new RepeatSetting(this);
  };

  setOwnSettings = (settings: INoticeInterval[]) => {
    this.ownSettings = settings;
    return new RepeatSetting(this);
  };

  getCurrentSetting = () => {
    if (this.ownSettings.length === 0)
      throw new Error("invalid settings. it must be at least 1 in length.");
    return this.ownSettings[this.currentId - 1];
  };

  toNotification = (content: contentProp) => {
    if (this.ownSettings.length === 0)
      throw new Error("invalid settings. it must be at least 1 in length.");

    const today = dayjs().hour(7).minute(0).second(0);
    const notificationDates = this.getCurrentSetting().interval.map(
      (addDayCount) => today.add(addDayCount, "day").toDate()
    );

    return notificationDates.map((date) => toRegisterDto(date, content));
  };
}
