import React from "react";
import {StyleSheet, Platform, Image, View, ImageSourcePropType, TouchableOpacity} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterView from "../register/registerView";
import { Actions, Router, Scene, Tabs } from "react-native-router-flux";
import Developers from "./Component/Config/Credit";
import AgendaView from "../calenders/agendaView";
import TitleList from "../config/titleList";
import { NoticeSetting, RegisterSetting } from "../config/noticeSetting";
import { loadLanguage, TabIcon } from "../components";
import {Tutorial} from "./Tutorial/Tutorial";
import {Locale} from "./Config/Language"
import ConfigView from "./Component/Config/Config"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const language = loadLanguage("scene");
const titles = Locale.jp.scene;

export enum ScreenKey {
  Agenda= "Agenda",
  Config= "Config",
  Register= "Register",
  Developers="Developers",
  TitleSetting = "TitleSetting",
  NoticeSetting = "NoticeSetting",
  RegisterSetting = "RegisterSetting",
  Tutorial = "Tutorial"
}

export enum TabKey {
  Calendar = "Calender",
  ConfigTab = "ConfigTab"
}

function TabIcon2 ({screenName, isFocused}: {screenName: string, isFocused: boolean}){
  const _iconList = {
    calender: {
      active: require("../assets/icon/iconList.png"),
      inactive: require("../assets/icon/iconList2.png"),
    },
    config: {
      active: require("../assets/icon/configuration_true.png"),
      inactive: require("../assets/icon/configuration_false.png"),
    },
  };

  const _style = StyleSheet.create({
    imageIcon: {
      width: 25,
      height: 25,
    }
  });

  const managerIcon = (key: string, isFocused: boolean) => {
    let source: ImageSourcePropType | null;
    if (key === TabKey.Calendar) {
      source = isFocused ? _iconList.calender.active : _iconList.calender.inactive
    } else if (key === TabKey.ConfigTab) {
      source = isFocused ? _iconList.config.active : _iconList.config.inactive
    } else {
      source = null;
    }

    if (source !== null) {
      return (
        <Image
          source={source}
          style={_style.imageIcon}
          resizeMode={'contain'}
        />
      );
    } else {
      return (<View />);
    }
  };

  return managerIcon(screenName, isFocused);
}

function _AppRouter() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ focused }: {focused: boolean}) => {
            return <TabIcon2 screenName={route.name} isFocused={focused} />;
          },
          headerShown: false
        })}
      >
        <Tab.Screen name={TabKey.Calendar} component={CalendarTabContainer} />
        <Tab.Screen name={TabKey.ConfigTab} component={ConfigTabContainer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function CalendarTabContainer({ navigation }) {
  return (
      <Stack.Navigator initialRouteName={ScreenKey.Agenda}>
        <Stack.Screen
          name={ScreenKey.Agenda}
          component={AgendaView}
          options={{
            headerRight: function RightButton () {
              return <TouchableOpacity onPress={() => {
                console.log("CalendarTabContainer")
                navigation.navigate(ScreenKey.Register)
              }} >
                <Image
                  source={require("../assets/plus.png")}
                  style={{ width:20, height: 20}}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            },
            title: titles.agenda
        }
        } />
        <Stack.Screen
          name={ScreenKey.Register}
          component={RegisterView}
          options={{
            title: titles.register
          }}
        />
      </Stack.Navigator>
  )
}

function ConfigTabContainer ({ navigation }) {
  return (
    <Stack.Navigator initialRouteName={ScreenKey.Config}>
      <Stack.Screen name={ScreenKey.Config} component={ConfigView} options={{title: titles.config}} />
      <Stack.Screen name={ScreenKey.TitleSetting} component={TitleList} options={{title: titles.titleList}} />
      <Stack.Screen name={ScreenKey.NoticeSetting} component={NoticeSetting} options={{title: titles.noticeSetting, headerRight: function RightButton () {
          return <TouchableOpacity onPress={() => {
            console.log("ConfigTabContainer.")
            navigation.navigate(ScreenKey.RegisterSetting)
          }} >
            <Image
              source={require("../assets/plus.png")}
              style={{ width:20, height: 20}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        },}} />
      <Stack.Screen name={ScreenKey.Developers} component={Developers} options={{title: titles.developer}} />
      <Stack.Screen name={ScreenKey.Tutorial} component={Tutorial} options={{title: titles.tutorial}} />
      <Stack.Screen name={ScreenKey.RegisterSetting} component={RegisterSetting} />
    </Stack.Navigator>
  )
}

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

export default _AppRouter;
