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
import {ScreenKey, TabKey} from "./Const";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const language = loadLanguage("scene");
const titles = Locale.jp.scene;

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

function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused }: {focused: boolean}) => {
          return <TabIcon2 screenName={route.name} isFocused={focused} />;
        },
        headerShown: true

      })}
    >
      {/*右ボタンの位置が崩れるため、あえて1階層余分にStack.Navigatorを挟んでいる*/}
      <Tab.Screen name={TabKey.Calendar} component={AgendaContainer} options={{headerShown: false}} />
      <Tab.Screen name={TabKey.ConfigTab} component={ConfigView} options={{title: titles.config}} />
    </Tab.Navigator>
  );
}

const RightButton = (callBack) => () =>
  <TouchableOpacity onPress={callBack} >
    <Image
      source={require("../assets/plus.png")}
      style={{ width:20, height: 20}}
      resizeMode={'contain'}
    />
  </TouchableOpacity>

function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name={ScreenKey.Home}
          component={HomeScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name={ScreenKey.Register}
          component={RegisterView}
          options={{
            title: titles.register
          }}
        />
        <Stack.Screen name={ScreenKey.TitleSetting} component={TitleList} options={{title: titles.titleList}} />
        <Stack.Screen
          name={ScreenKey.NoticeSetting}
          component={NoticeSetting}
          options={({navigation}) => ({
            title: titles.noticeSetting,
            headerRight: RightButton(() => navigation.navigate(ScreenKey.RegisterSetting))
          })
          }
        />
        <Stack.Screen name={ScreenKey.RegisterSetting} component={RegisterSetting} />
        <Stack.Screen name={ScreenKey.Developers} component={Developers} options={{title: titles.developer}} />
        <Stack.Screen name={ScreenKey.Tutorial} component={Tutorial} options={{title: titles.tutorial}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AgendaContainer({ navigation }) {
  return (
      <Stack.Navigator initialRouteName={ScreenKey.Agenda}>
        <Stack.Screen
          name={ScreenKey.Agenda}
          component={AgendaView}
          options={{
            headerRight: RightButton(() => navigation.navigate(ScreenKey.Register)),
            title: titles.agenda
        }
        } />
      </Stack.Navigator>
  )
}


// TODO: 戻れないバグあり。
function _AppRouter() {
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
