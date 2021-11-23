import React, {useEffect} from "react";
import * as Notifications from "expo-notifications";
import {ActivityIndicator, StyleSheet, View} from "react-native";

export const BackGround = () => {

  useEffect(() => {
    const receivListener = Notifications.addNotificationReceivedListener((notification) => {
      // 通知が発火すると、ここでペイロードにアクセスできる。
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // 通知をタップすると、このコールバックが発火する。
    });

    return () => {
      receivListener.remove();
      responseListener.remove();
    }
  })

  return null;
}

export const Loading = () => (
  <View style={styles.loadingContainer} >
    <ActivityIndicator size="large" />
  </View>
)

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
});
