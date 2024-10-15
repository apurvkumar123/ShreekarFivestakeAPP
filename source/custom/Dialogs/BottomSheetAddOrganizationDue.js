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
  ScrollView,
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
import ListDialog from './ListDialog';
import DropdownField from '../DropdownField';
const TouchableOpacity = withPreventDoubleClick();
const BottomSheetAddOrganizationDue = ({
  isVisible,
  onDialogCloseClick,
  item,
}) => {
  const [selectedId, setSelectedId] = useState('');

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  const commonlist = [
    {label: 'Monthly', value: 1},
    {label: 'Quarterly', value: 3},
    {label: 'Bi-annually', value: 6},
    {label: 'Annually', value: 12},
  ];
  const [status, setStatus] = useState('');
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  useEffect(() => {
    if (item != undefined && item != '') {
      console.log('item:', item);
      setSelectedId(item.id);
      setTitle(item.title);
      setDuration(item.duration);
      setStatus(item.duration + ' Month');
      setAmount(item.amount);
      setDescription(item.description);
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
    if (title.trim().length == 0) {
      errorView(getStringMessage('msg_enter_title'));
    } else if (status.trim().length == 0) {
      errorView(getStringMessage('msg_enter_duration'));
    } else if (amount.trim().length == 0) {
      errorView(getStringMessage('msg_enter_amount'));
    } else if (parseInt(amount) <= 0) {
      errorView(getStringMessage('msg_enter_valid_amount'));
    } else if (description.trim().length == 0) {
      errorView(getStringMessage('msg_enter_description'));
    } else {
      setIsLoading(true);
      Keyboard.dismiss();
      const UserData =
        selectedId == ''
          ? {
              amount: amount,
              org_id: constant.orgID,
              duration: duration,
              title: title,
              description: description,
            }
          : {
              amount: amount,
              org_id: constant.orgID,
              id: selectedId,
              duration: duration,
              title: title,
              description: description,
            };
      requestAddFees(UserData);
    }
  }
  async function requestAddFees(data) {
    console.log('REQ_ADD_ORG_DUES', data);
    return Axios.requestData('POST', apiName.AddOrganizationDues, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_ADD_ORG_DUES', res.data);
          if (res.data.status == 0) {
            errorView(res.data.message);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            onDialogCloseClick(true);
            setAmount('');
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
  function randerDialog() {
    return (
      <>
        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={getStringMessage('btn_close')}
          isVisible={isDropBoxVisible}
          title={getStringMessage('lbl_select_status')}
          list={commonlist}
          onItemClick={item => {
            setStatus(item.label);
            setDuration(item.value);
            setIsDropBoxVisible(false);
          }}
        />
      </>
    );
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
        {randerDialog()}
        <View style={styles.container}>
          <ScrollView>
            <View style={{justifyContent: 'center'}}>
              <LoginHeader
                route={
                  item == ''
                    ? getStringMessage('lbl_title_add_org_dues')
                    : getStringMessage('lbl_title_update_org_dues')
                }
              />
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
                inputTitle={getStringMessage('lbl_sub_title')}
                updateMasterState={value => setTitle(value)}
                value={title}
              />
              <DropdownField
                inputTitle={getStringMessage('lbl_subscription_duration')}
                value={status}
                onClick={() => {
                  console.log('status click');
                  setIsDropBoxVisible(true);
                }}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                number
                isImage={false}
                inputTitle={getStringMessage('lbl_sub_fees_amount_hint')}
                updateMasterState={value => setAmount(value)}
                value={amount}
              />
              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_sub_desc')}
                updateMasterState={value => setDescription(value)}
                value={description}
              />

              {isError && <Text style={styles.errorLable}>{errorMessage}</Text>}
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_save')}
                onClick={() => validation()}
                isloading={isLoading}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomSheetAddOrganizationDue;

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
