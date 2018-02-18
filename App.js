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
import { Step1, Step2, Step3 } from "./dummy/tutorial";

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
          <Scene key="tutorial" hideNavBar >
            <Scene key="step1" component={Step1} title={'step1'} />
            <Scene key="step2" component={Step2} title={'step2'} />
            <Scene key="step3" component={Step3} title={'step3'} />
          </Scene>
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
