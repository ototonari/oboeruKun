import React from "react";
import { StyleSheet, Platform } from "react-native";
import RegisterView from "../register/registerView";
import { Actions, Router, Scene, Tabs } from "react-native-router-flux";
import ConfigView from "../config/config";
import Developers from "../config/developer";
import AgendaView from "../calenders/agendaView";
import TitleList from "../config/titleList";
import { NoticeSetting, RegisterSetting } from "../config/noticeSetting";
import { loadLanguage, TabIcon } from "../components";
import {Tutorial} from "./Tutorial/Tutorial";

const language = loadLanguage("scene");
// TODO: 戻れないバグあり。
function AppRouter() {
  return (
    <Router>
      <Scene key="root">
        <Tabs
          key="tabbar"
          hideNavBar
          swipeEnabled={false}
          tabBarPosition={"bottom"}
        >
          <Scene
            key="manager"
            iconName="agenda"
            title={language.agenda}
            initial={true}
            component={AgendaView}
            icon={TabIcon}
            onRight={() => Actions.push("register")}
            // eslint-disable-next-line no-undef
            rightButtonImage={require("../assets/plus.png")}
          />
          <Scene
            key="config"
            title={language.config}
            component={ConfigView}
            icon={TabIcon}
          />
        </Tabs>
        <Scene
          sceneStyle={styles.oneCompHeader}
          key="register"
          component={RegisterView}
          title={language.register}
        />
        <Scene
          sceneStyle={styles.oneCompHeader}
          key="developers"
          component={Developers}
          title={language.developer}
        />
        <Scene
          sceneStyle={styles.oneCompHeader}
          key="titlelist"
          component={TitleList}
          title={language.titleList}
        />
        <Scene
          sceneStyle={styles.oneCompHeader}
          key="noticesetting"
          component={NoticeSetting}
          title={language.noticeSetting}
          // eslint-disable-next-line no-undef
          rightButtonImage={require("../assets/plus.png")}
          onRight={() => Actions.registersetting()}
        />
        <Scene
          sceneStyle={styles.oneCompHeader}
          key="registersetting"
          component={RegisterSetting}
        />
        <Scene hideNavBar key="tutorial" component={Tutorial} title={"Tutorial"} />
        {/*<Scene*/}
        {/*  sceneStyle={styles.oneCompHeader}*/}
        {/*  key="localNotification"*/}
        {/*  component={LocalNotification}*/}
        {/*  initial={true}*/}
        {/*/>*/}
      </Scene>
    </Router>
  );
}

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        paddingTop: 13,
      },
    }),
  },
  oneCompHeader: {
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        position: "absolute",
        top: 30,
      },
    }),
  },
});

export default AppRouter;
