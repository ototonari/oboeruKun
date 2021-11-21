import { Remind, RepeatSetting } from "../../Component/RemindMe/lib";
import {
  deleteMemoAsync,
  deleteRangeAsync,
  getMemoAsync,
  getRangeAsync,
  insertMemoAsync,
  insertRangeAsync,
  updateMemoAsync,
  updateRangeAsync,
  updateTitleAsync,
} from "../../IO/SQLite";
import { checkTitle, insertMaster } from "../../../database";
import { NoticeService } from "../NoticeService";

export interface IRemindService {
  register: (
    remind: Remind,
    repeatSetting: RepeatSetting,
    canUseRange: boolean,
    canUseMemo: boolean,
    canUseRepeat: boolean
  ) => Promise<void>;
  update: (masterId: number, after: Remind, before: Remind) => Promise<void>;
}

// Remindを通知と保存を行う。
const registerRemind = async (
  remind: Remind,
  repeatSetting: RepeatSetting,
  canUseRange: boolean,
  canUseMemo: boolean,
  canUseRepeat: boolean
) => {
  console.log(remind.title);
  checkTitle(remind.title);
  const masterId = await insertMaster(remind.title);

  if (canUseRange) {
    const pageInfo = JSON.stringify({
      startPage: remind.range.start,
      endPage: remind.range.end,
    });
    await insertRangeAsync(masterId, pageInfo);
  }
  if (canUseMemo) {
    await insertMemoAsync(masterId, remind.memo);
  }

  if (canUseRepeat) {
    await NoticeService.registerNotices(masterId, remind, repeatSetting);
  } else {
    await NoticeService.registerNotice(masterId, remind);
  }
};

const update = async (masterId: number, after: Remind, before: Remind) => {
  if (after.areEqual(before)) return;

  if (!after.areEqualTitle(before)) {
    await updateTitleAsync(masterId, after.title);
  }

  if (!after.areEqualRange(before)) {
    if (after.isUseRange()) {
      const pageInfo = JSON.stringify({
        startPage: after.range.start,
        endPage: after.range.end,
      });

      if ((await getRangeAsync(masterId)) !== null) {
        await updateRangeAsync(masterId, pageInfo);
      } else {
        await insertRangeAsync(masterId, pageInfo);
      }
    } else {
      await deleteRangeAsync(masterId);
    }
  }

  if (!after.areEqualMemo(before)) {
    if (after.isUseMemo()) {
      if ((await getMemoAsync(masterId)) !== null) {
        await updateMemoAsync(masterId, after.memo);
      } else {
        await insertMemoAsync(masterId, after.memo);
      }
    } else {
      await deleteMemoAsync(masterId);
    }
  }
};

// 外部提供用
export const RemindService: IRemindService = {
  register: registerRemind,
  update: update,
};
