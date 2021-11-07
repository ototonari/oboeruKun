import React, {ReactNode, useEffect, useState} from "react";
import {Agenda, DateObject} from "react-native-calendars";
import {
  initializeCalender,
} from "./Action";
import Cell from "./Cell";
import {locale} from "../../Config/Locale"

const _renderItem = (item: any): ReactNode =>  {
  return <Cell item={item} language={locale.data} />
}

export const Calendar = () => {
  const [{init, items, targetDay}, setItems] = useState({init: false, items: {}, targetDay: new Date()});

  const updateCalendar = (day?: DateObject) => {
    initializeCalender(day).then((items) => setItems({init: true, items, targetDay: day ? new Date(day.dateString): targetDay}));
  }

  useEffect(() => {
    if (!init) {
      updateCalendar();
    }
    // show tutorial
  })

  return (
    <Agenda
      items={items}
      //loadItemsForMonth={this.loadItems.bind(this)}
      //loadItemsForMonth={(month) => {console.log('loadItemsForMonth called : ', month)}}
      onDayPress={updateCalendar}
      // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
      selected={targetDay}
      renderItem={_renderItem}
      renderEmptyDate={() => null}
      rowHasChanged={(r1, r2) => {
        return r1.title !== r2.title;
      }}
      //maxDate={'2018-03-12'}
      // pastScrollRange={3}
      // futureScrollRange={3}
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
  )
}
