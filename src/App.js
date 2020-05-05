import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import Router from "./Router";

function App() {
  return (
    <SafeAreaView style={styles.safearea}>
      <Router />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#EAEAEA"
  }
});

export default App;