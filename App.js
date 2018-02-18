import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MeinmenuView from "./meinmenu/meinmenuView";
import RegisterView from "./register/registerView";
import ManagerView from "./manager/managerView";
import { Actions, Router, Scene } from "react-native-router-flux";
import { initialize } from "./update";
import tabIcon from "./dummy/tabIcon";
import ConfigView from "./config/config";
import Developers from "./config/developer"

export default class App extends React.Component {
  
  render() {
    initialize()
    return (
      <Router>
        <Scene key="root"  >
          <Scene key="tabbar" tabs >
            <Scene key="manager" initial component={ManagerView} icon={tabIcon} onRight={() => Actions.register()} rightButtonImage={require('./assets/plus.png')} />
            <Scene key="config" component={ConfigView} icon={tabIcon} />
          </Scene>
          <Scene key="register" component={RegisterView} title={'登録画面'} />
          <Scene key="developers" component={Developers} title={'Developers'} />
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
