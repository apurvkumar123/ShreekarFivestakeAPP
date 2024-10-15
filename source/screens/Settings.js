import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import {colors, font, fontSizes} from '../utility/theme';

import constant from '../constants/constant';
import {
  showFlashMessage,
  validateEmail,
  validatePassword,
} from '../utility/Utility';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import Header from '../custom/Header';
import DropdownField from '../custom/DropdownField';
import ListDialog from '../custom/Dialogs/ListDialog';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import strings from '../utility/screenStrings';
import Loader from '../custom/Loader';
import {SESSION_NAME, setPrefData} from '../utility/session';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const Settings = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [adminId, setAdminId] = useState('');
  const [fname, setFname] = useState('');
  const [status, setStatus] = useState('');

  const [language, setLanguage] = useState('');
  const [languageI, setLanguageI] = useState('');

  const [company, setCompany] = useState('');
  const [companyI, setCompanyI] = useState('');
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const [headerTitle, setHeaderTitle] = useState('');

  const [companylist, setCompanylist] = useState([]);
  const commonlist = [
    {label: strings.lbl_language_English, value: 1},
    {label: strings.lbl_language_Gujarati, value: 2},
    {label: strings.lbl_language_Hindi, value: 3},
  ];
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
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        importData();
      }, 1000);
    }, []),
  );
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
  function importData() {
    // var item = ;
    // console.log('item:', item);
    // setAdminId(item.Id);
    // setFname(item.CategoryName);
    // setStatus(item.StatusText);
    var selectedLanguage = strings.getLanguage();
    console.log('selectedLanguage:', selectedLanguage);
    if (selectedLanguage == 'en') {
      setLanguage(strings.lbl_language_English);
      setLanguageI(1);
    } else if (selectedLanguage == 'hi') {
      setLanguage(strings.lbl_language_Hindi);
      setLanguageI(3);
    } else {
      setLanguage(strings.lbl_language_Gujarati);
      setLanguageI(2);
    }
    setCompany(constant.COMPANY_NAME);
    setCompanyI(constant.COMPANY_ID);
  }
  function validation() {
    if (language.trim().length == 0) {
      showFlashMessage('Required', strings.msg_Select_language, true);
    } else if (company.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_company, true);
    } else {
      setIsLoading(true);
      const UserData = {
        userId: '' + constant.USER_ID,
        clientId: constant.CLIENT_ID,
        companyId: companyI,
        languageId: languageI,
      };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_SaveUserSetting', data);
    return Axios.requestData('POST', apiName.SaveUserSetting, data)
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_SaveUserSetting', res.data.data);
          strings.setLanguage(
            languageI == 1 ? 'en' : languageI == 3 ? 'hi' : 'gu',
          );
          var userInfo = res.data.data.userdetails[0];
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
          showFlashMessage('Success!', res.data.errorMessage, false);
          // navigation.goBack();
        } else {
          console.log('res', res.data.errorMessage);
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
      <>
        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={strings.btn_close}
          isVisible={isDropBoxVisible}
          title={strings.lbl_Select_language_header}
          list={commonlist}
          onItemClick={item => {
            setLanguage(item.label);
            setLanguageI(item.value);
            setIsDropBoxVisible(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayListdialog}
          title={headerTitle}
          list={companylist}
          onItemClick={item => {
            console.log('item--', item);
            setCompany(item.label);
            setCompanyI(item.value);
            setDisplayListDialog(false);
          }}
        />
      </>
    );
  }

  async function requestGetComapanyData() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_getComapanyData');
    return Axios.requestData('POST', apiName.getComapanyData, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getComapanyData', res.data.data);
          let LArray = [];
          res.data.data.companylist.map(item => {
            var obj = {
              label: item.CompanyName,
              value: item.Id,
            };
            LArray.push(obj);
          });

          setCompanylist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayListDialog(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_GetCompany_err', err);
      });
  }

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      <View style={styles.safeAreaBaseViewContainer}>
        <Loader isVisible={isScreenLoading} />

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
          <Header
            route={strings.lbl_settings_header}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={[styles.topContainer]}>
            {randerDialog()}
            <ScrollView style={{marginHorizontal: 5}}>
              <DropdownField
                inputTitle={strings.lbl_language_header}
                value={language}
                onClick={() => {
                  console.log('status click');
                  setIsDropBoxVisible(true);
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_menu_company}
                value={company}
                onClick={() => {
                  setCompanylist([]);
                  setHeaderTitle(strings.lbl_select_company);
                  requestGetComapanyData();
                }}
              />
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={strings.btn_save}
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

  tvBottomText: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.tabBGColor,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.tabBGColor,
  },
  tvBottomText1: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
  },
  tvEmailBottom: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
    opacity: 0.6,
    marginTop: 5,
  },
  tvStyleForgot: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginTop: hp(3),
    alignSelf: 'center',
  },
});

export default Settings;
