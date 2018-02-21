import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Switch, Picker, Platform } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class CalenderView extends Component {
  constructor(props) {
    super(props)
    this.state ={
      selected: '2018-02-20'
    }
  }

  render() {
    return (
      
        <Agenda
          // the list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key kas to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={
            {
            '2018-02-19': [{text: 'item 1 - any js object'}],
            '2018-02-20': [{text: 'item 1 - any js object'}],
            '2018-02-21': [{text: 'item 1 - any js object'}],
            }}
          // callback that gets called when items for a certain month should be loaded (month became visible)
          loadItemsForMonth={(month) => {console.log('trigger items loading')}}
          // callback that fires when the calendar is opened or closed
          onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          // callback that gets called on day press
          onDayPress={(day)=>{console.log('day pressed')}}
          // callback that gets called when day changes while scrolling agenda list
          onDayChange={(day)=>{
            console.log('day changed:', day.dateString)
            this.setState({ selected: day.dateString })
          }}
          // initially selected day
          selected={ this.state.selected }
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          //minDate={'2012-05-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          //maxDate={'2012-05-30'}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {return (<View />);}}
          // specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => {return (<View />)}}
          // specify how empty date content with no items should be rendered
          renderEmptyDate={() => {return (<View />);}}
          // specify how agenda knob should look like
          //renderKnob={() => {return (<View />);}}
          // specify what should be rendered instead of ActivityIndicator
          renderEmptyData = {() => {return (<View />);}}
          // specify your item comparison function for increased performance
          rowHasChanged={(r1, r2) => {return r1.text !== r2.text; console.log('rowHasChanged: ',r1, r2)}}
          // Hide knob button. Default = false
          //hideKnob={true}
          // By default, agenda dates are marked if they have at least one item, but you can override this if needed
          markedDates={{
            '2018-02-20': {selected: true, marked: true},
            '2018-02-21': {marked: true},
            '2018-02-22': {disabled: false}
          }}
          // agenda container style
          style={{}}
        />
      
    )
  }
}