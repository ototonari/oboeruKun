import React, { Component } from 'react';
import { Animated, Alert, FlatList, Text, View, TouchableOpacity, Image, TextInput, Picker, Platform } from 'react-native';
import Expo, { SQLite } from 'expo';
import { getAllItems, selectAll, deleteRow, getAllNoticeDate, dropDB } from "../database";
import { cancel } from "./managerAction";
import styles from "./managerStyle";
import { dateToFormatString } from "../dateToFormatString";
import TaskCellView from "./cellView";

export default class ManagerView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    getAllNoticeDate(this)
    selectAll('a')
  }

  render () {
    return (
      <View style={styles.container.container} >
        <FlatList
          data={this.state.items}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TaskCellView item={item} father={this} /> }
        />
      </View>
    )
  }
}