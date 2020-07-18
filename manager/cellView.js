import React, { Component } from 'react';
import { Animated, Alert, FlatList, Text, View, TouchableOpacity, Image, TextInput, Picker, Platform } from 'react-native';
import { SQLite } from 'expo';
import { getAllItems, selectAll, deleteRow, getAllNoticeDate, dropDB } from "../database";
import { cancel } from "./managerAction";
import styles from "./managerStyle";
import { dateToFormatString } from "../dateToFormatString";
import Swipeout from 'react-native-swipeout'


export default class TaskCellView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offsetX: new Animated.Value(0),
    }
  }

  // Buttons
  swipeoutBtns = [
    {
      text: 'Delete',
      backgroundColor: '#ff0000',
      onPress: () => { 
        Animated.parallel([
          Animated.timing(
            this.state.offsetX,
            {
              toValue: -1000,
              duration: 500
            }
          )
        ]).start( () => {
          cancel(this.props.father, this.props.item.id, this.props.item.notificationId)
        })
        
      },

    },
  ]

  _renderCells = (item) => {
    const pageDate = JSON.parse(item.page)
    return (
      <TouchableOpacity
      onLongPress={() => {
        cancel(this, item.id, item.notificationId)
      }} >
        <View style={styles.container.cellContainer} >
          <Text style={styles.params.cellTitle} >タイトル: {item.title}</Text>
          {this._renderPage(pageDate)}
          {this._renderNoticeDate(item.noticeDate)}

        </View>
      </TouchableOpacity>
    )
  }

  _renderButton = (item) => (
    <TouchableOpacity 
      onLongPress={() => {
        cancel(this, item.id, item.notificationId)
      }}>
      <View style={{ width: 100, height: 50}}>
        <Text style={{ fontSize: 12}} >{item.title}</Text>
        <Text style={{ fontSize: 12}} >{item.noticeDate}</Text>
      </View>
  </TouchableOpacity>
  )

  _renderPage = (pageDate) => { 
    if (pageDate !== null) {
      return (
        <Text style={styles.params.cellPageText} >ページ範囲: p.{pageDate.startPage} 〜 p.{pageDate.endPage}</Text>
    )}
  }

  _renderNoticeDate = (rawNoticeDate) => {
    const date = new Date(rawNoticeDate)
    const noticeDate = dateToFormatString(date, '%YYYY%年%MM%月%DD%日 (%w%)')
    return (<Text style={styles.params.cellText} >通知日時: {noticeDate}</Text>)
  }


  render () {
    let { fadeAnim, offsetX } = this.state
    return (
      <Animated.View
        style={{ transform: [{translateX: offsetX}] }}
        >
        <Swipeout right={this.swipeoutBtns}>
          <View>
            {this._renderCells(this.props.item)} 
          </View>
        </Swipeout>
      </Animated.View>
    )
  }
}
