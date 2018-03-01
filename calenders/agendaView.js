import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import { getAllNoticeDate, getNotice } from "../database";
import { initializeCalender } from "./agendaAction";
import { dateToFormatString } from '../dateToFormatString';

export default class AgendaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {
        "2018-02-21": [{ name: 'hoge', height: 100 }, { name: 'nya', height: 50 }],
        "2018-02-22": [{ name: 'huu', height: 200 }]
      },
      today: dateToFormatString(new Date(), '%YYYY%-%MM%-%DD%')
    };
  }

  componentDidMount() {
    initializeCalender(this)
  }

  render() {
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
    return (
      <View style={[styles.item, {height: item.height}]}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }} >{item.title}</Text>
        { page(item.page) }
        { memo(item.memo) }
      </View>
    );
  }

  renderEmptyDate() {
    return (
      //<View style={styles.emptyDate}></View>
      <View />
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
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
    padding: 10,
    marginRight: 10,
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
  }
});