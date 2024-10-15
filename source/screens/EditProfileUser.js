import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import Header from '../custom/Header';
import InputField from '../custom/InputField';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import {colors, font, fontSizes} from '../utility/theme';

import constant from '../constants/constant';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import {
  getStringMessage,
  showFlashMessage,
  validateEmail,
} from '../utility/Utility';
import {SESSION_NAME, getPrefData, setPrefData} from '../utility/session';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import ChangePassword from '../custom/Dialogs/ChangePassword';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const EditProfileUser = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [orgId, setOrgId] = useState('');
  const [userId, setUserId] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('PASSWORD');
  const [isVisibleChangePass, setIsVisibleChangePass] = useState(false);
  const [isDeleteDialog, setDeleteDialog] = useState(false);

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
    setTimeout(() => {
      importData();
    }, 1000);
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
  function importData() {
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response ed: ', response);
        if (response.userdetails) {
          setEmail(response.userdetails.email);
          setUserId(response.userdetails.id);
          setFname(response.userdetails.firstname);
          setLname(response.userdetails.lastname);
          setMobile(response.userdetails.mobilenumber);
        }
        if (response.organization) {
          setOrgId(response.organization.id);
        }
      }
    });
  }
  function validation() {
    if (fname.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_fname'), true);
    } else if (lname.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_lname'), true);
    } else if (mobile.trim().length != 0 && mobile.trim().length < 9) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_valid_mobile_number'),
        true,
      );
    } else if (email.trim().length == 0) {
      showFlashMessage('Required', 'Please enter email address', true);
    } else if (!validateEmail(email)) {
      showFlashMessage('Info', 'Please enter valid email address', true);
    } else {
      setIsLoading(true);

      let formData = new FormData();
      formData.append('type', '1');
      formData.append('user_id', userId);
      formData.append('org_id', orgId);
      formData.append('email', email);
      formData.append('firstname', fname);
      formData.append('lastname', lname);
      formData.append('mobilenumber', mobile);
      requestRegister(formData);
    }
  }

  async function requestRegister(formData) {
    console.log('REQ_EditProfile', formData);
    return Axios.requestData('POST', apiName.editProfile, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_EditProfile', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            setPrefData(
              SESSION_NAME.USER_INFO,
              res.data.result,
              (resType, response) => {
                constant.USER_ID = res.data.result.userdetails.id;
                constant.orgID = res.data.result.organization.id;
                showFlashMessage('Success!', res.data.message, false);
                navigation.goBack();
              },
            );
          }
        } else {
          showFlashMessage('Info', res.message, true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', getStringMessage('msg_something_wrong'), true);
        console.log('err', err);
      });
  }
  /**
   * onPasswordClicked
   */
  function onPasswordClicked() {
    setIsVisibleChangePass(true);
  }

  function renderDialog() {
    return (
      <>
        <ChangePassword
          onDialogCloseClick={() => {
            setIsVisibleChangePass(false);
          }}
          isVisible={isVisibleChangePass}
        />
        <DoubleButtonDialog
          isVisible={isDeleteDialog}
          title={'CONFIRMATION'}
          message={'Are you sure you want to delete account?'}
          submitbuttonText={'Delete'}
          cancelbuttonText={'Cancel'}
          submitButtonAction={() => {
            Linking.openURL('https://app.exchequerservice.com/deleteUser');
            setDeleteDialog(false);
          }}
          cancelButtonAction={() => setDeleteDialog(false)}
        />
      </>
    );
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {renderDialog()}
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
          <Header
            route={getStringMessage('lbl_edit_profile_user')}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={[styles.topContainer]}>
            <ScrollView>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_fname_hint')}
                updateMasterState={value => setFname(value)}
                value={fname}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_lname_hint')}
                updateMasterState={value => setLname(value)}
                value={lname}
              />
              <InputField
                number
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_valid_mobile')}
                updateMasterState={value => setMobile(value)}
                value={mobile}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                email
                isImage={false}
                inputTitle={getStringMessage('lbl_email_hint')}
                inputIconHint={imagePath.ic_email_hint}
                updateMasterState={value => setEmail(value)}
                value={email}
              />
              <Text style={styles.tvEmailBottom}>
                {getStringMessage('lbl_email_suggest')}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  onPasswordClicked();
                }}>
                <InputField
                  inputTitleVisible={true}
                  isEditable={false}
                  pass
                  secure={true}
                  inputTitle={'PASSWORD'}
                  isImage={false}
                  inputIconHint={imagePath.ic_password_hint}
                  updateMasterState={value => setPassword(value)}
                  value={password}
                  rightText={'Change'}
                />
              </TouchableOpacity>

              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_save')}
                onClick={() => validation()}
                isloading={isLoading}
              />

              {constant.deviceVersion ==
                constant.CHECK_VERSION_RESPONSE.tempVersion &&
                constant.CHECK_VERSION_RESPONSE.tempFlag == true && (
                  <ButtonBlue
                    btnColor={colors.btnColor}
                    btnText={getStringMessage('str_delete_account')}
                    onClick={() => setDeleteDialog(true)}
                    isloading={isLoading}
                  />
                )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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

  tvEmailBottom: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
    opacity: 0.6,
    marginTop: 5,
  },
  tvcoverchangeTitle: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.btnColor,
    // opacity: 0.6,
    marginTop: 5,
    textAlign: 'center',
  },
  tvStyleForgot: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginTop: hp(3),
    alignSelf: 'center',
  },
});
export default EditProfileUser;
