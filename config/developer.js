import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Linking, Platform } from 'react-native';
import { localStyles, devStyles } from "./configStyle";
import { MailComposer, Asset, AppLoading } from "expo";

const images = {
  facebook: require('../assets/facebookIcon58.png'),
  email: require('../assets/email.png'),
  twitter: require('../assets/twitterIcon400.png'),
}

// 必須フィールド
// *job --- *name
//      |- contacts []
//            |-- iconPath
//            --- hyperLink
const developer = {
  Programer: [
    { name: 'Tsubasa Nagata',
      // 画像アイコン(50*50)のパスを指定する
      contacts: [
        {
          icon: images.email,
          type: 'email',
          // mail object
          link: { 
            recipients: ['sinnyo.tsubasa@gmail.com'],
            subject: 'app name:おぼえる君',
            body: ''
         }
        },
        {
          icon: images.facebook,
          type: 'link',
          link: 'https://www.facebook.com/profile.php?id=100004769313128'
        }
      ]
    }
  ],
  Designer: [
    { name: 'Hibiki Shono',
      // 画像アイコン(50*50)のパスを指定する
      contacts: [
        {
          icon: images.email,
          type: 'email',
          // mail object
          link: { 
            recipients: ['sharks.soccer02@gmail.com'],
            subject: 'app name:おぼえる君',
            body: ''
         }
        },
        {
          icon: images.facebook,
          type: 'link',
          link: 'https://www.facebook.com/shonohibiki'
        },
        {
          icon: images.twitter,
          type: 'link',
          link: 'https://twitter.com/sherbet02/'
        },

      ]
    }
  ]
}

export default class Developers extends Component {
  constructor (props) {
    super (props)
    this.state = {
      isReady: false,
    }
  }

  async _cacheResourcesAsync() {
    const cacheImages = Object.keys(images).map((value) => {
      return Asset.fromModule(images[value]).downloadAsync()
    })
    // const cacheImages = images.map((image) => {
    //   return Asset.fromModule(image).downloadAsync();
    // });
    return Promise.all(cacheImages)
  }

  _renderDevContents = (obj) => {
    let contentList = []
    if (obj !== null) {
      Object.keys(obj).forEach((key) => {
        // exp. programer
        obj[key].forEach((v, i, a) => {
          const person = obj[key][i]
          //console.log('person :', person)
          const renderContents = (contents) => {
            let contactList = []
            contents.forEach(function(v, i, a) {
              let func
              const type = contents[i].type
              if (type == 'link') {
                func = (url) => Linking.openURL(url).catch(err => console.error('An error occurred', err))
              } else if (type =='email') {
                func = (saveOptions) => MailComposer.composeAsync(saveOptions)
              }
              contactList.push(
                <TouchableOpacity 
                  key={i}
                  onPress={ () => func(contents[i].link) }
                  activeOpacity={0.1}
                >
                  <View style={devStyles.contactItem} >
                    <Image source={contents[i].icon} style={devStyles.imageIcon} />
                  </View>
                </TouchableOpacity>
              )
            })
            return contactList
          }
          contentList.push(
            <View key={key} style={localStyles.miniContainer} >
              <Text style={devStyles.job} >{ key }</Text>
              <View style={devStyles.contents} >
                <Text style={devStyles.name} >{ person.name }</Text>
                <View style={[devStyles.contacts, devStyles.centering, devStyles.arroundBorder, { width: 10 + (person.contacts.length * 70) }]} >
                  <Text style={devStyles.contactsLabel} >Contacts</Text>
                  { renderContents(person.contacts) }
                </View>
              </View>
            </View>
          )
        })
      })
      
    }
    return contentList
  }
  
  render () {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <View style={localStyles.background} >
        { this._renderDevContents(developer) }
      </View>
    )
  }
}

