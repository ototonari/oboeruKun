import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import { isEqual } from "lodash";
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Actions, ActionConst } from "react-native-router-flux";
import { getAllNoticeDate, getNotice } from "../database";
import { initializeCalender, localization } from "./agendaAction";
import { dateToFormatString } from '../dateToFormatString';
import Swipeable from 'react-native-swipeable';
import { Constants, Notifications, Permissions } from 'expo';
import CellView from "./cellView";
import { cancelNotification } from "../notification";
import { setNotice } from "../database";
import { locale } from "../components";


async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

export default class AgendaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      today: dateToFormatString(new Date(), '%YYYY%-%MM%-%DD%'),
      currentlyOpenSwipeable: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      this.state.currentlyOpenSwipeable === nextState.currentlyOpenSwipeable &&
      isEqual(nextState.items, this.state.items)
    )
  }
  
  componentWillMount() {
    this.listenForNotifications();
    localization()
  }

  componentDidMount() {
    initializeCalender(this)
  }

  listenForNotifications = () => {
    Notifications.addListener(notification => {
      //console.log(notification.origin)
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        console.log('notification receaved', notification.data)
        //Alert.alert(notification.data.title, notification.data.body);
      }
    });
  };

  onOpen = (event, gestureState, swipeable) => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }
    
    this.setState({currentlyOpenSwipeable: swipeable});
  }

  onClose = () => this.setState({currentlyOpenSwipeable: null})

  onSuccess = (items) => {
    let {currentlyOpenSwipeable} = this.state;
    currentlyOpenSwipeable.recenter();
    this.onClose()

    this.setState({ items })
  }

  render() {
    //console.log('Actions receive props : ', this.props)

    return (
      <Agenda
        items={this.state.items}
        //loadItemsForMonth={this.loadItems.bind(this)}
        //loadItemsForMonth={(month) => {console.log('loadItemsForMonth called : ', month)}}
        onDayPress={this.selectLoadItems.bind(this)}
        // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
        selected={this.state.today}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        //maxDate={'2018-03-12'}
        pastScrollRange={3}
        futureScrollRange={3}
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

  selectLoadItems(day) {
    initializeCalender(this, day)
  }

  loadItems(day) {
    console.log('called loadItems , day: ', day)
  }

  renderItem(item) {
    
    return (
      <CellView item={item} this={this} onOpen={this.onOpen} onClose={this.onClose} onSuccess={this.onSuccess} />
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

  testRowHasChanged() {
    
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