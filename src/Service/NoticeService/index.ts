import {
  cancelScheduledNotificationAsync,
  NotificationRequestInput,
  scheduleNotificationAsync,
} from "expo-notifications";
import { NotificationContentInput } from "expo-notifications/src/Notifications.types";
import dayjs from "dayjs";
import {getNoticesOnlyFutureAndNotComplete, updateNoticeAsync} from "../../IO/SQLite";
import { remindToNotice } from "./dto";
import { Remind, RepeatSetting } from "../../Component/RemindMe/lib";
import { insertNotice } from "../../../database";

export interface INoticeService {
  registerNotices: (
    masterId: number,
    remind: Remind,
    repeatSetting: RepeatSetting,
    aDate?: dayjs.Dayjs
  ) => Promise<void>;
  registerNotice: (
    masterId: number,
    remind: Remind,
    aDate?: dayjs.Dayjs
  ) => Promise<void>;
  updateNotice: (masterId: number, remind: Remind) => Promise<void>;
  completeNotice: (masterId: number, noticeDate: string) => Promise<void>;
}

export interface registerProp extends NotificationRequestInput {}

export interface contentProp extends NotificationContentInput {}

export const toRegisterDto = (
  trigger: Date | null,
  content: contentProp
): registerProp => ({
  content,
  trigger,
});

export type NotificationId = string;

const register = async (
  requestInput: registerProp
): Promise<NotificationId> => {
  return await scheduleNotificationAsync(requestInput);
};

const updateSchedule = async (
  notificationId: NotificationId,
  notificationRequest: NotificationRequestInput
): Promise<NotificationId> => {
  await cancelScheduledNotificationAsync(notificationId);
  return await scheduleNotificationAsync(notificationRequest);
};

const registerNotice = async (
  masterId: number,
  remind: Remind,
  aDate?: dayjs.Dayjs
) => {
  const targetDate = (aDate ?? dayjs())
    .add(1, "day")
    .hour(7)
    .minute(0)
    .second(0);
  const notificationId = await register(
    remindToNotice(remind, masterId, targetDate.toDate())
  );

  await insertNotice(
    masterId,
    notificationId,
    targetDate.format("YYYY-MM-DD").toString()
  );
};

const registerNotices = async (
  masterId: number,
  remind: Remind,
  repeatSetting: RepeatSetting,
  aDate?: dayjs.Dayjs
) => {
  const baseDate = (aDate ?? dayjs()).hour(7).minute(0).second(0);
  for (const addDayCount of repeatSetting.getCurrentSetting().interval) {
    const targetDate = baseDate.add(addDayCount, "day");
    const notificationId = await register(
      remindToNotice(remind, masterId, targetDate.toDate())
    );

    await insertNotice(
      masterId,
      notificationId,
      targetDate.format("YYYY-MM-DD").toString()
    );
  }
};

const updateNotice = async (masterId: number, remind: Remind) => {
  // 翌日以降の通知のリフレッシュを行う。
  const today = dayjs().format("YYYY-MM-DD").toString();
  const noticeDatas = await getNoticesOnlyFutureAndNotComplete(masterId, today);
  if (noticeDatas === null) return;

  for (const notice of noticeDatas) {
    const { notificationId, noticeDate: noticeDateStr } = notice;
    const noticeDate = dayjs(noticeDateStr).toDate();
    await updateSchedule(
      notificationId,
      remindToNotice(remind, masterId, noticeDate, notificationId)
    );
  }
};

const completeNotice = async (masterId: number, noticeDate: string) => {
  await updateNoticeAsync(masterId, noticeDate);
}

export const NoticeService: INoticeService = {
  registerNotices: registerNotices,
  registerNotice: registerNotice,
  updateNotice: updateNotice,
  completeNotice: completeNotice
};
