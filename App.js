import React from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";
import { Provider } from "react-redux";
import AppNavigator from "./nav";
import FlashMessage from "react-native-flash-message";
import store from "./store";
import { initDb } from "./utils/db";

enableScreens();

initDb();

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <AppNavigator />
      <FlashMessage />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
