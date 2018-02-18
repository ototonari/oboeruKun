import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import styles from './configStyle'
import Developer from './developer'

export default class ConfigView extends Component {
  constructor(props){
    super(props)
  }

  render() {

    return(
      <View  >
        <Developer />

      </View>
    )
  }
}