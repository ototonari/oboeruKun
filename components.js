import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

export let locale = {
  country: "JP",
};

export class Avatar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.source !== "") {
      let uri = this.props.source;
      return <Image source={{ uri: uri }} style={this.props.style} />;
    } else {
      return <Image source={require("./assets/camera.png")} />;
    }
  }
}

export class TabIcon extends Component {
  constructor(props) {
    super(props);
  }

  _iconList = {
    calender: {
      active: require("./assets/icon/iconList.png"),
      inactive: require("./assets/icon/iconList2.png"),
    },
    config: {
      active: require("./assets/icon/configuration_true.png"),
      inactive: require("./assets/icon/configuration_false.png"),
    },
  };

  _style = StyleSheet.create({
    tabText: {
      color: "gray",
    },
    tabTextActive: {
      color: "blue",
    },
    imageIcon: {
      width: 30,
      height: 30,
      position: "absolute",
      top: -18,
      left: -15,
    },
    view: {},
  });

  managerIcon = (key, isFocused) => {
    if (key == "manager") {
      if (isFocused === true) {
        return (
          <Image
            source={this._iconList.calender.active}
            style={this._style.imageIcon}
          />
        );
      } else {
        return (
          <Image
            source={this._iconList.calender.inactive}
            style={this._style.imageIcon}
          />
        );
      }
    } else if (key == "config") {
      if (isFocused === true) {
        return (
          <Image
            source={this._iconList.config.active}
            style={this._style.imageIcon}
          />
        );
      } else {
        return (
          <Image
            source={this._iconList.config.inactive}
            style={this._style.imageIcon}
          />
        );
      }
    }
  };

  render() {
    const key = this.props.navigation.state.key;
    const isFocused = this.props.focused;
    return (
      <View style={this._style.view}>{this.managerIcon(key, isFocused)}</View>
    );
  }
}

export class FlatButton extends Component {
  constructor(props) {
    super(props);
  }

  style = StyleSheet.create({
    container: {
      borderColor: "gray",
      borderBottomWidth: 1,
      height: 50,
    },
    inContainer: {
      flex: 1,
      flexDirection: "row",
      paddingLeft: 15,
      paddingRight: 15,
      alignItems: "center",
      justifyContent: "space-between",
    },
    text: {
      fontSize: 20,
    },
    image: {
      width: 20,
      height: 20,
    },
  });
  render() {
    const text = this.props.text;
    const func = this.props.function;
    return (
      <TouchableOpacity onPress={() => func()} style={this.style.container}>
        <View style={this.style.inContainer}>
          <Text style={this.style.text}>{text}</Text>
          <Image
            source={require("./assets/right.png")}
            style={this.style.image}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
