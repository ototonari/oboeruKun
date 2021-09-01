import {Asset} from 'expo-asset';
import * as Device from 'expo-device';
import {DeviceType} from 'expo-device';
import {ImageSourcePropType} from "react-native";
import {getDeviceType} from "./DeviceType";

export const Icons = {
  calender: {
    active: require("../../assets/icon/iconList.png"),
    inactive: require("../../assets/icon/iconList2.png"),
  },
  config: {
    active: require("../../assets/icon/configuration_true.png"),
    inactive: require("../../assets/icon/configuration_false.png"),
  },
  button: {
    plus: require("../../assets/plus.png"),
    error: require("../../assets/error.png")
  },
  developer: {
    facebook: require("../../assets/facebookIcon58.png"),
    email: require("../../assets/email.png"),
    twitter: require("../../assets/twitterIcon400.png"),
  }
}

export const TutorialImages: ImageSourcePropType[] = [
  require('../../assets/tutorial/STEP0.png'),
  require('../../assets/tutorial/STEP1.png'),
  require('../../assets/tutorial/STEP2.png'),
  require('../../assets/tutorial/STEP3.png'),
  require('../../assets/tutorial/STEP4.png'),
  require('../../assets/tutorial/STEP5.png'),
]

const TutorialImagesOnTablet: ImageSourcePropType[] = [
  require('../../assets/tutorial/ipad/STEP0.png'),
  require('../../assets/tutorial/ipad/STEP1.png'),
  require('../../assets/tutorial/ipad/STEP2.png'),
  require('../../assets/tutorial/ipad/STEP3.png'),
  require('../../assets/tutorial/ipad/STEP4.png'),
]

export const tutorialImages = () => {
  const deviceType = getDeviceType()
  if (deviceType === DeviceType.TABLET) {
    return TutorialImagesOnTablet;
  } else {
    return TutorialImages;
  }
}

const presetImages = [
  Icons.calender.active,
  Icons.calender.inactive,
  Icons.config.active,
  Icons.config.inactive,
  Icons.button.plus,
  Icons.button.error,
  Icons.developer.facebook,
  Icons.developer.email,
  Icons.developer.twitter,
];

export async function assetsPreLoader() {
  const images = [...presetImages, ...(tutorialImages())]
  const cacheImages = images.map(image => {
    Asset.fromModule(image).downloadAsync();
  });
  await Promise.all(cacheImages);
}