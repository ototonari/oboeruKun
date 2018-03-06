import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import styles from './configStyle'
import { Actions } from "react-native-router-flux";
import { FlatButton } from "../components";
import { startTutorial } from "../update";

export default class ConfigView extends Component {
  constructor(props){
    super(props)
  }

  render() {

    return(
      <View style={{ flex: 1, }} >
        <FlatButton text={'タイトル履歴の編集'} function={() => Actions.titlelist()} />
        <FlatButton text={'チュートリアル'} function={() => startTutorial()} />
        <FlatButton text={'開発者'} function={() => Actions.developers()} />
      </View>
    )
  }
}