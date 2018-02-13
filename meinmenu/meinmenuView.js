import React, { Component } from 'react';
import { Alert, Text, View, TouchableOpacity, Platform } from 'react-native';
import meinmenuStyle from "./meinmenuStyle";
import { Actions } from "react-native-router-flux";
import { Constants, Notifications, Permissions } from 'expo';
import { selectAll } from "../database";

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}


export default class MeinmenuView extends Component{
  constructor(props) {
    super (props)

  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={meinmenuStyle.meinmenu.button}>
        <Text style={meinmenuStyle.meinmenu.text} >{text}</Text>
      </View>
    </TouchableOpacity>
  );

  listenForNotifications = () => {
    Notifications.addListener(notification => {
      //console.log(notification.origin)
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        //console.log(notification.data)
        Alert.alert(notification.data.title, notification.data.body);
      }
    });
  };
  
  componentWillMount() {
    getiOSNotificationPermission();
    this.listenForNotifications();
  }


  render () {
    return (
      <View style={meinmenuStyle.meinmenu.container} >
        { this._renderButton('登録', () => Actions.register() ) }
        { this._renderButton('管理', () => Actions.manager() ) }
        
      </View>
    )
  }
}