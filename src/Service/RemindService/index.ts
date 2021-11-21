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

export interface IRemindService {
  register: (
    masterId: number,
    remind: Remind,
    repeatSetting: RepeatSetting,
    canUseRange: boolean,
    canUseMemo: boolean,
  ) => Promise<void>;
  update: (masterId: number, after: Remind, before: Remind) => Promise<void>;
}

// Remindを通知と保存を行う。
const registerRemind = async (
  masterId: number,
  remind: Remind,
  repeatSetting: RepeatSetting,
  canUseRange: boolean,
  canUseMemo: boolean,
) => {
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
};

const updateSpecificRemind = async (masterId: number, after: Remind, before: Remind) => {
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
  update: updateSpecificRemind,
};
