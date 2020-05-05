import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Image, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, MyProductListScreen } from "./screen";

const Stack = createStackNavigator();

console.log(HomeScreen);

const ToolbarActions = (props) => (<View style={styles.toolbarActions}>
  <Image source={require("./assets/busca-icon.png")} />
  <Image source={require("./assets/cesta-compra-icon.png")} />
</View>);

export default () => (<NavigationContainer>
    <Stack.Navigator screenOptions={{
        headerStyle: styles.toolbar,
        headerLeft: (props) => <Image style={styles.toolbarMenuHamburger} source={require("./assets/menu-hamburger-icon.png")} />,
        headerTitle: (props) => <Image style={styles.logo} source={require("./assets/logo.png")} />,
        headerRight: (props) => <ToolbarActions {...props} />
    }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Minha Lista" component={MyProductListScreen} />
    </Stack.Navigator>
</NavigationContainer>);

const styles = StyleSheet.create({
    toolbar: {
      backgroundColor: "#E60014",
    },
    toolbarMenuHamburger: {
      marginLeft: 20,
      height: 15
    },
    logo: {
      height: 22,
      flexGrow: 1,
      alignSelf: "center",
      // backgroundColor: "pink",
      width:120,
      resizeMode: "contain"
    },
    toolbarActions: {
      marginRight: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center"
    }
  });