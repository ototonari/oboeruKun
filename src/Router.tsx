import React from "react";
import {StyleSheet, Image, View, ImageSourcePropType, TouchableOpacity} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RemindMeView from "./Component/RemindMe/RemindMe"
import Developers from "./Component/Config/Credit";
import AgendaView from "../calenders/agendaView";
import { NoticeSetting, RegisterSetting } from "../config/noticeSetting";
import {Tutorial} from "./Component/Tutorial/Tutorial";
import ConfigView from "./Component/Config/Config"
import TitleList from "./Component/Config/TitleList"
import {ScreenKey, TabKey} from "./Config/Const";
import { Icons } from "./Config/Assets"
import {locale} from "./Config/Locale";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Calender: undefined;
  Agenda: undefined;
  RemindMe: undefined;
  TitleSetting: undefined;
  NoticeSetting: undefined;
  RegisterSetting: undefined;
  Developers: undefined;
  Tutorial: undefined;
  ConfigTab: undefined;
  AgendaContainer: undefined;
};

const {scene} = locale;

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
      <Tab.Screen name={TabKey.Calendar} component={AgendaContainer} options={{headerShown: false, title: scene.agenda}} />
      <Tab.Screen name={TabKey.ConfigTab} component={ConfigView} options={{title: scene.config}} />
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
          name={ScreenKey.RemindMe}
          component={RemindMeView}
          options={{
            title: scene.register
          }}
        />
        <Stack.Screen name={ScreenKey.TitleSetting} component={TitleList} options={{title: scene.titleList}} />
        <Stack.Screen
          name={ScreenKey.NoticeSetting}
          component={NoticeSetting}
          options={({navigation}) => ({
            title: scene.noticeSetting,
            headerRight: RightButton(() => navigation.navigate(ScreenKey.RegisterSetting))
          })
          }
        />
        <Stack.Screen name={ScreenKey.RegisterSetting} component={RegisterSetting} />
        <Stack.Screen name={ScreenKey.Developers} component={Developers} options={{title: scene.developer}} />
        <Stack.Screen name={ScreenKey.Tutorial} component={Tutorial} options={{title: scene.tutorial, headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type AgendaContainerProps = NativeStackScreenProps<RootStackParamList, 'AgendaContainer'>;

function AgendaContainer({ navigation }: AgendaContainerProps) {
  return (
      <Stack.Navigator initialRouteName={ScreenKey.Agenda}>
        <Stack.Screen
          name={ScreenKey.Agenda}
          component={AgendaView}
          options={{
            // eslint-disable-next-line react/prop-types
            headerRight: RightButton(() => navigation.navigate(ScreenKey.RemindMe)),
            title: scene.agenda
          }
        } />
      </Stack.Navigator>
  )
}

export default AppRouter;
