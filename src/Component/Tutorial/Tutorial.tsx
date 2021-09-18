import React, {Dispatch, useState} from "react";
import {
  Dimensions,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {requestNotificationPermission} from "../../../notification";
import {TabKey} from "../../Config/Const";
import {tutorialImages} from "../../Config/Assets";
import {alreadyShownTutorials} from "../../Config/Libs";
import {getDeviceType} from "../../Config/DeviceType";
import {DeviceType} from "expo-device";
import {RootStackParamList} from "../../Router";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

const {height, width} = Dimensions.get('window')

type Props = NativeStackScreenProps<RootStackParamList, 'Tutorial'>;

const imageProps: ImageResizeMode = Platform.select({
  ios: 'stretch',
  android: 'stretch',
  default: 'stretch'
})

let styles: any;

export function Tutorial({navigation}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const toSkip = async () => {
    await requestNotificationPermission();
    await alreadyShownTutorials()
    navigation.navigate(TabKey.Calendar);
  }

  const images = tutorialImages();
  const deviceType = getDeviceType();

  if (deviceType === DeviceType.TABLET) {
    styles = tabletStyle;
    if (currentPage === 0) {
      return startScreenForTablet(setCurrentPage, toSkip, currentPage, images);
    } else if (currentPage < images.length - 1) {
      return middleScreenForTablet(setCurrentPage, toSkip, currentPage, images);
    } else {
      return endScreenForTablet(setCurrentPage, toSkip, currentPage, images);
    }
  } else {
    styles = phoneStyle;
    if (currentPage === 0) {
      return startScreenForPhone(setCurrentPage, toSkip, currentPage, images);
    } else if (currentPage < images.length - 1) {
      return middleScreenForPhone(setCurrentPage, toSkip, currentPage, images);
    } else {
      return endScreenForPhone(toSkip, currentPage, images);
    }
  }
}

const startScreenForPhone = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number, images: ImageSourcePropType[]) => (
  <View style={styles.container} >
    <TouchableOpacity
      style={styles.startButton }
      onPress={() => setCurrentPage(currentPage + 1)}
    />
    <TouchableOpacity
      style={styles.skipButton}
      onPress={toSkip}
    />
    <Image source={images[currentPage]} style={styles.backgroundImage} resizeMode={imageProps}/>
  </View>
)

const middleScreenForPhone = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number, images: ImageSourcePropType[]) => (
  <View style={styles.container} >
    <TouchableOpacity
      style={styles.nextButton}
      onPress={() => setCurrentPage(currentPage + 1)}
    />
    <TouchableOpacity
      style={styles.skipButton}
      onPress={toSkip}
    />
    <Image source={images[currentPage]} style={styles.backgroundImage} resizeMode={imageProps}/>
  </View>
)

const endScreenForPhone = (toSkip: () => void, currentPage: number, images: ImageSourcePropType[]) => (
  <View style={styles.container} >
    <TouchableOpacity
      style={styles.nextButton}
      onPress={toSkip}
    />
    <TouchableOpacity
      style={styles.skipButton}
      onPress={toSkip}
    />
    <Image source={images[currentPage]} style={styles.backgroundImage} resizeMode={imageProps}/>
  </View>
)

const startScreenForTablet = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number, images: ImageSourcePropType[]) => (
  <View style={styles.container} >
    <TouchableOpacity
      style={styles.nextButton }
      onPress={() => setCurrentPage(currentPage + 1)}
    />
    <Image source={images[currentPage]} style={styles.backgroundImage} resizeMode={imageProps}/>
  </View>
)

const middleScreenForTablet = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number, images: ImageSourcePropType[]) => (
  <View style={styles.container} >
    <TouchableOpacity
      style={styles.nextButton}
      onPress={() => setCurrentPage(currentPage + 1)}
    />
    <TouchableOpacity
      style={styles.prevButton}
      onPress={() => setCurrentPage(currentPage - 1)}
    />
    <Image source={images[currentPage]} style={styles.backgroundImage} resizeMode={imageProps}/>
  </View>
)

const endScreenForTablet = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number, images: ImageSourcePropType[]) => (
  <View style={styles.container} >
    <TouchableOpacity
      style={styles.prevButton}
      onPress={() => setCurrentPage(currentPage - 1)}
    />
    <TouchableOpacity
      style={styles.startButton}
      onPress={toSkip}
    />
    <Image source={images[currentPage]} style={styles.backgroundImage} resizeMode={imageProps}/>
  </View>
)

const phoneStyle = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#8d8d8d',
    borderWidth: 0,
    borderColor: 'blue'
  },
  backgroundImage : {
    width: '100%',
    height: '100%'
  },
  nextButton: {
    position: 'absolute',
    bottom: (height / 30) * 5,
    left: (width / 10) * 2,
    width: (width / 10) * 6,
    height: height / 12,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 2
  },
  prevButton: {
    position: 'absolute',
    bottom: height / 12,
    left: 0,
    width: width / 4,
    height: height / 14,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 2
  },
  startButton: {
    position: 'absolute',
    bottom: height / 17,
    left: (width / 10) * 2,
    width: (width / 10) * 6,
    height: height / 12,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 1
  },
  skipButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width / 5,
    height: height / 14,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 4
  }
})

const tabletStyle = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#8d8d8d',
    borderWidth: 0,
    borderColor: 'blue'
  },
  backgroundImage : {
    width: '100%',
    height: '100%'
  },
  nextButton: {
    position: 'absolute',
    bottom: height / 30,
    right: 0,
    width: width / 4,
    height: height / 9,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 1
  },
  prevButton: {
    position: 'absolute',
    bottom: height / 30,
    left: 0,
    width: width / 4,
    height: height / 9,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 2
  },
  startButton: {
    position: 'absolute',
    bottom: height / 7,
    left: (width / 10) * 2,
    width: (width / 10) * 6,
    height: height / 7,    borderWidth: 0, borderColor: 'pink',
    zIndex: 3
  },
  skipButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 4
  }
})