import React, {useState, Dispatch} from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  ImageSourcePropType, ImageResizeMode
} from 'react-native';
import {requestNotificationPermission} from "../../notification";
import {TabKey} from "../Const";

const {height, width} = Dimensions.get('window')
console.log(`height : ${height}, width : ${width}`)

const smartPhoneSize: ImageSourcePropType[] = [
  require('../../assets/tutorial/STEP0.png'),
  require('../../assets/tutorial/STEP1.png'),
  require('../../assets/tutorial/STEP2.png'),
  require('../../assets/tutorial/STEP3.png'),
  require('../../assets/tutorial/STEP4.png'),
  require('../../assets/tutorial/STEP5.png'),
]

// eslint-disable-next-line no-unused-vars
const tabletSize: ImageSourcePropType[] = [
  require('../../assets/tutorial/ipad/STEP0.png'),
  require('../../assets/tutorial/ipad/STEP1.png'),
  require('../../assets/tutorial/ipad/STEP2.png'),
  require('../../assets/tutorial/ipad/STEP3.png'),
  require('../../assets/tutorial/ipad/STEP4.png'),
]

// const images = Platform.isPad !== true ? smartPhoneSize : tabletSize
const images = smartPhoneSize;

const styles = StyleSheet.create({
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
  // : {
    // for ipad
    // position: 'absolute',
    // bottom: height / 17,
    // right: 0,
    // width: width / 4,
    // height: height / 14,
    // borderWidth: 0, borderColor: 'pink',
    // zIndex: 1
  prevButton: {
      position: 'absolute',
      bottom: height / 12,
      left: 0,
      width: width / 4,
      height: height / 14,
      borderWidth: 0, borderColor: 'pink',
      zIndex: 2
    },
  // } : { for ipad
  //   position: 'absolute',
  //   bottom: height / 17,
  //   left: 0,
  //   width: width / 4,
  //   height: height / 14,
  //   borderWidth: 0, borderColor: 'pink',
  //   zIndex: 2
  // },
  startButton: {
    position: 'absolute',
    bottom: height / 17,
    left: (width / 10) * 2,
    width: (width / 10) * 6,
    height: height / 12,
    borderWidth: 0, borderColor: 'pink',
    zIndex: 1
  },
  // } : { for ipad
  //   position: 'absolute',
  //   bottom: height / 6,
  //   left: (width / 10) * 2,
  //   width: (width / 10) * 6,
  //   height: height / 12,
  //   borderWidth: 0, borderColor: 'pink',
  //   zIndex: 3
  // },
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

const imageProps: ImageResizeMode = Platform.select({
  ios: 'stretch',
  android: 'stretch',
  default: 'stretch'
})

export function Tutorial({navigation}) {
  const [currentPage, setCurrentPage] = useState(0);
  const toSkip = async () => {
    await requestNotificationPermission();
    navigation.navigate(TabKey.Calendar);
  }

  if (currentPage === 0) {
    return startScreen(setCurrentPage, toSkip, currentPage);
  } else if (currentPage < images.length - 1) {
    return middleScreen(setCurrentPage, toSkip, currentPage);
  } else {
    return endScreen(toSkip, currentPage);
  }
}

const startScreen = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number) => (
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

const middleScreen = (setCurrentPage: Dispatch<number>, toSkip: () => void, currentPage: number) => (
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

const endScreen = (toSkip: () => void, currentPage: number) => (
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
