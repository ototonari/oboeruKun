import React, {useEffect, useState} from "react";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import {SwipeListView} from 'react-native-swipe-list-view';
import {deleteList} from "../../../database";
import {locale} from "../../Config/Locale";
import {getAllTitleListAsync, TitleListType} from "../../IO/SQLite";
import {Icon, Pressable} from "native-base";
import {AntDesign} from "@expo/vector-icons";

type InitState = {
  type: 'Init',
  items: TitleListType[]
}

type ReadyState = {
  type: 'Ready',
  items: TitleListType[]
}

type ViewState = InitState | ReadyState;

const initState: InitState = {type: 'Init', items: []};

const emptyList: TitleListType[] = [{
  title: locale.titleList.emptyText,
  id: -1,
}]

export const TitleHistory = () => {
  const [state, setState] = useState<ViewState>(initState);

  const deleteTitle = (id: number) => {
    if (id === -1) return;
    deleteList(id).then(() => {
      setState(initState);
    })
  }

  useEffect(() => {
    if (state.type === 'Init') {
      // title load
      getAllTitleListAsync()
      .then((items) => {
        if (items.length === 0) {
          setState({
            type: 'Ready',
            items: emptyList
          })
        } else {
          setState({
            type: 'Ready',
            items: items
          })
        }
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
            <Text>{data.item.title}</Text>
          </View>
        )}
        renderHiddenItem={(data) => (
          <View style={styles.rowBack} key={String(data.item.id)}>
            <Pressable onPress={() => deleteTitle(data.item.id)}>
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
};

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
  background: {
    backgroundColor: "#f1f1f1",
    flex: 1,
    paddingBottom: 10,
  },
  image: {
    width: 22,
    height: 22,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    marginLeft: 10,
    paddingLeft: 20,
    paddingTop: 7,
    paddingRight: 20,
    paddingBottom: 7,
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,

  },

});
