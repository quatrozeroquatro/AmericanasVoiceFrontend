import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermission = () => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log(
                        'This feature is not available (on this device / in this context)',
                    );
                    break;
                case RESULTS.DENIED:
                    console.log(
                        'The permission has not been requested / is denied but requestable',
                    );
                    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
                        console.log("Permission Requested: ", result);
                      });
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
}