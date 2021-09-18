import {DeviceType, getDeviceTypeAsync} from "expo-device";

let deviceType: DeviceType;

// 必ず先頭で呼ぶことで、後続の処理が同期的に取得可能となる。
export const gettingDeviceType = async () => {
  const result = await getDeviceTypeAsync();
  console.debug("got DeviceType: ", DeviceType[result]);

  deviceType = result;
}

/**
 * デバイスの種類を示す。但しファイル直下で呼び出しは禁止。
 */
export const getDeviceType = () => {
  if (deviceType === undefined) {
    console.debug("初期化せずに呼び出し。");
    return DeviceType.PHONE;
  } else {
    return deviceType;
  }
}