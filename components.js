import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { Asset } from "expo";


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
]

const tabletSize = [
    require('./assets/tutorial/ipad/STEP0.png'),
    require('./assets/tutorial/ipad/STEP1.png'),
    require('./assets/tutorial/ipad/STEP2.png'),
    require('./assets/tutorial/ipad/STEP3.png'),
    require('./assets/tutorial/ipad/STEP4.png'),
]

export async function assetsLoad() {
    // デバイスによってロードする画像を変更する
    console.log(Platform.isPad)
    images = Platform.isPad !== true ? smartPhoneSize : tabletSize;
    // 画像をディスクにキャッシュする
    Asset.loadAsync(images)
}