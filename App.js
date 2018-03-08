import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import RegisterView from "./register/registerView";
import { Actions, Router, Scene, Tabs } from "react-native-router-flux";
import { initialize } from "./update";
import TabIcon from "./dummy/tabIcon";
import ConfigView from "./config/config";
import Developers from "./config/developer"
import { Step1, Step2, Step3 } from "./dummy/tutorial";
import AgendaView from "./calenders/agendaView";
import TitleList from "./config/titleList"


export default class App extends React.Component {
  render() {
    initialize()
    return (
      <Router>
        <Scene key="root"  >
          <Tabs 
            key="tabbar" 
            swipeEnabled={ false }
           >
            <Scene 
              key="manager"
              iconName="agenda"
              title="タスク一覧"
              initial={true}
              component={AgendaView} 
              icon={TabIcon} 
              onRight={() => Actions.register()} 
              rightButtonImage={require('./assets/plus.png')} 
            />
            <Scene 
              key="config" 
              title="設定"
              component={ConfigView} 
              icon={TabIcon} 
            />
          </Tabs>
          <Scene key="register" component={RegisterView} title={'登録画面'} />
          <Scene key="developers" component={Developers} title={'Developers'} />
          <Scene key="titlelist" component={TitleList} title={'タイトル履歴'} />
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

