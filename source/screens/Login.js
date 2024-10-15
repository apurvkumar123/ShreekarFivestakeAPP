import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {stack} from '../constants/commonStrings';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import InputField from '../custom/InputField';
import LoginHeader from '../custom/LoginHeader';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import {colors, font, fontSizes} from '../utility/theme';

import constant from '../constants/constant';
import ForgotPassword from '../custom/Dialogs/ForgotPassword';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import {
  getStringMessage,
  showFlashMessage,
  validateEmail,
  validatePassword,
} from '../utility/Utility';
import {SESSION_NAME, setPrefData} from '../utility/session';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import strings from '../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Login
  // Mobile:9426669606
  // Pass:12345
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisibleForgot, setIsVisibleForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeValue = new Animated.Value(0);
  const slideUpAnimation = new Animated.Value(0);
  useEffect(() => {
    fadeValue.setValue(0);
    slideUpAnimation.setValue(0);
    setTimeout(() => {
      fadeInAnimation();
    }, 500);
    slideViewUpAnimation();
  }, []);
  function fadeInAnimation() {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  function slideViewUpAnimation() {
    Animated.timing(slideUpAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  function validation() {
    if (email.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_mobile, true);
    } else if (email.trim().length < 10) {
      showFlashMessage('Info', strings.msg_valid_mobile, true);
    } else if (password.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_pass, true);
    } else if (!validatePassword(password)) {
      showFlashMessage('Info', strings.msg_valid_pass, true);
    } else {
      setIsLoading(true);
      const UserData = {
        userName: email,
        password: password,
        companyId: constant.COMPANY_ID,
        languageId: constant.LANGUAGE_ID,
        DeviceToken: '',
        DeviceType: constant.deviceType,
        DeviceVersion: constant.deviceVersion,
        DeviceDetails: '',
        appVersion: constant.appVersion,
      };
      requestLogin(UserData);
    }
  }
  async function requestLogin(data) {
    console.log('REQ_Login', data);
    return Axios.requestData('POST', apiName.login, data)
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          var userInfo = res.data.data.userLogin[0];
          console.log('RES_Login in', userInfo);
          setPrefData(SESSION_NAME.USER_INFO, userInfo, (resType, response) => {
            console.log('RES_Login response', response);
            constant.USER_ID = userInfo.Id;
            constant.CLIENT_ID = userInfo.ClientId;
            constant.COMPANY_ID = userInfo.defaultCompanyId;
            constant.LANGUAGE_ID = userInfo.defaultLanguageId;
            constant.COMPANY_NAME = userInfo.CompanyName;
            constant.ROLE_ID = userInfo.RoleId;
            constant.userData = userInfo;
            navigation.reset({
              index: 0,
              routes: [{name: stack.NAV_DRAWER}],
            });
          });
        } else {
          console.log('RES_Login', res);
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', strings.msg_something_wrong, true);
        console.log('err', err);
      });
  }
  function randerDialog() {
    return (
      <ForgotPassword
        onDialogCloseClick={() => {
          setIsVisibleForgot(false);
        }}
        isVisible={isVisibleForgot}
        emailAddress={email}
      />
    );
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}

      <View style={styles.safeAreaBaseViewContainer}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideUpAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenHeight / 12, 0],
                }),
              },
            ],
          }}>
          <LoginHeader route={strings.lbl_Login} isIconDisplay={false} />
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={[styles.topContainer]}>
            <ScrollView style={{}}>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                phone
                isImage={true}
                inputTitle={strings.lbl_mobile_hint}
                inputIconHint={imagePath.ic_email_hint}
                updateMasterState={value => setEmail(value)}
                value={email}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                pass
                secure={true}
                inputTitle={strings.lbl_password_hint}
                isImage={true}
                inputIconHint={imagePath.ic_password_hint}
                updateMasterState={value => setPassword(value)}
                value={password}
              />
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={strings.btn_login}
                onClick={() => validation()}
                isloading={isLoading}
              />
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: hp(6),
    width: wp(70),
    height: hp(35),
    alignSelf: 'center',
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  topContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    paddingVertical: hp(3),
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.appBGColor,
    alignItems: 'center',
  },
  tvBottomText: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_12,
    color: colors.tabBGColor,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.tabBGColor,
    marginTop: 5,
  },
  tvBottomText1: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
  },
  tvStyleForgot: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginTop: hp(3),
    alignSelf: 'center',
  },
});

export default Login;
