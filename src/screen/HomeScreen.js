import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Modal, View, Text, Image, ScrollView } from 'react-native';
import SystemSetting from "react-native-system-setting";
import Spinner from "react-native-spinkit";
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';

import { requestPermission } from '../Permissions';
import { debounce } from '../Utils';
import { americanasVoiceSay } from '../ApiService';

import SplashScreen from "react-native-splash-screen";

// const mockProduct = {
//   twilio: { 'custom.americanas-voice': {} },
//   produto: { product_label: 'Undefined' },
//   result_list: [
//     {
//       id: '1216852579',
//       image: 'https://images-americanas.b2w.io/produtos/01/00/img/1216852/5/1216852587P1.jpg',
//       name: 'Undefined',
//       price: 1.99
//     },
//     {
//       id: '88531303',
//       image: 'https://images-americanas.b2w.io/produtos/01/00/img3/88531/3/88531301P1.jpg',
//       name: 'Undefined',
//       price: 1.99
//     }
//   ]
// };

const Product = ({ imageUrl, label, price }) => (<View style={{ backgroundColor: "white", paddingHorizontal: 40, paddingVertical: 20, borderRadius: 10 }}>
  <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200, marginBottom: 10 }} />
  <Text style={{ fontSize: 22, color: "gray", marginBottom: 10 }}>{label}</Text>
  <Image source={require("../assets/estrelas.png")} style={{ marginBottom: 10 }} />
  <Text style={{ fontSize: 30, fontWeight: "bold" }}>R$ {`${price}`.replace(".", ",")}</Text>
</View>);

Tts.setDefaultLanguage('pt-BR');

const AssistRequestView = ({ visible, onClose, speaking, item }) => {

  return <Modal animationType="fade" visible={visible} transparent={true}>
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,.90)", justifyContent: "center", alignItems: "center" }}>
      {!item ? <View style={{ justifyContent: "center", alignItems: "center", height: 250 }}>
        <Spinner style={{ position: "absolute" }} isVisible={speaking} size={200} type="Pulse" color="red" />
        <Spinner isVisible={speaking} size={150} type="Bounce" color="red" />
        <Image style={{ position: "absolute" }} source={require("../assets/assistente-logo.png")} />
      </View> :
        <Product label={item.result_list[0].name} imageUrl={item.result_list[0].image} price={item.result_list[0].price} />
      }
      <TouchableOpacity onPress={onClose} style={{ padding: 20 }}>
        <Text style={{ color: "white" }}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
}

var assistState = 0; // 0 waiting - 1 speaking - 2 wait action
SystemSetting.setVolume(0);

export default () => {
  const [assistRequest, setAssistRequest] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [item, setItem] = useState(undefined);
  const [list, setList] = useState(undefined);

  useEffect(() => {

    SplashScreen.hide();

    Voice.onSpeechStart = (e) => {
      console.log("[DEBUG HomeScreen] onSpeechStart", e);
    };

    Voice.onSpeechEnd = (e) => {
      console.log("[DEBUG HomeScreen] onSpeechEnd", e);
    };

    Voice.onSpeechResults = debounce((e) => {
      console.log("\n\n\n[DEBUG HomeScreen] onSpeechResults", e, "\n\n\n\n");
      if (e.value && e.value.length > 0) {
        const texto = e.value[0];
        if (e.value.find(v => v.toLowerCase() === "olá americanas") && assistState == 0) {
          assistState = 1;
          SystemSetting.setVolume(1);
          setAssistRequest(true);
          setSpeaking(true);
          setTimeout(() => {
            Tts.speak('Olá! Como eu posso te ajudar?')
          }, 900);
          setTimeout(() => {
            setSpeaking(false);
            assistState = 2;
            SystemSetting.setVolume(0);
          }, 5000);
          return true;
        } else if (assistState === 2) {
          americanasVoiceSay(texto).then(data => {
            assistState = 1;
            SystemSetting.setVolume(1);
            const { response, dialogue } = data;
            const { says } = response;
            const { memory, current_task } = dialogue;
            const memoryParsed = JSON.parse(memory);

            if (says && says.length > 0) {
              setSpeaking(true);
              Tts.speak(says.map(e => e.text).join(". "));
              setTimeout(() => {
                setSpeaking(false);
                assistState = 2;
                SystemSetting.setVolume(0);
                setItem(undefined);
              }, 15000);
            }

            if (current_task === "add_wishlist" && memoryParsed && memoryParsed.produto) {
              setItem(memoryParsed);
            }

            if (current_task === "list-products" && memoryParsed && memoryParsed.result_list && memoryParsed.result_list.length > 0) {
              setList(memoryParsed.result_list);
            }

            console.log(`\n[DEBUG HomeScreen] >>>>>>>>>>>\n\n${JSON.stringify(says)}\n${current_task}\n${JSON.stringify(memoryParsed)}\n\n>>>>>>>>>>>>>>`);
          });
        }
      }
    }, 50);

    Voice.onSpeechPartialResults = (e) => {
      //console.log("onSpeechPartialResults", e);
    }

    Voice.onSpeechRecognized = (e) => {
      console.log("[DEBUG HomeScreen] onSpeechRecognized", e);
    }

    Voice.onSpeechVolumeChanged = (e) => {
      //console.log("onSpeechVolumeChanged", e);
    }

    requestPermission();

    // Voice.getSpeechRecognitionServices().then((e) => console.log("getSpeechRecognitionServices", e));

    const interval = setInterval(() => {
      if (assistState === 0 || assistState === 2) { //waiting or wait action
        Voice.isRecognizing().then(v => {
          console.log("isRecognizing: ", v);
          if (!v) {
            setTimeout(() => Voice.start("pt-BR"), 1000);
          }
        });
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      Voice.removeAllListeners();
      Voice.destroy();
    }
  }, []);

  return (<>
    <AssistRequestView item={item} speaking={speaking} visible={assistRequest} onClose={() => {
      setAssistRequest(false);
      setSpeaking(false);
      assistState = 0;
      setItem(undefined);
    }} />
    <ScrollView style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <Image style={{ width: "90%", resizeMode: "stretch", marginVertical: 10 }} source={require("../assets/home-banner1.png")} />
        <Image style={{ width: "90%", resizeMode: "stretch", marginVertical: 10 }} source={require("../assets/home-banner2.png")} />
        <Image style={{ width: "100%", height: 300, resizeMode: "stretch", marginVertical: 10 }} source={require("../assets/home-banner-slider.png")} />
        <Image style={{ width: "90%", resizeMode: "stretch", marginVertical: 10 }} source={require("../assets/home-banner-iphone.png")} />
      </View>
    </ScrollView>
  </>);
}