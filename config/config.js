import React, { Component } from "react";
import { View, Linking, Alert } from "react-native";
import { Actions } from "react-native-router-flux";
import { FlatButton, loadLanguage } from "../components";
import { startTutorial } from "../update";

const privacyPolicy = "https://oboerukun.firebaseapp.com/";

export default class ConfigView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const language = loadLanguage("scene");
    return (
      <View style={{ flex: 1 }}>
        <FlatButton
          text={language.titleList}
          function={() => Actions.titlelist()}
        />
        <FlatButton
          text={language.noticeSetting}
          function={() => Actions.noticesetting()}
        />
        <FlatButton text={language.tutorial} function={() => startTutorial()} />
        <FlatButton
          text={language.developer}
          function={() => Actions.developers()}
        />
        <FlatButton
          text={language.privacyPolicy.configText}
          function={() => {
            Alert.alert(
              language.privacyPolicy.alertTitle,
              language.privacyPolicy.alertText,
              [
                {
                  text: "OK",
                  onPress: () => {
                    Linking.openURL(privacyPolicy);
                  },
                },
                { text: "Cancel", onPress: () => {}, style: "cancel" },
              ],
              { cancelable: true }
            );
          }}
        />
      </View>
    );
  }
}
