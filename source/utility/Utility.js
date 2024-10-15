import messaging from '@react-native-firebase/messaging';
import {Linking} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {font} from './theme';
import {fontSizes} from './theme';
import {SESSION_NAME, getPrefData, removeAllData} from '../utility/session';
import {appMessagesKey, stack} from '../constants/commonStrings';
import constant from '../constants/constant';
export function openURLInBrowser(url) {
  Linking.canOpenURL(url);
  Linking.openURL(url);
}

export function printLog(label, message, isJSONstringify) {
  if (isJSONstringify) {
    console.log(label, JSON.stringify(message));
  } else {
    console.log(label, message);
  }
}

export function validateEmail(email) {
  let isEmail = false;

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    isEmail = false;
  } else {
    isEmail = true;
  }
  return isEmail;
}

export function validatePassword(password) {
  let isValidPassword = false;
  if (password.length >= 5) {
    isValidPassword = true;
  } else {
    isValidPassword = false;
  }
  return isValidPassword;
}

export function getFCMToken() {
  return new Promise((resolve, reject) => {
    let token = '';
    messaging().registerDeviceForRemoteMessages();
    messaging()
      .getToken()
      .then(token => {
        deviceToken = token;
        printLog('-Get Token-------', token);
        let aStrToken = token;
        deviceToken = aStrToken;
        token = aStrToken;
        resolve(token);
        // baseConstants.DEVICE_TOKEN = aStrToken;
      })
      .catch(error => {
        let err = `FCm token get error${error}`;
        reject(err);
        printLog('-Get Token------- ', error);
      });
  });
}

export function logout(navigation) {
  // session.getPrefData(session.SESSION_NAME.USER_INFO,(resType,response)=>{
  //   const request = {
  //     userId : response.id,
  //     appType : 1,
  //     deviceToken : response.deviceToken
  //   }
  //   printLog("logoutRequest--->",request,true);
  //   axios.post(`${apiPaths.BASE_URL}/mobapi/userLogout`, request)
  //   .then(function (response) {
  removeAllData().then(res => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: stack.LOGIN}],
      });
    }, 1000);
  });
  // constant.isPhoneVerifed = false;
  //      printLog("LogoutApiResponse------>",response,true)

  //   })
  //   .catch(function (error) {
  //     // setIsLoader(false)
  //     printLog("LogoutApiResponseFailure--->",error.message,true);
  //   });
  // })
}

export function showFlashMessage(title, description, isFailure) {
  showMessage({
    message: title,
    type: isFailure == false ? 'success' : 'danger',
    description: description,
    textStyle: {fontFamily: font.Regular, fontSize: fontSizes.pt_14},
    titleStyle: {fontFamily: font.Bold, fontSize: fontSizes.pt_16},
    animationDuration: 500,
    duration: 4000,
  });
}

export function getStringMessage(msgKey) {
  if (constant.messageListArray.length > 0) {
    let arrData = constant.messageListArray;
    let dicData = arrData.filter(item => {
      return msgKey == item.msgKey;
    });
    if (dicData.length > 0) {
      // console.log("String from server");

      return dicData[0].msgValue.replace(/\\n/g, '\n');
    }
  } else {
    return appMessagesKey.START_YOUR_JOURNEY_WITH_US;
  }
}

export function checkUserLoggedInn() {
  getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
    console.log('response:', response.userdetails);
    setTimeout(() => {
      return response;
    }, 500);
  });
}
