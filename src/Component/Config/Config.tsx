import React from "react";
import { View, Linking, Alert } from "react-native";
import { FlatButton } from "../../../components";
import {ScreenKey} from "../../Config/Const";
import {locale} from "../../Config/Locale";

const privacyPolicy = "https://oboerukun.firebaseapp.com/";

function Config ({ navigation }) {
  const {scene} = locale;
  return (
    <View style={{ flex: 1 }}>
      <FlatButton
        text={scene.titleList}
        function={() => navigation.navigate(ScreenKey.TitleSetting)}
      />
      <FlatButton
        text={scene.noticeSetting}
        function={() => navigation.navigate(ScreenKey.NoticeSetting)}
      />
      <FlatButton text={scene.tutorial} function={() => navigation.navigate(ScreenKey.Tutorial)} />
      <FlatButton
        text={scene.developer}
        function={() => navigation.navigate(ScreenKey.Developers)}
      />
      <FlatButton
        text={scene.privacyPolicy.configText}
        function={() => {
          Alert.alert(
            scene.privacyPolicy.alertTitle,
            scene.privacyPolicy.alertText,
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