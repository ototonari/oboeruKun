import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import styles from './configStyle'
import { Actions } from "react-native-router-flux";
import { FlatButton, loadLanguage } from "../components";
import { startTutorial } from "../update";

export default class ConfigView extends Component {
  constructor(props){
    super(props)
  }

  render() {
    const language = loadLanguage('scene')
    return(
      <View style={{ flex: 1, }} >
        <FlatButton text={language.titleList} function={() => Actions.titlelist()} />
        <FlatButton text={language.noticeSetting} function={() => Actions.noticesetting()} />
        <FlatButton text={language.tutorial} function={() => startTutorial()} />
        <FlatButton text={language.developer} function={() => Actions.developers()} />
      </View>
    )
  }
}