import React, {useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { requestPermission } from './Permissions';

function HomeScreen() {
  
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Image style={{width: "90%", resizeMode: "stretch"}} source={require("./assets/home-banner1.png")} />
      <Image style={{width: "90%", resizeMode: "stretch"}} source={require("./assets/home-banner2.png")} />
      <Image  style={{width: "100%", height: 300, resizeMode: "stretch"}} source={require("./assets/home-banner-slider.png")} />
      <Image style={{width: "90%", resizeMode: "stretch"}} source={require("./assets/home-banner-iphone.png")} />
    </View>
  );
}

const Stack = createStackNavigator();

const ToolbarActions = (props) => (<View style={styles.toolbarActions}>
  <Image source={require("./assets/busca-icon.png")} />
  <Image source={require("./assets/cesta-compra-icon.png")} />
</View>);

function App() {
  return (
    <SafeAreaView style={styles.safearea}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerStyle: styles.toolbar,
            headerLeft: (props) => <Image style={styles.toolbarMenuHamburger} source={require("./assets/menu-hamburger-icon.png")} />,
            headerTitle: (props) => <Image source={require("./assets/logo.png")} />,
            headerRight: (props) => <ToolbarActions {...props} />
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex:1,
    backgroundColor: "#EAEAEA"
  },
  toolbar: {
    backgroundColor: "#E60014",
  },
  toolbarMenuHamburger: {
    marginLeft: 20
  },
  toolbarActions: {
    marginRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
    // backgroundColor: "pink"
  }
});

export default App;