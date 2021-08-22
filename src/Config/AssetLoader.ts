import { Asset } from 'expo-asset';
import {Assets} from "./Assets";

const smartPhoneSize = [
  require("../../assets/tutorial/STEP0.png"),
  require("../../assets/tutorial/STEP1.png"),
  require("../../assets/tutorial/STEP2.png"),
  require("../../assets/tutorial/STEP3.png"),
  require("../../assets/tutorial/STEP4.png"),
  require("../../assets/tutorial/STEP5.png"),
];

// const tabletSize = [
//   require("../../assets/tutorial/ipad/STEP0.png"),
//   require("../../assets/tutorial/ipad/STEP1.png"),
//   require("../../assets/tutorial/ipad/STEP2.png"),
//   require("../../assets/tutorial/ipad/STEP3.png"),
//   require("../../assets/tutorial/ipad/STEP4.png"),
// ];

const assetImages = [
  require("../../assets/icon/iconList.png"),
  require("../../assets/icon/iconList2.png"),
  require("../../assets/icon/configuration_true.png"),
  require("../../assets/icon/configuration_false.png"),
];

export async function cacheResourcesAsync() {
  const images = [...Assets.icons, ...Assets.tutorial];
  const cacheImages = images.map(image => {
    Asset.fromModule(image).downloadAsync();
  });
  await Promise.all(cacheImages);
}