import React from "react";
import { View, Linking, Alert } from "react-native";
import { FlatButton, loadLanguage } from "../../../components";
import {ScreenKey} from "../../Const";

const privacyPolicy = "https://oboerukun.firebaseapp.com/";

function Config ({ navigation }) {
  const language = loadLanguage("scene");
  return (
    <View style={{ flex: 1 }}>
      <FlatButton
        text={language.titleList}
        function={() => navigation.navigate(ScreenKey.TitleSetting)}
      />
      <FlatButton
        text={language.noticeSetting}
        function={() => navigation.navigate(ScreenKey.NoticeSetting)}
      />
      <FlatButton text={language.tutorial} function={() => navigation.navigate(ScreenKey.Tutorial)} />
      <FlatButton
        text={language.developer}
        function={() => navigation.navigate(ScreenKey.Developers)}
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

export default Config;