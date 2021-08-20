import React, { useState } from "react";
import { initialize } from "./update";
import { AppLoading } from "expo";
import { assetsLoad } from "./components";
import AppRouter from "./src/Router";

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
        startAsync={assetsLoad}
        onFinish={() => setUserStatus(USER_STATUS.PLAY)}
        onError={console.warn}
      />
      );

    // case USER_STATUS.GETTING_STARTED:
    //   return null;

    case USER_STATUS.PLAY:
      initialize();
      return (<AppRouter />);
  }
}

export default App;
