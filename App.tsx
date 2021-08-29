import React, {useState} from "react";
import AppLoading from 'expo-app-loading';
import AppRouter from "./src/Router";
import {initialization} from "./src/Config/Libs";

enum USER_STATUS {
  INITIALIZE,
  PLAY
}

function App() {
  const [userStatus, setUserStatus] = useState(USER_STATUS.INITIALIZE);

  switch (userStatus) {
    case USER_STATUS.INITIALIZE:
      return (
        <AppLoading
          startAsync={initialization}
          onFinish={() => setUserStatus(USER_STATUS.PLAY)}
          onError={console.warn}
        />
      );

    case USER_STATUS.PLAY:
      return (<AppRouter/>);
  }
}

export default App;
