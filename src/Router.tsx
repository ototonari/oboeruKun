import React from "react";
import {
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Developers from "./Component/Config/Credit";
import { RegisterSetting } from "../config/noticeSetting";
import { Tutorial } from "./Component/Tutorial/Tutorial";
import ConfigView from "./Component/Config/Config";
import {TitleHistory} from "./Component/Config/TitleList";
import { ScreenKey, TabKey } from "./Config/Const";
import { Icons } from "./Config/Assets";
import { locale } from "./Config/Locale";
import { Calendar } from "./Component/Calendar/Calendar";
import { RemindMe } from "./Component/RemindMe/RemindMe";
import {NoticeSetting} from "./Component/Config/NoticeSetting";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Calender: undefined;
  RemindMe: undefined;
  TitleSetting: undefined;
  NoticeSetting: undefined;
  RegisterSetting: undefined;
  Developers: undefined;
  Tutorial: undefined;
  ConfigTab: undefined;
};

const { scene } = locale;

function TabIcon2({
  screenName,
  isFocused,
}: {
  screenName: string;
  isFocused: boolean;
}) {
  const _style = StyleSheet.create({
    imageIcon: {
      width: 25,
      height: 25,
    },
  });

  const managerIcon = (key: string, isFocused: boolean) => {
    let source: ImageSourcePropType | null;
    if (key === TabKey.Calendar) {
      source = isFocused ? Icons.calender.active : Icons.calender.inactive;
    } else if (key === TabKey.ConfigTab) {
      source = isFocused ? Icons.config.active : Icons.config.inactive;
    } else if (key === TabKey.RemindMe) {
      source = Icons.button.plus;
    } else {
      source = null;
    }

    if (source !== null) {
      return (
        <Image
          source={source}
          style={_style.imageIcon}
          resizeMode={"contain"}
        />
      );
    } else {
      return <View />;
    }
  };

  return managerIcon(screenName, isFocused);
}

function HomeContainer() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <TabIcon2 screenName={route.name} isFocused={focused} />;
        },
        headerShown: true,
      })}
    >
      <Tab.Screen
        name={TabKey.Calendar}
        component={Calendar}
        options={{ title: scene.agenda }}
      />
      <Tab.Screen
        name={TabKey.ConfigTab}
        component={ConfigView}
        options={{ title: scene.config }}
      />
    </Tab.Navigator>
  );
}

function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenKey.Home}
          component={HomeContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ScreenKey.RemindMe}
          component={RemindMe}
          options={{ headerShown: false, title: scene.register }}
        />
        <Stack.Screen
          name={ScreenKey.TitleSetting}
          component={TitleHistory}
          options={{ title: scene.titleList }}
        />
        <Stack.Screen
          name={ScreenKey.NoticeSetting}
          component={NoticeSetting}
          options={{ title: scene.noticeSetting }}
        />
        <Stack.Screen
          name={ScreenKey.RegisterSetting}
          component={RegisterSetting}
        />
        <Stack.Screen
          name={ScreenKey.Developers}
          component={Developers}
          options={{ title: scene.developer }}
        />
        <Stack.Screen
          name={ScreenKey.Tutorial}
          component={Tutorial}
          options={{ title: scene.tutorial, headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRouter;
