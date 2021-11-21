import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { ItemProps } from "./Action";
import { locale } from "../../Config/Locale";

interface CellPropsI {
  item: ItemProps;
  onPress: (id: number, key: string) => void;
}

function _Cell(props: CellPropsI) {
  const { item, onPress } = props;
  const { data: remind } = item;
  const { data } = locale;
  const _onPress = () => onPress(item.id, item.noticeDate);

  return (
    <TouchableOpacity
      style={[{ flex: 1 }, styles.cellPosition]}
      onPress={_onPress}
    >
      <View style={[{ flex: 1 }, styles.item]}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{remind.title}</Text>
        {remind.isUseRange() ? (
          <Text>
            {data.page}: {remind.range.start} ~ {remind.range.end}
          </Text>
        ) : null}
        {remind.isUseMemo() ? (
          <Text>
            {data.memo}: {remind.memo}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// const Cell = React.memo(_Cell);
const Cell = _Cell;

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
