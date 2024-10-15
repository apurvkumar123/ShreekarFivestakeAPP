import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import constant from '../../constants/constant';
import Axios from '../../network/Axios';
import {apiName} from '../../network/serverConfig';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {getStringMessage, showFlashMessage} from '../../utility/Utility';
import {imagePath} from '../../utility/imagePath';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import ButtonBlue from '../Buttons/ButtonBlue';
import InputField from '../InputField';
import LoginHeader from '../LoginHeader';
import {useFocusEffect} from '@react-navigation/native';
import {SESSION_NAME, setPrefData} from '../../utility/session';
const TouchableOpacity = withPreventDoubleClick();
const BottomSheetAddBal = ({isVisible, onDialogCloseClick, item}) => {
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [bankName, setBankName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  useEffect(() => {
    if (item != undefined) {
      setAmount(item.amount);
      setSelectedId(item.id);
    }
  }, [isVisible]);

  function errorView(msg) {
    setErrorMessage(msg);
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  }
  function validation() {
    console.log('amount', amount);
    if (bankName.trim() == '') {
      errorView(getStringMessage('msg_enter_account_type'));
    } else if (amount.trim().length == 0) {
      errorView(getStringMessage('msg_enter_amount'));
    } else if (parseInt(amount) <= 0) {
      errorView(getStringMessage('msg_enter_valid_amount'));
    } else {
      setIsLoading(true);
      Keyboard.dismiss();
      const UserData = {
        balance: amount,
        org_id: constant.orgID,
        userid: constant.USER_ID,
        comment: comment,
        account_name: bankName,
      };
      requestAddFees(UserData);
    }
    // const UserData = {
    //   balance: amount,
    //   org_id: constant.orgID,
    //   userid: constant.USER_ID,
    //   comment: comment,
    //   account_name :''
    // };
    // requestAddFees(UserData);
  }

  // return Axios.requestData('POST', apiName.addOrgBalance, data)
  async function requestAddFees(data) {
    console.log('REQ_BAL', data);
    return Axios.requestData('POST', apiName.addbalance, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_BAL', res.data);
          if (res.data.status == 0) {
            errorView(res.data.message);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            setPrefData(
              SESSION_NAME.USER_INFO,
              res.data.result,
              (resType, response) => {
                constant.USER_ID = res.data.result.userdetails.id;
                constant.orgID = res.data.result.organization.id;
              },
            );
            onDialogCloseClick(true);
            setAmount('');
            setBankName('');
            setComment('');
          }
        } else {
          errorView(res.message);
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
      animationType={isVisible ? 'slide' : 'fade'}
      transparent={true}
      visible={isVisible}
      animated
      style={{flex: 1, backgroundColor: 'green'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'position' : 'height'}
        style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{justifyContent: 'center'}}>
            <LoginHeader route={getStringMessage('btn_add_org_bal')} />
            <TouchableOpacity
              onPress={() => {
                onDialogCloseClick(false);
                setAmount('');
              }}
              style={styles.closeIconContainer}>
              <Image style={styles.closeIcon} source={imagePath.ic_Close} />
            </TouchableOpacity>
          </View>

          <View style={styles.viewContainer}>
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              isImage={false}
              inputTitle={getStringMessage('lbl_account_type')}
              updateMasterState={value => setBankName(value)}
              value={bankName}
            />
            {isError && bankName.trim().length == 0 && (
              <Text style={styles.errorLable}>{errorMessage}</Text>
            )}
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              number
              isImage={false}
              inputTitle={getStringMessage('lbl_org_bal')}
              updateMasterState={value => setAmount(value)}
              value={amount}
            />
            {isError && bankName.trim().length != 0 && (
              <Text style={styles.errorLable}>{errorMessage}</Text>
            )}
            <Text
              style={{
                marginTop: hp(0.5),
                color: colors.redColor,
                fontSize: fontSizes.pt_10,
              }}>
              {getStringMessage('lbl_add_balance_note')}
            </Text>

            <InputField
              inputTitleVisible={true}
              isEditable={true}
              isImage={false}
              inputTitle={getStringMessage('str_comment')}
              updateMasterState={value => setComment(value)}
              value={comment}
            />

            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_save')}
              onClick={() => validation()}
              isloading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomSheetAddBal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    backgroundColor: colors.appBGColor,
    borderRadius: 6,
    overflow: 'hidden',
    bottom: 0,
    width: wp(100),
    justifyContent: 'flex-end',
    paddingBottom: hp(2),
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  viewContainer: {
    padding: wp(3),
    backgroundColor: colors.appBGColor,
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
  errorLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.redColor,
    width: wp(95),
    marginBottom: hp(1),
    textAlign: 'right',
  },
});
