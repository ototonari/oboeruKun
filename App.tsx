import React, {useState} from "react";
import {NativeBaseProvider} from 'native-base';
import AppLoading from 'expo-app-loading';
import AppRouter from "./src/Router";
import {initialization, isDebugMode} from "./src/Config/Libs";
import RemindMe from "./src/Component/RemindMe/RemindMe";

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
            isDebugMode() ? USER_STATUS.DEBUG : USER_STATUS.PLAY
          )}
          onError={console.warn}
        />
      );

    case USER_STATUS.DEBUG:
      return (
        <NativeBaseProvider>
          <RemindMe/>
        </NativeBaseProvider>
      )

    case USER_STATUS.PLAY:
      return (
        <NativeBaseProvider>
          <AppRouter/>
        </NativeBaseProvider>
      );
  }
}

export default App;
