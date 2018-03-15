import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { localStyles, devStyles } from "./configStyle";

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
          icon: require('../assets/facebookIcon58.png'),
          link: ''
        },
        {
          icon: require('../assets/email.png'),
          link: ''
        }
      ]
    }
  ],
  Designer: [
    { name: 'Hibiki Shono',
      // 画像アイコン(50*50)のパスを指定する
      contacts: [
        {
          icon: require('../assets/facebookIcon58.png'),
          link: ''
        },
        {
          icon: require('../assets/email.png'),
          link: ''
        }
      ]
    }
  ]
}

export default class Developers extends Component {
  constructor (props) {
    super (props)
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
              contactList.push(
                <View key={i} style={devStyles.contactItem} >
                  <Image source={contents[i].icon} style={devStyles.imageIcon} />
                </View>
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
    return (
      <View style={localStyles.background} >
        { this._renderDevContents(developer) }
      </View>
    )
  }
}

