import React, {useEffect, useState} from "react";
import {Button, FormControl, Input, Modal,Text} from "native-base"
import {Agenda, DateObject} from "react-native-calendars";
import {CalendarItemsProps, initializeCalender, ItemProps,} from "./Action";
import Cell from "./Cell";
import {View} from "react-native";
import {hasShownTutorials} from "../../Config/Libs";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../Router";
import {ScreenKey} from "../../Config/Const";
import {EditModal} from "./EditModal";

type Props = NativeStackScreenProps<RootStackParamList, 'Calender'>;

type CalendarStateProps = { init: boolean, items: CalendarItemsProps | null, targetDay: Date };

type InitState = {
  type: 'Init'
}

type EditableState = {
  type: 'Editable',
  itemId: number,
  itemKey: string
}

export type EditModalState = InitState | EditableState

const getItem = (items: CalendarItemsProps, key: string, id: number): ItemProps | undefined => {
  return items[key].find(item => item.id === id);
}

export const Calendar = ({navigation}: Props) => {
  const [{init, items, targetDay}, setItems] = useState<CalendarStateProps>({
    init: false,
    items: null,
    targetDay: new Date()
  });

  const [editModalState, setEditModalState] = useState<EditModalState>({ type: 'Init' });
  const _setEditModalState = (id: number, key: string) => setEditModalState({type: 'Editable', itemId: id, itemKey: key });

  const updateCalendar = (day?: DateObject) => {
    initializeCalender(day).then((items) => setItems({
      init: true,
      items: items,
      targetDay: day ? new Date(day.dateString) : targetDay
    }));
  }

  useEffect(() => {
    if (!init) {
      hasShownTutorials().then((done) => {
        if (!done) navigation.navigate(ScreenKey.Tutorial);
      }).finally(updateCalendar);
    }
  })

  if (items === null) {
    return <View/>;
  } else {
    const closeEditModal = () => setEditModalState({type: 'Init'})
    const _EditModal = ({editModalState}: {editModalState: EditModalState}) => {
      if (editModalState.type === 'Init') return null;

      const targetItem = getItem(items, editModalState.itemKey, editModalState.itemId);
      if (targetItem === undefined) return null;
      else return (
        <EditModal item={targetItem} onEdit={closeEditModal} onCancel={closeEditModal} />
      )
    }

    return (
      <>
        <Agenda
          items={items}
          //loadItemsForMonth={this.loadItems.bind(this)}
          //loadItemsForMonth={(month) => {console.log('loadItemsForMonth called : ', month)}}
          onDayPress={updateCalendar}
          // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          selected={targetDay}
          renderItem={(item => <Cell item={item} key={item.id} onPress={_setEditModalState} />)}
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
        <_EditModal editModalState={editModalState} />
      </>
    )
  }
}
