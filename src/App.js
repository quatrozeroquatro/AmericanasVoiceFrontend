import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Button, Modal, View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { requestPermission } from './Permissions';
import SystemSetting from "react-native-system-setting";
import Spinner from "react-native-spinkit";
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import axios from 'axios';
import base64 from 'react-native-base64';

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}

const mockProduct = {
  twilio: { 'custom.americanas-voice': {} },
  produto: { product_label: 'Undefined' },
  result_list: [
    {
      id: '1216852579',
      image: 'https://images-americanas.b2w.io/produtos/01/00/img/1216852/5/1216852587P1.jpg',
      name: 'Undefined',
      price: 1.99
    },
    {
      id: '88531303',
      image: 'https://images-americanas.b2w.io/produtos/01/00/img3/88531/3/88531301P1.jpg',
      name: 'Undefined',
      price: 1.99
    }
  ]
};

const Product = ({imageUrl, label, price}) => (<View style={{backgroundColor: "white", paddingHorizontal: 40, paddingVertical: 20, borderRadius: 10}}>
  <Image source={{uri: imageUrl}} style={{width: 200, height: 200, marginBottom: 10}} />
  <Text style={{fontSize: 22, color: "gray", marginBottom: 10}}>{label}</Text>
  <Image source={require("./assets/estrelas.png")} style={{marginBottom:10}} />
  <Text style={{fontSize: 30, fontWeight:"bold"}}>R$ {`${price}`.replace(".",",")}</Text>
</View>);

Tts.setDefaultLanguage('pt-BR');

const username = "SK9369eb8c364bafa5b73a85037bd09a29";
const password = "Jy0KWTvC2Gwup8R5oNKHP4TSPKjngUnS";
const authHeader = 'Basic ' + base64.encode(`${username}:${password}`);
const axiosInstance = axios.create({
  baseURL: "https://channels.autopilot.twilio.com/v2/ACfbb4413ef6cbca33a7d4b18467d2b27c/UA3642765013267abc3691fd33294a0c59",
  headers: {
    "Authorization": authHeader,
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

const americanasVoiceSay = async (text) => {
  try {
    const response = await axiosInstance.post("/custom/americanas-voice",new URLSearchParams({
      UserId: `Yasmin ${+new Date}`,
      Text: text,
      Language: "en-US"
    }));
    console.log("RESPONSE", response);
    return response.data;
  } catch (error) {
    console.log("ERROR", error, error.response);
  }
  
}

const AssistRequestView = ({ visible, onClose, speaking, item }) => {

  return <Modal animationType="fade" visible={visible} transparent={true}>
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,.90)", justifyContent: "center", alignItems: "center" }}>
      { !item ? <View style={{ justifyContent: "center", alignItems: "center", height: 250 }}>
        <Spinner style={{ position: "absolute" }} isVisible={speaking} size={200} type="Pulse" color="red" />
        <Spinner isVisible={speaking} size={150} type="Bounce" color="red" />
        <Image style={{ position: "absolute" }} source={require("./assets/assistente-logo.png")} />
      </View> :
      <Product label={item.result_list[0].name} imageUrl={item.result_list[0].image} price={item.result_list[0].price} />
      }
      <TouchableOpacity onPress={onClose} style={{ padding: 20 }}>
        <Text style={{ color: "white" }}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
}

var assistState=0; // 0 waiting - 1 speaking - 2 wait action
SystemSetting.setVolume(0);

function HomeScreen() {
  const [assistRequest, setAssistRequest] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [item, setItem] = useState(mockProduct);

  useEffect(() => {
    Voice.onSpeechStart = (e) => {
      console.log("onSpeechStart", e);
    };

    Voice.onSpeechEnd = (e) => {
      console.log("onSpeechEnd", e);
    };

    Voice.onSpeechResults = debounce((e) => {
      console.log("\n\n\nonSpeechResults", e, "\n\n\n\n");
      if (e.value && e.value.length > 0) {
        const texto = e.value[0];
        console.log("XABLAU", texto);
        if (e.value.find(v => v.toLowerCase() === "olá americanas") && assistState==0) {
          assistState = 1;
          SystemSetting.setVolume(1);
          setAssistRequest(true);
          setSpeaking(true);
          setTimeout( () => {
            Tts.speak('Olá! Como eu posso te ajudar?')
          }, 900 );
          setTimeout(() => { 
            setSpeaking(false);
            assistState = 2;
            SystemSetting.setVolume(0);
          }, 5000);
          return true;
        } else if(assistState === 2) {
          americanasVoiceSay(texto).then(data => {
            assistState = 1;
            SystemSetting.setVolume(1);
            const {response,dialogue} = data;
            const {says} = response;
            const {memory, current_task} = dialogue;
            const memoryParsed = JSON.parse(memory);
            
            if (says && says.length > 0){
              setSpeaking(true);
              Tts.speak(says.map(e => e.text).join(". "));
              setTimeout(() => {
                setSpeaking(false);
                assistState = 2;
                SystemSetting.setVolume(0);
              }, 10000);
            }

            console.log(`>>>>>>>>>>>\n\n${JSON.stringify(says)}\n${current_task}\n${JSON.stringify(memoryParsed)}\n\n>>>>>>>>>>>>>>`);
          });
        }
      }
    }, 50);

    Voice.onSpeechPartialResults = (e) => {
      //console.log("onSpeechPartialResults", e);
    }

    Voice.onSpeechRecognized = (e) => {
      console.log("onSpeechRecognized", e);
    }

    Voice.onSpeechVolumeChanged = (e) => {
      //console.log("onSpeechVolumeChanged", e);
    }

    requestPermission();

    Voice.getSpeechRecognitionServices().then((e) => console.log("getSpeechRecognitionServices", e));

    console.log("VIM AQUI!");
    
    const interval = setInterval(() => {
      if (assistState === 0 || assistState === 2){ //waiting or wait action
        Voice.isRecognizing().then(v => {
          console.log("isRecognizing: ", v);
          if (!v) {
            setTimeout(() => Voice.start("pt-BR"), 1000 );
          }
        });
      }
    },2000);

    return () => {
      console.log("AQUI!");
      clearInterval(interval);
      Voice.removeAllListeners();
      Voice.destroy();
    }
  }, []);

  return (<>
    <AssistRequestView item={item} speaking={speaking} visible={assistRequest} onClose={() => {
      setAssistRequest(false);
      setSpeaking(false);
      assistState=0;
      setItem(undefined);
    }} />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Image style={{ width: "90%", resizeMode: "stretch" }} source={require("./assets/home-banner1.png")} />
      <Image style={{ width: "90%", resizeMode: "stretch" }} source={require("./assets/home-banner2.png")} />
      <Image style={{ width: "100%", height: 300, resizeMode: "stretch" }} source={require("./assets/home-banner-slider.png")} />
      <Image style={{ width: "90%", resizeMode: "stretch" }} source={require("./assets/home-banner-iphone.png")} />
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
    flex: 1,
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