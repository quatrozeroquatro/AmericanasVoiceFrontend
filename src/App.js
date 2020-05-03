import React, {useEffect, useState} from 'react';
import { TouchableOpacity, Button, Modal, View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { requestPermission } from './Permissions';
import SystemSetting from "react-native-system-setting";

import Voice from '@react-native-community/voice';

const AssistRequestView = ({visible, onClose}) => {

  return <Modal visible={visible} transparent={true}>
    <View style={{flex: 1, backgroundColor: "rgba(0,0,0,.90)", justifyContent: "center", alignItems: "center"}}>
      <Image source={require("./assets/assistente-logo.png")} />
      <TouchableOpacity onPress={onClose} style={{padding: 20}}>
        <Text style={{color: "white"}}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
}

function HomeScreen() {
  const [assistRequest, setAssistRequest] = useState(false);
  
  useEffect(() => {
    let interval1, interval2, timeout;

    requestPermission();

    Voice.getSpeechRecognitionServices().then((e) => console.log("getSpeechRecognitionServices", e));

    Voice.onSpeechStart = (e) => {
      console.log("onSpeechStart", e);
    };

    Voice.onSpeechEnd = (e) => {
      console.log("onSpeechEnd", e);
      // setTimeout(() => SystemSetting.setVolume(1), 500);
    };
    
    Voice.onSpeechResults = (e) => {
      console.log("\n\n\nonSpeechResults", e, "\n\n\n\n");
      if (e.value && e.value.length > 0) {
        e.value.forEach(v => {
          console.log( "XABLAU", v);
          if (v.toLowerCase() === "olá americanas") {
            alert("Match!");
            setAssistRequest(true);
          }
        });
      }
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

    interval1 = setInterval(() => {
      Voice.isRecognizing().then((isRecognizing) => {
        if (!isRecognizing) {
          console.log("Start voice...");
          // SystemSetting.setVolume(0);
          Voice.start("pt-BR")
    //       timeout = setTimeout(() => {
    //         console.log("Stop voice...");
    //         Voice.stop();
    //       },9000);
        } else {
          console.log("Recognizing yet...");
        }
      });
    }, 1000);

    interval2 = setInterval(() => {
      Voice.stop();
    }, 10000);

    Voice.start("pt-BR");
    SystemSetting.setVolume(0);

    return () => {
      console.log("AQUI!");
      // if (timeout) clearTimeout(timeout);
      if (interval1) clearInterval(interval1);
      if (interval2) clearInterval(interval2);
      Voice.stop();
      Voice.removeAllListeners();
      Voice.destroy();
    }
  }, []);

  return (<>
    <AssistRequestView visible={assistRequest} onClose={() => {
      setAssistRequest(false);
    }} />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Image style={{width: "90%", resizeMode: "stretch"}} source={require("./assets/home-banner1.png")} />
      <Image style={{width: "90%", resizeMode: "stretch"}} source={require("./assets/home-banner2.png")} />
      <Image  style={{width: "100%", height: 300, resizeMode: "stretch"}} source={require("./assets/home-banner-slider.png")} />
      <Image style={{width: "90%", resizeMode: "stretch"}} source={require("./assets/home-banner-iphone.png")} />
    </View>
  </>);
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