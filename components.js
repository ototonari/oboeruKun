import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Asset } from "expo";

export let locale = {}
export const localeJSON = require("./locale.json")

export class Avatar extends Component {
  constructor(props) {
      super(props);
  }
  render() {
      if(this.props.source !== '') {
          let uri = this.props.source
          return (
              <Image source={{uri: uri}} style={this.props.style} />
          )
      } else {
          return (
              <Image source={require('./assets/camera.png')} />
          )
      }
  }
}

export class TabIcon extends Component {
    constructor(props) {
        super(props)
    }

    _iconList = {
        calender: {
            active: require('./assets/icon/iconList.png'),
            inactive: require('./assets/icon/iconList2.png')
        },
        config: {
            active: require('./assets/icon/configuration_true.png'),
            inactive: require('./assets/icon/configuration_false.png')
        }
    }

    _style = StyleSheet.create({
        tabText: {
            color: 'gray',
        },
        tabTextActive: {
            color: 'blue',
        },
        imageIcon: {
            width: 30,
            height: 30,
            position: 'absolute',
            top: -18,
            left: -15,
        },
        view: {
            
        }
    });
  
    managerIcon = (key, isFocused) => {
      if (key == 'manager') {
        if (isFocused === true) {
          return(
            <Image source={this._iconList.calender.active} style={this._style.imageIcon} />
          )
        } else {
          return(
            <Image source={this._iconList.calender.inactive} style={this._style.imageIcon} />
          )
        }
      } else if (key == 'config') {
        if (isFocused === true) {
          return(
            <Image source={this._iconList.config.active} style={this._style.imageIcon} />
          )
        } else {
          return(
            <Image source={this._iconList.config.inactive} style={this._style.imageIcon} />
          )
        }
      }
    }
  
    render () {
      const key = this.props.navigation.state.key
      const isFocused = this.props.focused
      return(
        <View style={this._style.view} >
          { this.managerIcon(key, isFocused) }
        </View>
      )
    }
  }
    

export class FlatButton extends Component {
    constructor(props) {
        super(props)
    }

    style = StyleSheet.create({
        container: {
            borderColor: 'gray',
            borderBottomWidth: 1,
            height: 50,
        },
        inContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 15,
            paddingRight: 15,
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        text: {
            fontSize: 20
        },
        image: {
            width: 20,
            height: 20
        }
    })
    render () {
        const text = this.props.text
        const func = this.props.function
        return (
            <TouchableOpacity 
                onPress={() => func()}
                style={this.style.container} >
                    <View style={this.style.inContainer} >
                        <Text style={this.style.text} >{text}</Text>
                        <Image source={require('./assets/right.png')} style={this.style.image} />
                    </View>
            </TouchableOpacity>
  
        )
    }
}

const smartPhoneSize = [
    require('./assets/tutorial/STEP0.png'),
    require('./assets/tutorial/STEP1.png'),
    require('./assets/tutorial/STEP2.png'),
    require('./assets/tutorial/STEP3.png'),
    require('./assets/tutorial/STEP4.png'),
    require('./assets/tutorial/STEP5.png'),
]

const tabletSize = [
    require('./assets/tutorial/ipad/STEP0.png'),
    require('./assets/tutorial/ipad/STEP1.png'),
    require('./assets/tutorial/ipad/STEP2.png'),
    require('./assets/tutorial/ipad/STEP3.png'),
    require('./assets/tutorial/ipad/STEP4.png'),
]

const assetImages = [
    require('./assets/icon/iconList.png'),
    require('./assets/icon/iconList2.png'),
    require('./assets/icon/configuration_true.png'),
    require('./assets/icon/configuration_false.png')
]

export async function assetsLoad() {
    // デバイスによってロードする画像を変更する
    let tutorialImage = Platform.isPad !== true ? smartPhoneSize : tabletSize;
    let asyncLoadImages = tutorialImage.concat(assetImages)
    // 画像をディスクにキャッシュする
    await Asset.loadAsync(asyncLoadImages)
}

export async function localization() {
    const country = await Expo.Util.getCurrentDeviceCountryAsync()
    // Returns the current device country code.

    const currentLocale = await Expo.Util.getCurrentLocaleAsync()
    // Returns the current device locale as a string.

    const timezone = await Expo.Util.getCurrentTimeZoneAsync()
    // Returns the current device time zone name.
    console.log(`country : ${country} , locale : ${currentLocale} , timezone : ${timezone}`)
    locale = {
        'country': country,
        'locale': currentLocale,
        'timezone': timezone
    }

}

export function loadLanguage(props) {
    if (locale.country === "JP") {
        return localeJSON.jp[props]
    } else {
        return localeJSON.en[props]
    }
}