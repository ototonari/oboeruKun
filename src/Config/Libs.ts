// どこに置いていいか分からないものを置く場所。
// カテゴライズ可能なレベルになると、ここから出ていく想定。

import Constants from "expo-constants";
import { assetsPreLoader } from "./Assets";
import { initDB } from "../../database";
import { localStorage } from "../IO/LocalStorage";
import { gettingDeviceType } from "./DeviceType";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const getCurrentAppVersion = (): string => {
  return Constants.manifest?.version ? Constants.manifest.version : "1.00";
};

export const initialization = async () => {
  await gettingDeviceType();
  await assetsPreLoader();
  const versionOpt = await localStorage.GetAppVersion();
  if (versionOpt === null) {
    // 初回ユーザー又は、既存ユーザーでストアアップデートした
    const version = getCurrentAppVersion();
    await localStorage.SetAppVersion(version);
    await initDB();
  }
};

export const hasShownTutorials = async () => {
  const statusOpt = await localStorage.GetTutorialStatus();
  return statusOpt !== null;
};

export const alreadyShownTutorials = async () => {
  await localStorage.SetTutorialStatus(true);
};

export function str2int(value: string): number {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value);
  } else {
    return 0;
  }
}
