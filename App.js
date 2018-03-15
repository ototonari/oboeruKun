import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import RegisterView from "./register/registerView";
import { Actions, Router, Scene, Tabs } from "react-native-router-flux";
import { initialize } from "./update";
import TabIcon from "./dummy/tabIcon";
import ConfigView from "./config/config";
import Developers from "./config/developer"
import { Step0, Step1, Step2, Step3, Step4 } from "./dummy/tutorial";
import AgendaView from "./calenders/agendaView";
import TitleList from "./config/titleList"
import { NoticeSetting, RegisterSetting} from "./config/noticeSetting"
import InitializeView from "./config/initialize";

export default class App extends React.Component {
  render() {
    initialize()
    return (
      <Router sceneStyle={styles.header} >
        <Scene key="root" >
          <Tabs 
            key="tabbar" 
            swipeEnabled={ false }
            tabBarPosition={'bottom'}
           >
            <Scene 
              key="manager"
              iconName="agenda"
              title="カレンダー"
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
          <Scene key="initializeview" component={InitializeView} title={'初期化画面'} />
          <Scene key="titlelist" component={TitleList} title={'タイトル履歴'} />
          <Scene 
            key="noticesetting" 
            component={NoticeSetting} 
            title={'通知間隔の設定'} 
            rightButtonImage={require('./assets/plus.png')}
            onRight={() => Actions.registersetting()}
          />
          <Scene key="registersetting" component={RegisterSetting} />
          <Scene key="tutorial" hideNavBar >
            <Scene key="step0" component={Step0} title={'step0'} />
            <Scene key="step1" component={Step1} title={'step1'} />
            <Scene key="step2" component={Step2} title={'step2'} />
            <Scene key="step3" component={Step3} title={'step3'} />
            <Scene key="step4" component={Step4} title={'step4'} />
          </Scene>
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        paddingTop: 10,
      },
    }),
  },
});
