import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermission = () => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log('[DEBUG React Permission] This feature is not available (on this device / in this context)',);
                    break;
                case RESULTS.DENIED:
                    console.log('[DEBUG React Permission] The permission has not been requested / is denied but requestable',);
                    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
                        console.log("[DEBUG React Permission] Permission Requested: ", result);
                    });
                    break;
                case RESULTS.GRANTED:
                    console.log('[DEBUG React Permission] The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    console.log('[DEBUG React Permission] The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
}