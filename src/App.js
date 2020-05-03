import React, {useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { requestPermission } from './Permissions';

import Voice from '@react-native-community/voice';

function HomeScreen() {
  
  useEffect(() => {
    requestPermission();

    Voice.getSpeechRecognitionServices().then((e) => console.log("getSpeechRecognitionServices", e));

    Voice.onSpeechStart = (e) => {
      console.log("onSpeechStart", e);
    };

    Voice.onSpeechEnd = (e) => {
      console.log("onSpeechEnd", e);
      setTimeout( () => Voice.start("pt-BR"), 500);
    };
    
    Voice.onSpeechResults = (e) => {
      console.log("onSpeechResults", e);
    };

    Voice.onSpeechPartialResults = (e) => {
      console.log("onSpeechPartialResults", e);
    }
    
    Voice.onSpeechRecognized = (e) => {
      console.log("onSpeechRecognized", e);
    }
    
    Voice.onSpeechVolumeChanged = (e) => {
      console.log("onSpeechVolumeChanged", e);
    }

    // let interval, timeout;

    // interval = setInterval(() => {
    //   Voice.isRecognizing().then((isRecognizing) => {
    //     if (!isRecognizing) {
    //       console.log("Start voice...");
    //       Voice.start("pt-BR");
    //       timeout = setTimeout(() => {
    //         console.log("Stop voice...");
    //         Voice.stop();
    //       },9000);
    //     } else {
    //       console.log("Recognizing yet...");
    //     }
    //   });
    // }, 10000);

    Voice.start("pt-BR");

    return () => {
      console.log("AQUI!");
      // if (timeout) clearTimeout(timeout);
      // if (interval) clearInterval(interval);
      Voice.stop();
      Voice.removeAllListeners();
      Voice.destroy();
    }
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