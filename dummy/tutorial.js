import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import { Actions, ActionConst } from "react-native-router-flux";
import { endTutorial } from "../update";

export class Step1 extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <View style={{ flex: 1, backgroundColor: 'powderblue' }} >
        <TouchableOpacity onPress={() => Actions.step2()} >
          <Text style={{ margin: 100, fontSize: 30 }} >step1</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


export class Step2 extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <View style={{ flex: 1, backgroundColor: 'powderblue' }} >
        <TouchableOpacity onPress={() => Actions.step3()} >
          <Text style={{ margin: 100, fontSize: 30 }} >step2</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


export class Step3 extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <View style={{ flex: 1, backgroundColor: 'powderblue' }} >
        <TouchableOpacity onPress={() => endTutorial() } >
          <Text style={{ margin: 100, fontSize: 30 }} >step3</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

