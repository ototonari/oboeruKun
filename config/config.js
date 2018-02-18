import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import styles from './configStyle'
import { Actions } from "react-native-router-flux";

export default class ConfigView extends Component {
  constructor(props){
    super(props)
  }

  render() {

    return(
      <View style={{ flex: 1, }} >
        <TouchableOpacity 
          onPress={() => Actions.developers() }
          style={{ 
            borderColor: 'gray',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            height: 50,
           }} >
              <View style={{
                flex: 1, flexDirection: 'row', paddingLeft: 15, paddingRight: 15, alignItems: 'center', justifyContent: 'space-between'
              }} >
                <Text style={{ fontSize: 20 }} >Developers</Text>
                <Image source={require('../assets/right.png')} style={{ width: 20, height: 20 }} />
              </View>
        </TouchableOpacity>

      </View>
    )
  }
}