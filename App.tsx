import React, { useState } from "react";
import { initialize } from "./update";
import { AppLoading } from "expo";
import { assetsLoad } from "./components";
import AppRouter from "./src/Router";

function App() {
  const [isReady, setReady] = useState(false);

  if (isReady === false) {
    return (
      <AppLoading
        startAsync={assetsLoad}
        onFinish={() => setReady(true)}
        onError={console.warn}
      />
    );
  } else {
    initialize();
    return <AppRouter />;
  }
}

export default App;
