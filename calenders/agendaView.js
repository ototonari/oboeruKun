import React, { Component } from "react";
import { View, Platform } from "react-native";
import { Agenda } from "react-native-calendars";
// import { initializeCalender, localization } from "./agendaAction";
import {
  initializeCalender,
  localization,
} from "../src/Component/Calender/Action";
import { dateToFormatString } from "../dateToFormatString";
import { Notifications } from "expo";
import { loadLanguage } from "../components";
import Cell from "../src/Component/Calender/Cell";

export default class AgendaView extends Component {
  constructor(props) {
    super(props);
    this.language = loadLanguage("data");
    this.state = {
      items: {},
      today: dateToFormatString(new Date(), "%YYYY%-%MM%-%DD%"),
      currentlyOpenSwipeable: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.listenForNotifications();
    localization();
  }

  componentDidMount() {
    initializeCalender().then((items) => this.setState({ items }));
  }

  listenForNotifications = () => {
    Notifications.addListener((notification) => {
      //console.log(notification.origin)
      if (notification.origin === "received" && Platform.OS === "ios") {
        console.log("notification receaved", notification.data);
        //Alert.alert(notification.data.title, notification.data.body);
      }
    });
  };

  onOpen = (event, gestureState, swipeable) => {
    const { currentlyOpenSwipeable } = this.state;
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }

    this.setState({ currentlyOpenSwipeable: swipeable });
  };

  onClose = () => this.setState({ currentlyOpenSwipeable: null });

  onSuccess = (items) => {
    let { currentlyOpenSwipeable } = this.state;
    currentlyOpenSwipeable.recenter();
    this.onClose();

    this.setState({ items });
  };

  render() {
    //console.log('Actions receive props : ', this.props)

    return (
      <Agenda
        items={this.state.items}
        //loadItemsForMonth={this.loadItems.bind(this)}
        //loadItemsForMonth={(month) => {console.log('loadItemsForMonth called : ', month)}}
        onDayPress={this.selectLoadItems}
        // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
        selected={this.state.today}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        //maxDate={'2018-03-12'}
        // pastScrollRange={3}
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

  selectLoadItems = (day) => {
    initializeCalender(day).then((items) => this.setState({ items }));
  };

  loadItems(day) {
    console.log("called loadItems , day: ", day);
  }

  renderItem = (item) => {
    return <Cell item={item} language={this.language} />;
  };

  renderEmptyDate = () => {
    return (
      //<View style={styles.emptyDate}></View>
      <View />
    );
  };

  rowHasChanged = (r1, r2) => {
    return r1.title !== r2.title;
  };

  testRowHasChanged() {}

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}
