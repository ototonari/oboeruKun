import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MeinmenuView from "./meinmenu/meinmenuView";
import RegisterView from "./register/registerView";
import ManagerView from "./manager/managerView";
import { Actions, Router, Scene } from "react-native-router-flux";
import { initialize } from "./update";


export default class App extends React.Component {
  
  render() {
    initialize()
    return (
      <Router>
        <Scene key="root"  >
          <Scene key="meinmenu" component={MeinmenuView} initial />
          <Scene key="register" component={RegisterView} />
          <Scene key="manager" component={ManagerView} />
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
