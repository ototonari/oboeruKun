import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Actions, ActionConst } from "react-native-router-flux";
import { getAllNoticeDate, getNotice } from "../database";
import { initializeCalender } from "./agendaAction";
import { dateToFormatString } from '../dateToFormatString';
import Swipeable from 'react-native-swipeable';
import CellView from "./cellView";

const rightButtons = [
  <TouchableHighlight style={{
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    marginRight: 0,
    marginTop: 17,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center',
  }} ><Image source={require('../assets/error.png')} style={{height: 30, width: 30}} /></TouchableHighlight>
];

export default class AgendaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      today: dateToFormatString(new Date(), '%YYYY%-%MM%-%DD%')
    };
  }

  componentDidMount() {
    initializeCalender(this)
  }


  render() {
    //console.log('Actions receive props : ', this.props)
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={this.state.today}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        //maxDate={'2018-04-01'}
        //markingType={'interactive'}
        //markedDates={{
        //  '2017-05-08': [{textColor: '#666'}],
        //  '2017-05-09': [{textColor: '#666'}],
        //  '2017-05-14': [{startingDay: true, color: 'blue'}, {endingDay: true, color: 'blue'}],
        //  '2017-05-21': [{startingDay: true, color: 'blue'}],
        //  '2017-05-22': [{endingDay: true, color: 'gray'}],
        //  '2017-05-24': [{startingDay: true, color: 'gray'}],
        //  '2017-05-25': [{color: 'gray'}],
        //  '2017-05-26': [{endingDay: true, color: 'gray'}]}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }

  loadItems(day) {
    //console.log('called loadItems , day: ', day)
    // setTimeout(() => {
    //   for (let i = -15; i < 15; i++) {
    //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //     const strTime = this.timeToString(time);
    //     console.log('loadItems day: ', day, ' time: ', time, ' strTime: ', strTime)
    //     if (!this.state.items[strTime]) {
    //       this.state.items[strTime] = [];
    //       const numItems = Math.floor(Math.random() * 5);
    //       for (let j = 0; j < numItems; j++) {
    //         this.state.items[strTime].push({
    //           name: 'Item for ' + strTime,
    //           height: Math.max(50, Math.floor(Math.random() * 150))
    //         });
    //       }
    //     }
    //   }
    //   //console.log(this.state.items);
    //   const newItems = {};
    //   Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
    //   this.setState({
    //     items: newItems
    //   });
    // }, 1000);
    // // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <CellView item={item} />
    );
  }

  renderEmptyDate() {
    return (
      //<View style={styles.emptyDate}></View>
      <View />
    );
  }

  rowHasChanged(r1, r2) {
    return r1.title !== r2.title;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    //borderTopLeftRadius: 5,
    //borderBottomLeftRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 10
  },
  emptyDate: {
    flex:1,
    height: 10,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17,
    backgroundColor: 'white',
  }
});