import React, { useState } from "react";
import { initialize } from "./update";
import AppLoading from 'expo-app-loading';
import AppRouter from "./src/Router";
import NewAppRouter from "./src/NewRouter"
import {cacheResourcesAsync} from "./src/Config/AssetLoader";

enum USER_STATUS {
  LOADING,
  // GETTING_STARTED,
  PLAY
}

function App() {
  const [userStatus, setUserStatus] = useState(USER_STATUS.LOADING);

  // TODO: チュートリアルを表示済かみたい。

  switch (userStatus) {
    case USER_STATUS.LOADING:
      return (
        <AppLoading
        startAsync={cacheResourcesAsync}
        onFinish={() => setUserStatus(USER_STATUS.PLAY)}
        onError={console.warn}
      />
      );

    // case USER_STATUS.GETTING_STARTED:
    //   return null;

    case USER_STATUS.PLAY:
      initialize();
      // return (<NewAppRouter />);
      return (<AppRouter />);
  }
}

export default App;
