import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
const showNotification = (title, message) => {
  if (Platform.OS == 'android') {
    PushNotification.createChannel({
      channelId: 'specialid', // (required)
      channelName: 'Special messasge', // (required)
      channelDescription: 'Notification for special message', // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });
    PushNotification.localNotification({
      title: title,
      message: message,
      channelId: 'specialid',
    });
  } else {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: title,
      alertBody: message,
    });
  }
};

// const handleCancel = () =>{
//     PushNotification.cancelAllLocalNotifications();
// }

export {showNotification};
