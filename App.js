import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MeinmenuView from "./meinmenu/meinmenuView";
import RegisterView from "./register/registerView";
import ManagerView from "./manager/managerView";
import { Actions, Router, Scene } from "react-native-router-flux";
import { initialize } from "./update";
import tabIcon from "./dummy/tabIcon";
import ConfigView from "./dummy/config";
import bootRegister from "./dummy/bootRegister";

export default class App extends React.Component {
  
  render() {
    initialize()
    return (
      <Router>
        <Scene key="root"  >
          <Scene key="tabbar" tabs >
            <Scene key="manager" component={ManagerView} initial icon={tabIcon} title={'タスクいちらん'} onRight={() => Actions.register()} rightTitle="登録" />
            <Scene key="config" component={ConfigView} icon={tabIcon} title={'config'} />
          </Scene>
          <Scene key="register" component={RegisterView} icon={tabIcon} title={'登録画面'} />
        </Scene>
      </Router>
);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
