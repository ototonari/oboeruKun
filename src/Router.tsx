import React from "react";
import { StyleSheet, Platform } from "react-native";
import RegisterView from "../register/registerView";
import { Actions, Router, Scene, Tabs } from "react-native-router-flux";
import ConfigView from "../config/config";
import Developers from "../config/developer";
import { Step0, Step1, Step2, Step3, Step4, Step5 } from "../dummy/tutorial";
import AgendaView from "../calenders/agendaView";
import TitleList from "../config/titleList";
import { NoticeSetting, RegisterSetting } from "../config/noticeSetting";
import { loadLanguage, TabIcon } from "../components";

const language = loadLanguage("scene");

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
        <Scene key="tutorial" hideNavBar>
          <Scene key="step0" component={Step0} title={"step0"} />
          <Scene key="step1" component={Step1} title={"step1"} />
          <Scene key="step2" component={Step2} title={"step2"} />
          <Scene key="step3" component={Step3} title={"step3"} />
          <Scene key="step4" component={Step4} title={"step4"} />
          <Scene key="step5" component={Step5} title={"step5"} />
        </Scene>
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
