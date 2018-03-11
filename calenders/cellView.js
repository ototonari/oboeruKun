import React, { Component } from 'react';
import { Animated, Alert, Text, View, TouchableOpacity, TouchableHighlight, Image, TextInput, Switch, StyleSheet, Picker, Platform } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { setNotice, changeNotice } from "../database";
import { Actions, ActionConst } from "react-native-router-flux";
import { dateToFormatString } from "../dateToFormatString";
import { changeNotification } from "./agendaAction";
import { cancelNotification } from "../notification";

export default class CellView extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    
  }
  
  render() {
    let item = this.props.item
    const page = (item) => {
      if (item !== null) {
        return (<Text>Page: {item.startPage} ~ {item.endPage}</Text>)
      }
    }
    const memo = (item) => {
      if (item !== null) {
        return (<Text>メモ: {item}</Text>)
      }
    }
    //let { fadeAnim, offsetX } = this.state
    const success = () => {
      //console.log('item param change : ', item)
      if(item.notificationId !== null) cancelNotification(item.notificationId)
      setNotice(0, item.noticeDate, item.id)
      let items = this.props.this.state.items
      //console.log('start: ', items[item.noticeDate][0])
      let spliceIndex
      for(let i=0, j=items[item.noticeDate].length; i < j; i++) {
        if(item.id == items[item.noticeDate][i].id) {
          //console.log('hit obj : ', items[item.noticeDate][i])
          spliceIndex = i
          i = j
        }
      }
      items[item.noticeDate].splice(spliceIndex, 1)
      //console.log('spliced : ', items[item.noticeDate])
      this.props.this.setState({ items })
    }

    // const error = () => {
    //   const doAtTomorrow = () => {
    //     // 当日のオブジェクト
    //     let today = new Date()
    //     const todayString = dateToFormatString( today, '%YYYY%-%MM%-%DD%')
    //     today.setDate(today.getDate() + 1)
    //     // 明日の日時の文字列
    //     const nextDayString = dateToFormatString( today, '%YYYY%-%MM%-%DD%')
    //     console.log('today : ', todayString, 'tomorrow : ', nextDayString)
    //     // notice table と notificationAPI のリセット
    //     changeNotification(item, todayString).then(() => {
          
    //       // 親component の items をリセット
    //       let items = this.props.this.state.items
    //       let spliceIndex
    //       for(let i=0, j=items[item.noticeDate].length; i < j; i++) {
    //         if(item.id == items[item.noticeDate][i].id) {
    //           //console.log('hit obj : ', items[item.noticeDate][i])
    //           spliceIndex = i
    //           i = j
    //         }
    //       }
    //       items[item.noticeDate].splice(spliceIndex, 1)
    //       item.noticeDate = nextDayString      
    //       items[nextDayString].push(item)
  
    //       this.props.this.setState({ items })
    //     })
        

    //     // changeNotification(item, )
    //     // changeNotice(nextDayString, item.noticeDate, item.id).then(() => {
    //     //   let items = this.props.this.state.items
    //     //   //console.log('start: ', items[item.noticeDate][0])
    //     //   let spliceIndex
    //     //   for(let i=0, j=items[item.noticeDate].length; i < j; i++) {
    //     //     if(item.id == items[item.noticeDate][i].id) {
    //     //       //console.log('hit obj : ', items[item.noticeDate][i])
    //     //       spliceIndex = i
    //     //       i = j
    //     //     }
    //     //   }
    //     //   items[item.noticeDate].splice(spliceIndex, 1)
    //     //   item.noticeDate = nextDayString      
    //     //   items[nextDayString].push(item)
  
    //     //   this.props.this.setState({ items })
    //     // })
    //   }

    //   // 受け取ったdateが当日より古いか判定する。古い = true, 新しい = false
    //   const isOld = (date) => {
    //     const day = new Date(date)
    //     let today = new Date()
    //     today.setDate(today.getDate() + 2)
    //     today.setHours(0, 0, 0, 0)
    //     if(day.getTime() < today.getTime()) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }

    //   const alertParams = (date) => {
    //     if (isOld(date) == true) {
    //       return [
    //         {text: '明日やる', onPress: () => doAtTomorrow(), style: 'cancel' },
    //         {text: 'おいておく', onPress: () => console.log('Cancel Pressed'), style: 'default'}
    //       ]
    //     } else {
    //       return [
    //         {text: 'そのまま', onPress: () => console.log('Cancel Pressed'), style: 'default'},
    //         {text: 'やめる', onPress: () => console.log('Cancel Pressed'), style: 'default'}
    //       ]
    //     }
    //   }

    //   Alert.alert(
    //     item.title,
    //     'どうしますか？',
    //     alertParams(item.noticeDate),
    //     { cancelable: true }
    //   )
    // }

    const rightButtons = [
      <TouchableOpacity style={styles.swipeButton}
        onPress={() => success()} >
        <Image source={require('../assets/success.png')} style={{height: 30, width: 30}} />
      </TouchableOpacity>,
      
    ];

    let hoge
    if(Platform.OS === 'ios') {
      hoge = () => (<Text>ios</Text>)
    } else if (Platform.OS === 'android') {
      hoge = () => (<Text>android</Text>)
    }

    return (
      <Swipeable rightButtons={rightButtons} rightButtonWidth={70}  >
        <View style={[styles.item, {height: item.height}]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }} >{item.title}</Text>
          { page(item.page) }
          { memo(item.memo) }
          { hoge() }
        </View>
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    marginRight: 0,
    marginTop: 17
  },
  emptyDate: {
    flex:1,
    height: 10,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17,
    backgroundColor: 'white',
  },
  swipeButton: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    marginRight: 0,
    marginTop: 17,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center',
  }
});