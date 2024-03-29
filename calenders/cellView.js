import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { setNotice } from "../database";
import { cancelNotification } from "../notification";

export default class CellView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    const page = (item) => {
      if (item.page !== null) {
        return (
          <Text>
            {this.props.language.page}: {item.page.startPage} ~{" "}
            {item.page.endPage}
          </Text>
        );
      }
    };
    const memo = (item) => {
      if (item.memo !== null) {
        return (
          <Text>
            {this.props.language.memo}: {item.memo}
          </Text>
        );
      }
    };

    const success = () => {
      if (item.notificationId !== null) {
        cancelNotification(item.notificationId);
      }
      setNotice(0, item.noticeDate, item.id).then(() => {
        let items = this.props.this.state.items;
        let thisItem;
        for (let i = 0, j = items[item.noticeDate].length; i < j; i++) {
          if (item.id == items[item.noticeDate][i].id) {
            thisItem = i;
            break;
          }
        }
        items[item.noticeDate].splice(thisItem, 1);
        this.props.onSuccess(items);
      });
    };

    return (
      <View style={[{ flex: 1 }, styles.cellPosition]}>
        <View style={[{ flex: 1 }, styles.sidebar]}>
          <View style={[{ flex: 1 }, styles.item]}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.title}
            </Text>
            {page(item)}
            {memo(item)}
          </View>
        </View>
      </View>
    );
  }
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
