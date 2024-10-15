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
  validatePassword,
} from '../../utility/Utility';
import {imagePath} from '../../utility/imagePath';
import {colors} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import ButtonBlue from '../Buttons/ButtonBlue';
import InputField from '../InputField';
import LoginHeader from '../LoginHeader';
const TouchableOpacity = withPreventDoubleClick();
const ChangePassword = ({isVisible, onDialogCloseClick}) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  function validation() {
    if (password.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_enter_old_pass'),
        true,
      );
    } else if (!validatePassword(password)) {
      showFlashMessage('Info', getStringMessage('msg_valid_old_pass'), true);
    } else if (newPassword.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_enter_new_pass'),
        true,
      );
    } else if (!validatePassword(newPassword)) {
      showFlashMessage('Info', getStringMessage('msg_valid_new_pass'), true);
    } else if (newPassword.trim() != cpassword.trim()) {
      showFlashMessage(
        'Info',
        getStringMessage('msg_newpass_cpass_must_match'),
        true,
      );
    } else {
      setIsLoading(true);
      Keyboard.dismiss();
      const UserData = {
        oldpassword: password,
        newpassword: newPassword,
        user_id: constant.USER_ID,
        usertype: constant.USER_TYPE,
      };
      requestChangePassword(UserData);
    }
  }
  async function requestChangePassword(data) {
    console.log('REQ_CHANGE_PASS', data);
    return Axios.requestData('POST', apiName.changePassword, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_CHANGE_PASS', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            onSuccess();
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
  function onSuccess() {
    onDialogCloseClick();
    setPassword('');
    setNewPassword('');
    setCPassword('');
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
            <LoginHeader route={getStringMessage('lbl_change_password')} />
            <TouchableOpacity
              onPress={() => {
                onSuccess();
              }}
              style={styles.closeIconContainer}>
              <Image style={styles.closeIcon} source={imagePath.ic_Close} />
            </TouchableOpacity>
          </View>

          <View style={styles.viewContainer}>
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              pass
              secure={true}
              inputTitle={getStringMessage('lbl_old_pass_hint')}
              isImage={false}
              inputIconHint={imagePath.ic_password_hint}
              updateMasterState={value => setPassword(value)}
              value={password}
            />
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              pass
              secure={true}
              inputTitle={getStringMessage('lbl_new_pass_hint')}
              isImage={false}
              inputIconHint={imagePath.ic_password_hint}
              updateMasterState={value => setNewPassword(value)}
              value={newPassword}
            />
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              pass
              secure={true}
              inputTitle={getStringMessage('lbl_confirm_pass_hint')}
              isImage={false}
              inputIconHint={imagePath.ic_password_hint}
              updateMasterState={value => setCPassword(value)}
              value={cpassword}
            />
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_submit')}
              onClick={() => validation()}
              isloading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePassword;

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
