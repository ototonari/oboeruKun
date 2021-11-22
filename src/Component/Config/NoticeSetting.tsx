import React, {useEffect, useState} from "react";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import {SwipeListView} from 'react-native-swipe-list-view';

import {isJP} from "../../Config/Locale"
import {getNoticeIntervals, INoticeInterval} from "../../IO/SQLite";
import {Button, Icon, Pressable} from "native-base";
import {AntDesign} from "@expo/vector-icons";
import {RootStackParamList} from "../../Router";
import {ScreenKey} from "../../Config/Const";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type InitState = {
  type: 'Init',
  items: INoticeInterval[]
}

type ReadyState = {
  type: 'Ready',
  items: INoticeInterval[]
}

type ViewState = InitState | ReadyState;

const initState: InitState = {type: 'Init', items: []};

export const NoticeSetting = ({navigation}: NativeStackScreenProps<RootStackParamList, 'NoticeSetting'>) => {
  const [state, setState] = useState<ViewState>(initState);

  const makeMsg = (intervals: number[]) => {
    let msg = isJP() ? "" : "Notify after ";
    for (let i = 0, j = intervals.length; i < j; i++) {
      msg += isJP() ? `${intervals[i]}日後, ` : `${intervals[i]}, `;
    }
    msg += isJP() ? "に復習する" : "days";
    return msg;
  }

  const HeaderRightButton = () => (
    <Button
      style={{backgroundColor: "rgba(0, 0, 0, 0)"}}
      onPress={() => {
        // eslint-disable-next-line react/prop-types
        navigation.push(ScreenKey.RegisterSetting);
      }}
    >
      <Icon as={AntDesign} name="pluscircle" size="6" color="emerald.500"/>
    </Button>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRightButton,
    });

    if (state.type === 'Init') {
      getNoticeIntervals().then((items) => {
        setState({
          type: 'Ready',
          items: items
        })
      })
    }
  })

  return (
    <View style={styles.background}>
      <SwipeListView
        data={state.items}
        keyExtractor={item => String(item.id)}
        renderItem={(data) => (
          <View style={styles.container} key={String(data.item.id)}>
            <Text style={{fontSize: 18}}>{data.item.name}</Text>
            <Text style={{fontSize: 14, paddingLeft: 10}}>{makeMsg(data.item.interval)}</Text>
          </View>
        )}
        renderHiddenItem={(data) => (
          <View style={styles.rowBack} key={String(data.item.id)}>
            <Pressable onPress={() => {
            }}>
              <Icon
                as={AntDesign}
                name="closecircle"
                size="6"
                color="danger.500"
              />
            </Pressable>

          </View>
        )}
        rightOpenValue={-60}

      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginLeft: 10,
    flex: 1,
    paddingLeft: 20,
    paddingTop: 7,
    paddingRight: 20,
    paddingBottom: 7,
    backgroundColor: "white",
    justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rowItem: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  background: {
    backgroundColor: "#f1f1f1",
    flex: 1,
    paddingBottom: 10,
  },
  image: {
    width: 22,
    height: 22,
  },
  swipeButton: {
    backgroundColor: "white",
    marginTop: 5,
    flex: 1,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: "powderblue",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    width: 50,
    height: 40,
  },
  rowBack: {
    marginTop: 5,
    marginLeft: 10,
    flex: 1,
    paddingLeft: 20,
    paddingTop: 7,
    paddingRight: 20,
    paddingBottom: 7,
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

});
