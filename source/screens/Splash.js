import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  NativeModules,
  Platform,
  Image,
  StyleSheet,
  Animated,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {stack} from '../constants/commonStrings';
import getDeviceInfo from '../utility/getDeviceInfo';
import commonStyle from '../styles/commonStyle';
import {imagePath} from '../utility/imagePath';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../utility/ResponsiveScreen';
import Axios from '../network/Axios';

import NotificationHandler from '../utility/NotificationHandler';
import {apiName, serverPath} from '../network/serverConfig';
import SingleButtonDialog from '../custom/Dialogs/SingleButtonDialog';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import constant from '../constants/constant';
import {cheUserLoggedInn, checkUserLoggedInn, logout} from '../utility/Utility';
import {SESSION_NAME, getPrefData, setPrefData} from '../utility/session';
import {colors, font, fontSizes} from '../utility/theme';
import strings from '../utility/screenStrings';

import DeviceInfo from 'react-native-device-info';

const Splash = () => {
  const width = new Animated.Value(widthPercentageToDP(70));
  const height = new Animated.Value(heightPercentageToDP(40));
  const [isSingleDialogVisible, setIsSingleDialogVisible] = useState(false);
  const [isDoubleDialogVisible, setIsDoubleDialogVisible] = useState(false);
  const [successDialogBtnTxt, setSuccessDialogBtnTxt] = useState('OK');
  const [cancelDialogBtnTxt, setCancelDialogBtnTxt] = useState('CANCEL');
  const [message, setMessage] = useState('No update available');
  const [title, setTitle] = useState('Alert');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const navigation = useNavigation();

  const isUnderMaintenanceRef = useRef();
  isUnderMaintenanceRef.current = isUnderMaintenance;

  const redirectURLRef = useRef();
  redirectURLRef.current = redirectUrl;

  useEffect(() => {
    NotificationHandler.getFCMToken();
    getDeviceInfo.getDeviceDetails();
    constant.appVersion = DeviceInfo.getVersion();
    setTimeout(() => {
      getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
        console.log('response11: ', response);

        if (response != null) {
          constant.USER_ID = response.Id;
          constant.CLIENT_ID = response.ClientId;
          constant.COMPANY_ID = response.defaultCompanyId;
          constant.COMPANY_NAME = response.CompanyName;
          constant.LANGUAGE_ID = response.defaultLanguageId;
          constant.ROLE_ID = response.RoleId;

          requestCheckVersion(response.Id);
        } else {
          requestCheckVersion(0);
        }
      });
    }, 500);

    Animated.timing(
      width, // The animated value to drive
      {
        toValue: 320, // Animate to opacity: 1 (opaque)
        duration: 1000, // Make it take a while
        useNativeDriver: false,
      },
    ).start(); // Starts the animation
    Animated.timing(
      height, // The animated value to drive
      {
        toValue: 650, // Animate to opacity: 1 (opaque)
        duration: 700, // Make it take a while
        useNativeDriver: false,
      },
    ).start(); // Starts the animation
    StatusBar.setHidden(true, 'none');
  }, []);

  function requestCheckVersion(userid) {
    const data = {
      userId: userid,
      roleId: 0,
      appType: constant.deviceType,
      appVersion: DeviceInfo.getVersion(),
      companyId: constant.COMPANY_ID,
      projectId: 0,
      DeviceType: constant.deviceType,
      DeviceVersion: constant.deviceVersion,
      DeviceDetails: '',
      deviceToken: constant.deviceToken,
      appCode: DeviceInfo.getVersion(),
      deviceName: 'Android',
      deviceModel: 'Pixel',
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_Checkversion', data);
    return Axios.requestData('POST', apiName.checkVersionAPI, data)
      .then(res => {
        if (res.status == 200) {
          console.log('cVersion:', res.data.data);
          constant.CHECK_VERSION_RESPONSE = res.data.result;
          handleCheckversionRes(res.data.data);
        } else {
          console.log('cVersion_err:', res.data);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  function handleCheckversionRes(result) {
    console.log('result==', result);
    if (result?.hasLoginOtherDevice == true) {
      logout(navigation);
    } else if (
      result?.hasUpdates == true &&
      result?.isappApprov == constant.APP_APPROVED &&
      result?.iscompulsoryUpdate == 0
    ) {
      setIsDoubleDialogVisible(true);
      setMessage(result?.updateMessage);
      setSuccessDialogBtnTxt('UPDATE');
      setCancelDialogBtnTxt('LATER');
      setTitle('UPDATE');
      setRedirectUrl(result?.Url);
    } else if (
      result?.hasUpdates == true &&
      result?.isappApprov == constant.APP_APPROVED &&
      result?.iscompulsoryUpdate == 1
    ) {
      setIsSingleDialogVisible(true);
      setMessage(result?.updateMessage);
      setSuccessDialogBtnTxt('UPDATE');
      setTitle('FORCE UPDATE');
      setRedirectUrl(result?.Url);
    } else {
      moveToNextScreen();
    }

    // if (
    //   result?.isUpdateAvailable == constant.ISUPDATE_AVAILABLE &&
    //   result?.isappApprov == constant.APP_APPROVED
    // ) {
    //   setIsDoubleDialogVisible(true);
    //   setMessage(result?.updateMessage);
    //   setSuccessDialogBtnTxt('UPDATE');
    //   setCancelDialogBtnTxt('LATER');
    //   setTitle('UPDATE');
    //   setRedirectUrl(result?.Url);
    // } else if (
    //   result?.isUpdateAvailable == constant.COMPUSLSORY_UPDATE &&
    //   result?.isappApprov == constant.APP_APPROVED
    // ) {
    //   setIsSingleDialogVisible(true);
    //   setMessage(result?.updateMessage);
    //   setSuccessDialogBtnTxt('UPDATE');
    //   setTitle('FORCE UPDATE');
    //   setRedirectUrl(result?.Url);
    // } else if (result?.isUpdateAvailable == constant.UNDER_MAINTANENCE) {
    //   setIsUnderMaintenance(true);
    //   setIsSingleDialogVisible(true);
    //   setMessage(result?.updateMessage);
    //   setSuccessDialogBtnTxt('CLOSE');
    //   setTitle('MAINTENANCE');
    //   setRedirectUrl(result?.Url);
    // } else {
    //   moveToNextScreen();
    // }
  }
  function moveToNextScreen() {
    setTimeout(() => {
      getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
        console.log('response11: ', response);

        if (response != null) {
          constant.USER_ID = response.Id;
          constant.CLIENT_ID = response.ClientId;
          constant.COMPANY_ID = response.defaultCompanyId;
          constant.COMPANY_NAME = response.CompanyName;
          constant.LANGUAGE_ID = response.defaultLanguageId;
          constant.ROLE_ID = response.RoleId;
          constant.userData = response;

          strings.setLanguage(
            response.defaultLanguageId == 1
              ? 'en'
              : response.defaultLanguageId == 3
              ? 'hi'
              : 'gu',
          );

          navigation.reset({
            index: 0,
            routes: [{name: stack.NAV_DRAWER}],
          });

          // requestGetUserDetails();
        } else {
          console.log('response: ELSE1');
          navigation.reset({
            index: 0,
            routes: [{name: stack.LOGIN}],
          });
        }
      });
    }, 500);
  }
  async function moveToWebview() {
    if (isUnderMaintenanceRef.current) {
      // RNExitApp.exitApp();
    } else {
      setIsDoubleDialogVisible(false);
      setIsSingleDialogVisible(false);
      await Linking.openURL(redirectURLRef.current);
      // RNExitApp.exitApp();
    }
  }
  function cancelButtonAction() {
    setIsDoubleDialogVisible(false);
    moveToNextScreen();
  }

  function LoadDailog() {
    return (
      <View>
        <SingleButtonDialog
          buttonText={successDialogBtnTxt}
          isVisible={isSingleDialogVisible}
          message={message}
          title={title}
          submitButtonAction={() => {
            moveToWebview();
          }}
        />
        <DoubleButtonDialog
          submitbuttonText={successDialogBtnTxt}
          cancelbuttonText={cancelDialogBtnTxt}
          isVisible={isDoubleDialogVisible}
          message={message}
          title={title}
          submitButtonAction={() => {
            moveToWebview();
          }}
          cancelButtonAction={() => {
            cancelButtonAction();
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={[
        commonStyle.commonBackgroundStyle,
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.whiteColor,
        },
      ]}>
      {LoadDailog()}

      <Animated.Image
        source={imagePath.ic_splash_icon}
        style={{
          width: width,
          height: height,
          resizeMode: 'contain',
        }}
      />
      <Text
        style={{
          fontFamily: font.Medium,
          fontSize: fontSizes.pt_14,
          color: colors.blackColor,
          position: 'absolute',
          bottom: 20,
        }}>
        {'V ' + DeviceInfo.getVersion()}
        {/* {'V 2.0'} */}
      </Text>
    </View>
  );
};

export default Splash;
