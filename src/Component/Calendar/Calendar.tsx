import React, {useEffect, useState} from "react";
import {Agenda, DateObject} from "react-native-calendars";
import {CalendarItemsProps, initializeCalender, ItemProps,} from "./Action";
import Cell from "./Cell";
import {hasShownTutorials} from "../../Config/Libs";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../Router";
import {ScreenKey} from "../../Config/Const";
import {EditModal} from "./EditModal";
import {Loading} from "../BackGround";
import {initState, ViewState} from "./state";

type Props = NativeStackScreenProps<RootStackParamList, 'Calender'>;

const getItem = (items: CalendarItemsProps, key: string, id: number): ItemProps => {
  const itemProps = items[key].find(item => item.id === id);
  if (!itemProps) throw new Error("invalid invoke.")
  return itemProps;
}

export const Calendar = ({navigation}: Props) => {
  const [state, setState] = useState<ViewState>(initState)

  const updateCalendar = (day?: DateObject) => {
    initializeCalender(day).then((items) => {
      setState({
        type: 'Basic',
        items: items,
        targetDay: day ? new Date(day.dateString) : new Date()
      })
    });
  }

  useEffect(() => {
    if (state.type === 'Init') {
      hasShownTutorials()
      .then((done) => {
        if (!done) navigation.navigate(ScreenKey.Tutorial);
      })
      .finally(updateCalendar)
    }
  })

  if (state.type === 'Init') {
    return <Loading/>;
  } else {
    const {items} = state;
    const onEditStart = (id: number, key: string) => setState({
      ...state,
      type: 'Editable',
      itemId: id,
      itemKey: key
    })
    const onEditEnd = () => setState({
      ...state,
      type: "Basic"
    })

    return (
      <>
        <Agenda
          items={items}
          //loadItemsForMonth={this.loadItems.bind(this)}
          //loadItemsForMonth={(month) => {console.log('loadItemsForMonth called : ', month)}}
          onDayPress={updateCalendar}
          // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          selected={state.targetDay}
          renderItem={(item => <Cell item={item} key={item.id} onPress={onEditStart}/>)}
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
        {state.type === 'Editable' ? (
          <EditModal
            item={getItem(items, state.itemKey, state.itemId)}
            onEdit={updateCalendar}
            onCancel={onEditEnd}
          />
        ) : null}
      </>
    )
  }
}
