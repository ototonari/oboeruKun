import {Remind, RepeatSetting} from "../Component/RemindMe/lib";
import {RemindService} from "../Service/RemindService";
import {checkTitle, insertMaster} from "../../database";
import {NoticeService} from "../Service/NoticeService";

interface IUseCase {
  registerRemind: (
    remind: Remind,
    repeatSetting: RepeatSetting,
    canUseRange: boolean,
    canUseMemo: boolean,
    canUseRepeat: boolean
  ) => Promise<void>;
  updateRemind: (masterId: number, after: Remind, before: Remind) => Promise<void>;
  completeNotice: (masterId: number, noticeDate: string) => Promise<void>;
  debug: () => Promise<void>;
}

export const UseCase: IUseCase = {
  registerRemind,
  updateRemind,
  completeNotice,
  debug
}

async function registerRemind(
  remind: Remind,
  repeatSetting: RepeatSetting,
  canUseRange: boolean,
  canUseMemo: boolean,
  canUseRepeat: boolean
) {
  checkTitle(remind.title);
  const masterId = await insertMaster(remind.title);

  await RemindService.register(masterId, remind, repeatSetting, canUseRange, canUseMemo);

  if (canUseRepeat) {
    await NoticeService.registerNotices(masterId, remind, repeatSetting);
  } else {
    await NoticeService.registerNotice(masterId, remind);
  }
}

async function updateRemind(
  masterId: number,
  after: Remind,
  before: Remind
) {
  await RemindService.update(masterId, after, before);
  await NoticeService.updateNotice(masterId, after);
}

async function completeNotice(masterId: number, noticeDate: string) {
  await NoticeService.completeNotice(masterId, noticeDate);
}

async function debug() {

}