import React, {useState} from 'react';
import {Image, Keyboard, Modal, StyleSheet, View} from 'react-native';
import constant from '../../constants/constant';
import Axios from '../../network/Axios';
import {apiName} from '../../network/serverConfig';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {
  getStringMessage,
  showFlashMessage,
  validateEmail,
} from '../../utility/Utility';
import {imagePath} from '../../utility/imagePath';
import {colors} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import ButtonBlue from '../Buttons/ButtonBlue';
import InputField from '../InputField';
import LoginHeader from '../LoginHeader';
const TouchableOpacity = withPreventDoubleClick();
const ForgotPassword = ({isVisible, onDialogCloseClick, emailAddress}) => {
  const [email, setEmail] = useState(emailAddress);
  const [isSelfClose, setisSelfClose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  function validation() {
    if (email.trim().length == 0) {
      showFlashMessage('Required', 'Please enter email address', true);
    } else if (!validateEmail(email)) {
      showFlashMessage('Info', 'Please enter valid email address', true);
    } else {
      setIsLoading(true);
      Keyboard.dismiss();
      const UserData = {
        email: email,
        usertype: constant.USER_TYPE,
      };
      requestForgotPassword(UserData);
    }
  }
  async function requestForgotPassword(data) {
    console.log('REQ_FORGOT_PASS', data);
    return Axios.requestData('POST', apiName.forgotPassword, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_FORGOT_PASS', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            onDialogCloseClick();
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
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{justifyContent: 'center'}}>
            <LoginHeader route={getStringMessage('lbl_forgot_pass')} />
            <TouchableOpacity
              onPress={() => {
                onDialogCloseClick();
              }}
              style={styles.closeIconContainer}>
              <Image style={styles.closeIcon} source={imagePath.ic_Close} />
            </TouchableOpacity>
          </View>

          <View style={styles.viewContainer}>
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              email
              isImage={true}
              inputTitle={'EMAIL ADDRESS'}
              inputIconHint={imagePath.ic_email_hint}
              updateMasterState={value => setEmail(value)}
              value={email}
            />
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={'Submit'}
              onClick={() => validation()}
              isloading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: colors.appBGColor,
    width: wp(90),
    borderRadius: 6,
    overflow: 'hidden',
  },
  viewContainer: {
    padding: wp(3),
    backgroundColor: colors.whiteColor,
  },
  closeIcon: {
    height: hp(4),
    width: wp(7),
    resizeMode: 'contain',
    margin: 10,
  },
  closeIconContainer: {
    position: 'absolute',
    right: wp(2),
  },
});
