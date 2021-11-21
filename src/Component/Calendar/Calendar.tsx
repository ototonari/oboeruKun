import React, { useEffect, useState } from "react";
import { Agenda, DateObject } from "react-native-calendars";
import { CalendarItemsProps, initializeCalender, ItemProps } from "./Action";
import Cell from "./Cell";
import { hasShownTutorials } from "../../Config/Libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Router";
import { ScreenKey } from "../../Config/Const";
import { EditModal } from "./EditModal";
import { Loading } from "../BackGround";
import { initState, ViewState } from "./state";
import { Button, Icon } from "native-base";
import { AntDesign } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Calender">;

const getItem = (
  items: CalendarItemsProps,
  key: string,
  id: number
): ItemProps => {
  const itemProps = items[key].find((item) => item.id === id);
  if (!itemProps) throw new Error("invalid invoke.");
  return itemProps;
};

export const Calendar = ({ navigation }: Props) => {
  const [state, setState] = useState<ViewState>(initState);
  const { items } = state;

  const setInitState = () => setState(initState);

  const updateCalendar = async (day?: DateObject) => {
    await initializeCalender(day).then((items) => {
      setState({
        type: "Basic",
        items: items,
        targetDay: day ? new Date(day.dateString) : new Date(),
      });
    });
  };

  const HeaderRightButton = () => (
    <Button
      style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      onPress={() => {
        navigation.push(ScreenKey.RemindMe);
      }}
    >
      <Icon as={AntDesign} name="pluscircle" size="6" color="emerald.500" />
    </Button>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRightButton,
    });

    if (state.type === "Init") {
      hasShownTutorials()
        .then((done) => {
          if (!done) navigation.navigate(ScreenKey.Tutorial);
        })
        .finally(updateCalendar);
    }
  });

  if (state.type === "Init") {
    return (
      <Agenda
        items={items}
        selected={new Date()}
        renderEmptyData={() => <Loading />}
        onDayPress={() => {}}
        renderItem={(item) => (
          <Cell
            item={item}
            key={item.id}
            onEdit={() => {}}
            onComplete={() => {}}
          />
        )}
        renderEmptyDate={() => null}
        rowHasChanged={(r1, r2) => r1.data.areEqual(r2.data)}
      />
    );
  } else {
    const onEditStart = (id: number, key: string) =>
      setState({
        ...state,
        type: "Editable",
        itemId: id,
        itemKey: key,
      });
    const onEditEnd = () =>
      setState({
        ...state,
        type: "Basic",
      });

    return (
      <>
        <Agenda
          items={items}
          //loadItemsForMonth={this.loadItems.bind(this)}
          //loadItemsForMonth={(month) => {console.log('loadItemsForMonth called : ', month)}}
          onDayPress={updateCalendar}
          // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          selected={state.targetDay}
          renderItem={(item) => (
            <Cell
              item={item}
              key={item.id}
              onEdit={onEditStart}
              onComplete={setInitState}
            />
          )}
          renderEmptyDate={() => null}
          rowHasChanged={(r1, r2) => r1.data.areEqual(r2.data)}
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
        {state.type === "Editable" ? (
          <EditModal
            item={getItem(items, state.itemKey, state.itemId)}
            onEdit={setInitState}
            onCancel={onEditEnd}
          />
        ) : null}
      </>
    );
  }
};
