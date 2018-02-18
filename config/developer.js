import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';

const programer = 'Tsubasa Nagata'
const designer = ''

export default class Developer extends Component {
  constructor (props) {
    super (props)
  }
  
  render () {
    return (
      <View  >
        <View ><Text>Programer : {programer}</Text></View>
        <View ><Text>Designer : {designer}</Text></View>
      </View>
    )
  }

}