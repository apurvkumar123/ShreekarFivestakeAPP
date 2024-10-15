import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
import {store} from './source/store/index';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import 'react-native-gesture-handler';

const reduxStore = configureStore(store);

LogBox.ignoreLogs(['Warning: ...']); //Hide warnings

LogBox.ignoreAllLogs();

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function (notification) {
    console.log('ACTION:', 'clickeddd');
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const appRedux = () => (
  <Provider store={reduxStore}>
    <App />
  </Provider>
);
AppRegistry.registerComponent(appName, () => appRedux);
