import React, {useState} from "react";
import {NativeBaseProvider} from 'native-base';
import AppLoading from 'expo-app-loading';
import AppRouter from "./src/Router";
import {initialization} from "./src/Config/Libs";
import {BackGround} from "./src/Component/BackGround";

enum USER_STATUS {
  INITIALIZE,
  DEBUG,
  PLAY
}

function App() {
  const [userStatus, setUserStatus] = useState(USER_STATUS.INITIALIZE);

  switch (userStatus) {
    case USER_STATUS.INITIALIZE:
      return (
        <AppLoading
          startAsync={initialization}
          onFinish={() => setUserStatus(
            USER_STATUS.PLAY
          )}
          onError={console.warn}
        />
      );

    case USER_STATUS.DEBUG:
      console.debug("this is debug mode.")
      setUserStatus(USER_STATUS.PLAY);
      return null;

    case USER_STATUS.PLAY:
      return (
        <NativeBaseProvider>
          <AppRouter/>
          <BackGround />
        </NativeBaseProvider>
      );
  }
}

export default App;
