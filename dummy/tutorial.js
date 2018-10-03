import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform, Dimensions, StyleSheet } from 'react-native';
import { Actions, ActionConst } from "react-native-router-flux";
import { endTutorial } from "../update";

const {height, width} = Dimensions.get('window')
console.log(`height : ${height}, width : ${width}`)

const smartPhoneSize = [
  require('../assets/tutorial/STEP0.png'),
  require('../assets/tutorial/STEP1.png'),
  require('../assets/tutorial/STEP2.png'),
  require('../assets/tutorial/STEP3.png'),
  require('../assets/tutorial/STEP4.png'),
  require('../assets/tutorial/STEP5.png'),
]

const tabletSize = [
  require('../assets/tutorial/ipad/STEP0.png'),
  require('../assets/tutorial/ipad/STEP1.png'),
  require('../assets/tutorial/ipad/STEP2.png'),
  require('../assets/tutorial/ipad/STEP3.png'),
  require('../assets/tutorial/ipad/STEP4.png'),
]

const images = Platform.isPad !== true ? smartPhoneSize : tabletSize

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#8d8d8d',
    borderWidth: 0,
    borderColor: 'blue'
  },
  backgroundImage : {
    ...Platform.select({
      ios: {
        flex: 1,
        width: null,
        height: null,
      },
      android: {
        flex: 1,
        width: null,
        height: null,
      },
    }),
    zIndex: 0
  },
  nextButton: Platform.isPad !== true ? {
    position: 'absolute', 
    bottom: (height / 30) * 5,
    left: (width / 10) * 2, 
    width: (width / 10) * 6,
    height: height / 12, 
    borderWidth: 1, borderColor: 'pink',
    zIndex: 2
    } : {
    position: 'absolute', 
    bottom: height / 17, 
    right: 0, 
    width: width / 4, 
    height: height / 14, 
    borderWidth: 1, borderColor: 'pink',
    zIndex: 1
    },
  prevButton: Platform.isPad !== true ? {
    position: 'absolute', 
    bottom: height / 12, 
    left: 0, 
    width: width / 4, 
    height: height / 14, 
    borderWidth: 1, borderColor: 'pink',
    zIndex: 2
  } : {
    position: 'absolute', 
    bottom: height / 17, 
    left: 0, 
    width: width / 4, 
    height: height / 14, 
    borderWidth: 1, borderColor: 'pink',
    zIndex: 2
  },
  startButton: Platform.isPad !== true ? {
    position: 'absolute', 
    bottom: height / 17,
    left: (width / 10) * 2, 
    width: (width / 10) * 6,
    height: height / 12, 
    borderWidth: 1, borderColor: 'pink',
    zIndex: 1
  } : {
    position: 'absolute', 
    bottom: height / 6,
    left: (width / 10) * 2, 
    width: (width / 10) * 6, 
    height: height / 12,
    borderWidth: 1, borderColor: 'pink',
    zIndex: 3
  },
  skipButton: {
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    width: width / 5, 
    height: height / 14, 
    borderWidth: 1, borderColor: 'pink',
    zIndex: 4
  }
})

const imageProps = {
  resizeMode : Platform.select({
    ios: 'stretch',
    android: 'stretch',
  }),
}

// export class Tutorials extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       showedImage: 0
//     }
//     this.isPad = Platform.isPad
//   }

//   render() {
//     if (this.isPad === true) {

//     } else {

//     }
//     return(
//       <View style={styles.container} >
//         <TouchableOpacity 
//           style={styles.nextButton} 
//           onPressOut={() => Actions.step1()}
//         />
//         <Image
//           source={images[0]}
//           style={styles.backgroundImage}
//           resizeMode={imageProps.resizeMode}
//         />
//       </View>
//     )
//   }
// }

export class Step0 extends Component {
  constructor(props) {
    super(props)
    this.isPad = Platform.isPad
  }

  render() {
    if (this.isPad === true) {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton } 
            onPressOut={() => Actions.step1()}
          />
          <Image
            source={images[0]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.startButton}
            onPressOut={() => Actions.step1()}
          />
          <TouchableOpacity 
            style={styles.skipButton} 
            onPressOut={() => endTutorial()}
          />
          <Image
            source={images[0]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    }
  }
}

export class Step1 extends Component {
  render() {
    if(Platform.isPad === true) {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step2()}
          />
          <TouchableOpacity 
            style={styles.prevButton} 
            onPressOut={() => Actions.pop()}
          />
          <Image
            source={images[1]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    } else {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step2()}
          />
          <TouchableOpacity 
            style={styles.skipButton} 
            onPressOut={() => endTutorial()}
          />
          <Image
            source={images[1]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    }
  }
}


export class Step2 extends Component {
  render() {
    if (Platform.isPad === true) {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step3()}
          />
          <TouchableOpacity 
            style={styles.prevButton} 
            onPressOut={() => Actions.pop()}
          />
          <Image
            source={images[2]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    } else {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step3()}
          />
          <TouchableOpacity 
            style={styles.skipButton} 
            onPressOut={() => endTutorial()}
          />
          <Image
            source={images[2]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    }
  }
}

export class Step3 extends Component {
  render() {
    if(Platform.isPad === true) {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step4()}
          />
          <TouchableOpacity 
            style={styles.prevButton} 
            onPressOut={() => Actions.pop()}
          />
          <Image
            source={images[3]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    } else {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step4()}
          />
          <TouchableOpacity 
            style={styles.skipButton} 
            onPressOut={() => endTutorial()}
          />
          <Image
            source={images[3]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    }
  }
}

export class Step4 extends Component {
  render() {
    if( Platform.isPad === true) {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.startButton} 
            onPressOut={() => endTutorial()}
          />
          <TouchableOpacity 
            style={styles.prevButton} 
            onPressOut={() => Actions.pop()}
          />
          <Image
            source={images[4]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    } else {
      return(
        <View style={styles.container} >
          <TouchableOpacity 
            style={styles.nextButton} 
            onPressOut={() => Actions.step5()}
          />
          <TouchableOpacity 
            style={styles.skipButton} 
            onPressOut={() => endTutorial()}
          />
          <Image
            source={images[4]}
            style={styles.backgroundImage}
            resizeMode={imageProps.resizeMode}
          />
        </View>
      )
    }
  }
}

export class Step5 extends Component {
  render() {
    return(
      <View style={styles.container} >
        <TouchableOpacity 
          style={styles.nextButton} 
          onPressOut={() => endTutorial()}
        />
        <TouchableOpacity 
          style={styles.skipButton} 
          onPressOut={() => endTutorial()}
        />
        <Image
          source={images[5]}
          style={styles.backgroundImage}
          resizeMode={imageProps.resizeMode}
        />
      </View>
    )
}
}

