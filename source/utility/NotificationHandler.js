import messaging from '@react-native-firebase/messaging';
import {DeviceEventEmitter} from 'react-native';
import {showNotification} from '../../source/utility/GenerateLocalNotification';
import constant from '../constants/constant';
import {printLog} from './Utility';
export default class NotificationHandler {
  static handleNotification() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      printLog('backgroundNotification', remoteMessage, true);
      // if(remoteMessage.data.notificationType != "1"){
      DeviceEventEmitter.emit('notificationPayload', remoteMessage);
      // }
    });

    messaging().onMessage(notification => {
      printLog('foregroundNotification----->', notification, true);
      showNotification(
        notification.notification.title,
        notification.notification.body,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          printLog(
            'Notification caused app to open from quit state:',
            remoteMessage,
            true,
          );
          DeviceEventEmitter.emit('notificationData', remoteMessage);
        }

        // setLoading(false);
      });
  }

  static async getFCMToken() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          printLog('FCMToken------->', fcmToken);
          constant.deviceToken = fcmToken;
        }
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  }
}
