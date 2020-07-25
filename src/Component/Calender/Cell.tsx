import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface CellPropsI {
  item: any;
  language: any;
}

function Cell(props: CellPropsI) {
  const { item, language } = props;
  const page = item.page ? (
    <Text>
      {language.page}: {item.page.startPage} ~ {item.page.endPage}
    </Text>
  ) : null;
  const memo = item.memo ? (
    <Text>
      {language.memo}: {item.memo}
    </Text>
  ) : null;

  return (
    <View style={[{ flex: 1 }, styles.cellPosition]}>
      <View style={[{ flex: 1 }, styles.sidebar]}>
        <View style={[{ flex: 1 }, styles.item]}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.title}</Text>
          {page}
          {memo}
        </View>
      </View>
    </View>
  );
}

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
