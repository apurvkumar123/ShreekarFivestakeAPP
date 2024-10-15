import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
  getStringMessage,
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
import Loader from '../custom/Loader';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {dateFormat} from '../constants/commonStrings';
import {imagePath} from '../utility/imagePath';
import {SESSION_NAME, getPrefData} from '../utility/session';

const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddMemberUser = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [memberId, setmemberId] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mobile, setMobile] = useState('');
  const [outStanding, setoutStanding] = useState('');
  const [email, setEmail] = useState('');
  const [regFees, setRegFees] = useState('');
  const [regFeesObj, setRegFeesObj] = useState({});
  const [regFeesId, setRegFeesId] = useState('');
  const [regFeeStatus, setRegFeeStatus] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [joiningpDate, setJoiningpDate] = useState('');
  const [orgDues, setOrgDues] = useState('');
  const [orgDuesObj, setOrgDuesObj] = useState({});
  const [orgDuesId, setOrgDuesId] = useState('');
  const [orgDueStartDate, setOrgDueStartDate] = useState('');
  const [orgDueStartpDate, setOrgDueStartpDate] = useState('');
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isSaveDialog, setIsSaveDialog] = useState(false);
  const [isLoadingfirst, setIsLoadingfirst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().setHours(0, 0, 0, 0),
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [commonlist, setCommonlist] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [type, setType] = useState(0);
  const [btnType, setBtnType] = useState(1); //1 = send invitation, 2 = save
  const [datePickerType, setDatePickerType] = useState(0); // 0 = joining date , 1 = Dues Start
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
        getPrefs();
        !isAdd && importData();
      }, 1000);
    }, []),
  );
  function getPrefs() {
    getPrefData(SESSION_NAME.REGISTER_FEE_OBJ, (resType, item) => {
      if (item != null) {
        console.log('response fee: ', item);
        // setRegFeesObj(response);
        setRegFees(constant.CURRENCY_SYMBOL + item.amount);
        setRegFeesId(item.id);
      }
    });
    getPrefData(SESSION_NAME.SUBSCRIPTION_FEE_OBJ, (resType, item) => {
      if (item != null) {
        console.log('response sub: ', item);
        // setOrgDuesObj(item);
        setOrgDues(
          constant.CURRENCY_SYMBOL +
            item.amount +
            ' - ' +
            item.title +
            '\nDuration: ' +
            item.duration +
            ' Months',
        );
        setOrgDuesId(item.id);
      }
    });
  }
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
    var item = route.params.item;
    console.log('item--', item);
    setmemberId(item.id);
    setFname(item.firstname);
    setLname(item.lastname);
    setMobile(item.mobilenumber);
    setoutStanding(item.outstanding_amount);
    setEmail(item.email);
    setRegFees(item.amount);
    setJoiningDate(moment(item.joining_date).format(dateFormat.DISPLAY));
    setJoiningpDate(item.joining_date);
    setOrgDueStartDate(moment(item.dues_start_date).format(dateFormat.DISPLAY));
    setOrgDueStartpDate(item.dues_start_date);
    setRegFeeStatus(item.paymentstatus);
    getOrgDetails(item.dues_id);
  }
  async function getOrgDetails(givenId) {
    var data = {org_id: constant.orgID};
    return Axios.requestData('POST', apiName.getOrgDues, data)
      .then(res => {
        if (res.status == 200) {
          res.data.result.map(item => {
            if (givenId == item.id) {
              setOrgDues(
                constant.CURRENCY_SYMBOL + item.amount + ' - ' + item.title,
              );
              setOrgDuesId(givenId);
            }
          });
        }
      })
      .catch(err => {
        console.log('RES_getOrgDues_err', err);
      });
  }
  function validation() {
    if (fname.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_fname'), true);
    } else if (lname.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_lname'), true);
    } else if (email.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_email'), true);
    } else if (!validateEmail(email)) {
      showFlashMessage('Info', getStringMessage('msg_valid_email'), true);
    } else if (mobile.trim().length < 9) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_valid_mobile_number'),
        true,
      );
    } else if (outStanding.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_valid_out_amt'), true);
    } else if (isAdd && regFeesId.toString().trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_reg_fees'),
        true,
      );
    } else if (regFeeStatus.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_reg_fees_status'),
        true,
      );
    } else if (isAdd && joiningDate.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_joining_date'),
        true,
      );
    } else if (orgDuesId.toString().trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_org_dues'),
        true,
      );
    } else if (orgDueStartDate.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_org_dues_date'),
        true,
      );
    } else {
      if (isAdd) {
        setIsSaveDialog(true);
      } else {
        submitRequestAPICall();
      }
    }
  }
  function submitRequestAPICall() {
    {
      btnType == 1 ? setIsLoadingfirst(true) : setIsLoading(true);
    }
    const UserData = isAdd
      ? {
          org_id: constant.orgID,
          firstname: fname,
          lastname: lname,
          email: email,
          mobilenumber: mobile,
          outstanding_amount: outStanding,
          registration_fees_id: regFeesId,
          registration_fees_status: regFeeStatus,
          joining_date: joiningpDate,
          organization_dues: orgDuesId,
          due_start_date: orgDueStartpDate,

          invitation: btnType,
        }
      : {
          org_id: constant.orgID,
          firstname: fname,
          lastname: lname,
          email: email,
          mobilenumber: mobile,
          registration_fees_status: regFeeStatus,
          organization_dues: orgDuesId,
          due_start_date: orgDueStartpDate,
          id: memberId,
        };
    requestAddMember(UserData);
  }
  async function requestAddMember(data) {
    console.log('REQ_AddUpdateMember', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.AddMemberUser : apiName.UpdateMemberUser,
      data,
    )
      .then(res => {
        setIsLoading(false);
        setIsLoadingfirst(false);

        if (res.status == 200) {
          console.log('RES_AddUpdateMember', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            navigation.goBack();
          }
        } else {
          showFlashMessage('Info', res.message, true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        setIsLoadingfirst(false);
        showFlashMessage('Info', getStringMessage('msg_something_wrong'), true);
        console.log('err', err);
      });
  }
  function randerDialog() {
    return (
      <>
        <DoubleButtonDialog
          submitbuttonText={getStringMessage('btn_yes')}
          cancelbuttonText={getStringMessage('btn_cancel')}
          isVisible={isDeleteDialogVisible}
          title={
            '' + route.params.item.status != 1
              ? getStringMessage('lbl_active_status') +
                ' ' +
                route.params.item.firstname +
                ' ' +
                route.params.item.lastname
              : getStringMessage('lbl_inactive_status') +
                ' ' +
                route.params.item.firstname +
                ' ' +
                route.params.item.lastname
          }
          message={getStringMessage('msg_active_inactive_warning')
            .replace(
              '&&',
              route.params.item.status != 1
                ? getStringMessage('lbl_active_status')
                : getStringMessage('lbl_inactive_status'),
            )
            .replace(
              '##',
              ' ' +
                route.params.item.firstname +
                ' ' +
                route.params.item.lastname,
            )}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);
            requestDelete();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
        />
        <DoubleButtonDialog
          submitbuttonText={getStringMessage('btn_save')}
          cancelbuttonText={getStringMessage('btn_cancel')}
          isVisible={isSaveDialog}
          message={getStringMessage('msg_save_member_changes')}
          title={getStringMessage('lbl_save_changes')}
          submitButtonAction={() => {
            setIsSaveDialog(false);
            submitRequestAPICall();
          }}
          cancelButtonAction={() => {
            setIsSaveDialog(false);
          }}
        />

        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={getStringMessage('btn_close')}
          isVisible={isDropBoxVisible}
          title={headerTitle}
          list={commonlist}
          onItemClick={item => {
            console.log('item--', item);
            if (type == 1) {
              setRegFees(item.label);
              setRegFeesId(item.value);
            } else if (type == 2) {
              setRegFeeStatus(item.label);
            } else if (type == 3) {
              setOrgDues(item.label);
              setOrgDuesId(item.value);
            }
            setIsDropBoxVisible(false);
          }}
        />
        <Loader isVisible={isScreenLoading} />
      </>
    );
  }
  /**
   * onDatePickerClicked
   */
  function onDatePickerClicked(from) {
    setDatePickerVisibility(true);
    setDatePickerType(from);
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async date => {
    if (datePickerType == 0) {
      setJoiningDate(moment(date).format(dateFormat.DISPLAY));
      setJoiningpDate(moment(date).format(dateFormat.POSTING));
    } else if (datePickerType == 1) {
      setOrgDueStartDate(moment(date).format(dateFormat.DISPLAY));
      setOrgDueStartpDate(moment(date).format(dateFormat.POSTING));
    }
    hideDatePicker();
  };
  async function requestDelete() {
    let formData = new FormData();
    formData.append('member_id', memberId);
    formData.append('org_id', constant.orgID);
    formData.append('status', route.params.item.status == 1 ? 0 : 1);

    console.log('REQ_chageMemberStatsu', formData);
    return Axios.requestData('POST', apiName.InActiveMember, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_chageMemberStatsu', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            navigation.goBack();
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
  async function requestSendIntimation() {
    setIsLoadingSend(true);
    let formData = new FormData();
    formData.append('member_id', memberId);
    formData.append('org_id', constant.orgID);
    // formData.append('status', route.params.item.status == 1 ? 0 : 1);

    console.log('REQ_sendInvitationMember', formData);
    return Axios.requestData('POST', apiName.sendInvitationMember, formData)
      .then(res => {
        setIsLoadingSend(false);
        if (res.status == 200) {
          console.log('RES_sendInvitationMember', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            navigation.goBack();
          }
        } else {
          showFlashMessage('Info', res.message, true);
        }
      })
      .catch(err => {
        setIsLoadingSend(false);
        showFlashMessage('Info', getStringMessage('msg_something_wrong'), true);
        console.log('err', err);
      });
  }
  async function requestGetRegistrationFees() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('REQ_getRegistrationfees', data);
    return Axios.requestData('POST', apiName.getRegistrationfees, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetRegistrationfees', res.data.result);
          let LArray = [];
          res.data.result.map(item => {
            var obj = {
              label: constant.CURRENCY_SYMBOL + item.amount,
              value: item.id,
            };
            LArray.push(obj);
          });
          setCommonlist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setIsDropBoxVisible(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_GetRegistrationfees_err', err);
      });
  }
  async function requestGetRegistrationStatus() {
    let LArray = [
      {label: getStringMessage('lbl_status_paid'), value: 1},
      {label: getStringMessage('lbl_status_pending'), value: 0},
      {label: getStringMessage('lbl_status_Waived'), value: 2},
    ];
    setCommonlist(LArray);
    setTimeout(() => {
      setIsScreenLoading(false);
      setIsDropBoxVisible(true);
    }, 300);
  }
  async function requestGetOrganisationDues() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('REQ_getOrgDues', data);
    return Axios.requestData('POST', apiName.getOrgDues, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getOrgDues', res.data.result);
          let LArray = [];
          res.data.result.map(item => {
            var obj = {
              label:
                constant.CURRENCY_SYMBOL + item.amount + ' - ' + item.title,
              value: item.id,
            };
            LArray.push(obj);
          });
          setCommonlist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setIsDropBoxVisible(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getOrgDues_err', err);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
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
            route={
              isAdd
                ? getStringMessage('lbl_create_member_title')
                : getStringMessage('lbl_edit_member_title')
            }
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </Animated.View>

        {/* <Animated.View style={{flex: 1, opacity: fadeValue}}> */}
        <View style={[styles.topContainer]}>
          {randerDialog()}
          <ScrollView style={{marginHorizontal: 5}}>
            <View>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_fname_hint')}
                updateMasterState={value => setFname(value)}
                value={fname}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_lname_hint')}
                updateMasterState={value => setLname(value)}
                value={lname}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                email
                isImage={false}
                inputTitle={getStringMessage('lbl_email_address_hint')}
                updateMasterState={value => setEmail(value)}
                value={email}
                returnKey={
                  isAdd ? constant.KEY_BTN_NEXT : constant.KEY_BTN_DONE
                }
              />
              <InputField
                number
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_valid_mobile')}
                updateMasterState={value => setMobile(value)}
                value={mobile}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                number
                inputTitleVisible={true}
                isEditable={isAdd}
                isImage={false}
                inputTitle={getStringMessage('hint_outstand_amount')}
                updateMasterState={value => setoutStanding(value)}
                value={outStanding}
                returnKey={constant.KEY_BTN_NEXT}
              />
              {/* <DropdownField
                isDisable={!isAdd}
                inputTitle={getStringMessage('lbl_registration_fees')}
                value={regFees}
                onClick={() => {
                  setCommonlist([]);
                  setType(1);
                  setHeaderTitle(getStringMessage('lbl_select_reg_fee'));
                  requestGetRegistrationFees();
                }}
              /> */}
              <InputField
                inputTitleVisible={true}
                isEditable={false}
                isImage={false}
                inputTitle={getStringMessage('lbl_registration_fees')}
                // updateMasterState={value => setFname(value)}
                value={regFees}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <DropdownField
                inputTitle={getStringMessage('lbl_status_reg_fees')}
                value={regFeeStatus}
                onClick={() => {
                  setCommonlist([]);
                  setType(2);
                  setHeaderTitle(getStringMessage('lbl_select_reg_status'));
                  requestGetRegistrationStatus();
                }}
              />
              <TouchableOpacity
                style={{flex: 1}}
                disabled={!isAdd}
                onPress={() => {
                  onDatePickerClicked(0);
                }}>
                <InputField
                  date
                  inputTitleVisible={true}
                  isEditable={false}
                  inputTitle={getStringMessage('lbl_joining_date')}
                  isImage={true}
                  inputIconHint={imagePath.ic_calendar}
                  updateMasterState={value => setJoiningDate(value)}
                  value={joiningDate}
                />
              </TouchableOpacity>
              {/* <DropdownField
                inputTitle={getStringMessage('lbl_org_dues')}
                value={orgDues}
                onClick={() => {
                  console.log('status click');
                  setCommonlist([]);
                  setType(3);
                  setHeaderTitle(getStringMessage('lbl_select_org_dues'));
                  requestGetOrganisationDues();
                }}
              /> */}
              <InputField
                inputTitleVisible={true}
                isEditable={false}
                isImage={false}
                inputTitle={getStringMessage('lbl_org_dues')}
                // updateMasterState={value => setFname(value)}
                value={orgDues}
                multiline
                returnKey={constant.KEY_BTN_NEXT}
              />
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => {
                  onDatePickerClicked(1);
                }}>
                <InputField
                  date
                  inputTitleVisible={true}
                  isEditable={false}
                  inputTitle={getStringMessage('lbl_org_due_starts_on')}
                  isImage={true}
                  inputIconHint={imagePath.ic_calendar}
                  updateMasterState={value => setOrgDueStartDate(value)}
                  value={orgDueStartDate}
                />
              </TouchableOpacity>

              {isAdd && (
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={getStringMessage('btn_save_send_invite')}
                  onClick={() => {
                    setBtnType(1);
                    validation();
                  }}
                  isloading={isLoadingfirst}
                />
              )}
              {/* {isAdd && route.params.item.is_verified == 0 ? null : (
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={
                    route.params.item.is_verified == 2
                      ? getStringMessage('btn_update_send_invite')
                      : getStringMessage('btn_resend_invite')
                  }
                  onClick={() => {
                    requestSendIntimation();
                  }}
                  isloading={isLoadingSend}
                />
              )} */}
              <ButtonBlue
                btnColor={colors.grayColor}
                btnText={
                  isAdd
                    ? getStringMessage('btn_save')
                    : getStringMessage('btn_update_small')
                }
                onClick={() => {
                  setBtnType(2);
                  validation();
                }}
                isloading={isLoading}
              />
              {!isAdd && (
                <ButtonBlue
                  btnColor={colors.redColor}
                  btnText={getStringMessage('btn_active_inactive')}
                  onClick={() => setIsDeleteDialogVisible(true)}
                  isloading={isLoadingDelete}
                />
              )}
            </View>
          </ScrollView>
        </View>
        {/* </Animated.View> */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={currentDate}
        />
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

export default AddMemberUser;
