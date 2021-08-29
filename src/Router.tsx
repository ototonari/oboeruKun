import React from "react";
import {StyleSheet, Image, View, ImageSourcePropType, TouchableOpacity} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterView from "../register/registerView";
import Developers from "./Component/Config/Credit";
import AgendaView from "../calenders/agendaView";
import { NoticeSetting, RegisterSetting } from "../config/noticeSetting";
import {Tutorial} from "./Component/Tutorial/Tutorial";
import {Locale} from "./Config/Language"
import ConfigView from "./Component/Config/Config"
import TitleList from "./Component/Config/TitleList"
import {ScreenKey, TabKey} from "./Config/Const";
import { Icons } from "./Config/Assets"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const titles = Locale.jp.scene;

function TabIcon2 ({screenName, isFocused}: {screenName: string, isFocused: boolean}){
  const _style = StyleSheet.create({
    imageIcon: {
      width: 25,
      height: 25,
    }
  });

  const managerIcon = (key: string, isFocused: boolean) => {
    let source: ImageSourcePropType | null;
    if (key === TabKey.Calendar) {
      source = isFocused ? Icons.calender.active : Icons.calender.inactive
    } else if (key === TabKey.ConfigTab) {
      source = isFocused ? Icons.config.active : Icons.config.inactive
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

// eslint-disable-next-line react/display-name
const RightButton = (callBack: () => void) => () =>
  <TouchableOpacity onPress={callBack} >
    <Image
      source={Icons.button.plus}
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
        <Stack.Screen name={ScreenKey.Tutorial} component={Tutorial} options={{title: titles.tutorial, headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// @ts-ignore
// eslint-disable-next-line react/prop-types
function AgendaContainer({ navigation }) {
  return (
      <Stack.Navigator initialRouteName={ScreenKey.Agenda}>
        <Stack.Screen
          name={ScreenKey.Agenda}
          component={AgendaView}
          options={{
            // eslint-disable-next-line react/prop-types
            headerRight: RightButton(() => navigation.navigate(ScreenKey.Register)),
            title: titles.agenda
        }
        } />
      </Stack.Navigator>
  )
}

export default AppRouter;
