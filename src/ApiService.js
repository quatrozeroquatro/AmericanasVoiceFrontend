import axios from 'axios';
import base64 from 'react-native-base64';

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

export const americanasVoiceSay = async (text) => {
  try {
    const response = await axiosInstance.post("/custom/americanas-voice", new URLSearchParams({
      UserId: `Yasmin ${+new Date}`,
      Text: text,
      Language: "en-US"
    }));
    console.log("[DEBUG API /custom/americanas-voice] RESPONSE", response);
    return response.data;
  } catch (error) {
    console.log("[DEBUG API /custom/americanas-voice] ERROR", error, error.response);
  }

}