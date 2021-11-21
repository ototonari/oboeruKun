import { Remind } from "../../Component/RemindMe/lib";
import { locale } from "../../Config/Locale";
import { NotificationRequestInput } from "expo-notifications";
import {
  NotificationContentInput,
  NotificationTriggerInput,
} from "expo-notifications/src/Notifications.types";

export const remindToNotice = (
  remind: Remind,
  masterId: number,
  noticeDate: Date,
  identifier?: string
): NotificationRequestInput => {
  let body: string = "";

  if (remind.isUseRange()) {
    const { start, end } = remind.range;
    body += `${locale.data.page}: p.${start} ~ p.${end}\n`;
  }

  if (remind.isUseMemo()) {
    body += `${locale.data.memo}: ${remind.memo}`;
  }

  const content: NotificationContentInput = {
    sound: true,
    title: remind.title,
    body: body !== "" ? body : undefined,
    data: {
      masterId: masterId,
      noticeUnixTime: noticeDate.getTime(),
    },
  };

  const trigger: NotificationTriggerInput = {
    date: noticeDate,
  };

  return {
    content,
    trigger,
    identifier,
  };
};
