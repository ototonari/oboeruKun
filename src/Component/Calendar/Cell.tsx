import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {ItemProps} from "./Action";
import {locale} from "../../Config/Locale"

interface CellPropsI {
  item: ItemProps;
  onPress: (id : number, key: string) => void;
}

function _Cell(props: CellPropsI) {
  const {item, onPress} = props;
  const {data} = locale;
  const _onPress = () => onPress(item.id, item.noticeDate)

  const page = item.page ? (
    <Text>
      {data.page}: {item.page.startPage} ~ {item.page.endPage}
    </Text>
  ) : null;
  const memo = item.memo ? (
    <Text>
      {data.memo}: {item.memo}
    </Text>
  ) : null;

  return (
    <TouchableOpacity style={[{flex: 1}, styles.cellPosition]} onPress={_onPress}>
      <View style={[{flex: 1}, styles.sidebar]}>
        <View style={[{flex: 1}, styles.item]}>
          <Text style={{fontSize: 15, fontWeight: "bold"}}>{item.title}</Text>
          {page}
          {memo}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const Cell = React.memo(_Cell);

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
  },
  sidebar: {
    borderRightColor: "#16aef8",
    borderRightWidth: 2,
  },
  swipeButton: {
    backgroundColor: "white",
    flex: 1,
    paddingLeft: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  cellPosition: {
    position: "relative",
    top: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Cell;
