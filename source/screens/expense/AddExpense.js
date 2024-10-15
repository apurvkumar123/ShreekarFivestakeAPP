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
import {stack} from '../../constants/commonStrings';
import ButtonBlue from '../../custom/Buttons/ButtonBlue';
import InputField from '../../custom/InputField';
import LoginHeader from '../../custom/LoginHeader';
import commonStyle from '../../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';

import constant from '../../constants/constant';
import {
  showFlashMessage,
  validateEmail,
  validatePassword,
} from '../../utility/Utility';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import Header from '../../custom/Header';
import DropdownField from '../../custom/DropdownField';
import ListDialog from '../../custom/Dialogs/ListDialog';
import Axios from '../../network/Axios';
import {apiName} from '../../network/serverConfig';
import DoubleButtonDialog from '../../custom/Dialogs/DoubleButtonDialog';
import strings from '../../utility/screenStrings';
import Loader from '../../custom/Loader';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddExpense = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [adminId, setAdminId] = useState('');
  const [amount, setAmount] = useState('');
  const [voucher, setVoucher] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState(strings.lbl_active_status);

  const [projectI, setProjectI] = useState('');
  const [projectlist, setProjectlist] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryI, setCategoryI] = useState('');

  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const [headerTitle, setHeaderTitle] = useState('');
  const [citylist, setCitylist] = useState([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const commonlist = [
    {label: strings.lbl_active_status, value: 1},
    {label: strings.lbl_inactive_status, value: 0},
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
        requestGetProject();
        !isAdd && importData();
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
  async function requestGetProject() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      projectId: 0,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getProjectList');
    return Axios.requestData('POST', apiName.getProjectList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getProjectList', JSON.stringify(res.data.data));
          let LArray = [];
          res.data.data.Projectlist.map(item => {
            var obj = {label: item.ProjectName, value: item.Id};
            LArray.push(obj);
          });
          setProjectlist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getProjectList_err', err);
      });
  }
  function importData() {
    var item = route.params.item;
    console.log('item:>>', item);
    setAdminId(item.Id);
    setAmount('' + item.Amount);
    setVoucher(item.voucherNumber);
    setRemarks(item.Remarks);
    setCategory(item.ExpenseName);
    setCategoryI(item.ExpenseCategoryId);
    setProjectI(item.ProjectId);
    setStatus(
      item.isActive ? strings.lbl_active_status : strings.lbl_inactive_status,
    );
  }
  function validation() {
    if (category.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_category, true);
    } else if (amount.trim().length == 0 || amount < 0) {
      showFlashMessage('Required', strings.msg_valid_amount, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            expenseCategoryId: categoryI,
            clientId: constant.CLIENT_ID,
            projectId: projectlist[0].value,
            amount: amount,
            remarks: remarks,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            languageId: constant.LANGUAGE_ID,
            voucherNumber: voucher,
          }
        : {
            id: adminId,
            expenseCategoryId: categoryI,
            clientId: constant.CLIENT_ID,
            projectId: projectlist[0].value,
            amount: amount,
            remarks: remarks,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            languageId: constant.LANGUAGE_ID,
            voucherNumber: voucher,
          };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_AddExpense', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.AddExpense : apiName.EditExpense,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_AddExpense', res.data.data);
          showFlashMessage('Success!', res.data.errorMessage, false);
          navigation.goBack();
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
        <DoubleButtonDialog
          submitbuttonText={strings.btn_yes_delete}
          cancelbuttonText={strings.btn_cancel}
          isVisible={isDeleteDialogVisible}
          message={strings.msg_delete}
          title={strings.btn_delete}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);
            requestDelete();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
        />

        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={strings.btn_close}
          isVisible={isDropBoxVisible}
          title={strings.lbl_select_status}
          list={commonlist}
          onItemClick={item => {
            setStatus(item.label);
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
          list={citylist}
          onItemClick={item => {
            console.log('item--', item);
            setCategory(item.label);
            setCategoryI(item.value);
            setDisplayListDialog(false);
          }}
        />
      </>
    );
  }
  async function requestGetCity() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
      screenname: 'addmaterial',
    };
    console.log('REQ_GetExpenseCategory');
    return Axios.requestData('POST', apiName.getExpenseCategoryList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetExpenseCategory', res.data.data);
          let LArray = [];

          res.data.data.tExpenseCategorylist.map(item => {
            var obj = {label: item.ExpenseName, value: item.Id};
            LArray.push(obj);
          });
          setCitylist(LArray);
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
        console.log('RES_GetExpenseCategory_err', err);
      });
  }
  async function requestDelete() {
    const data = {
      id: adminId,
    };
    console.log('REQ_DeleteWarehouse', data);
    return Axios.requestData('POST', apiName.DeleteExpense, data)
      .then(res => {
        setIsLoading(false);
        if (res.data.status == false) {
          showFlashMessage('Info', res.data.errorMessage, true);
        } else {
          showFlashMessage('Success!', res.data.errorMessage, false);
          navigation.goBack();
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', strings.msg_something_wrong, true);
        console.log('err', err);
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
            route={isAdd ? strings.lbl_add_expense : strings.lbl_edit_expense}
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
                inputTitle={strings.lbl_category_hint}
                value={category}
                onClick={() => {
                  setCitylist([]);
                  setHeaderTitle(strings.lbl_select_category);
                  requestGetCity();
                }}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_voucher_hint}
                updateMasterState={value => setVoucher(value)}
                value={voucher}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                number
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_amount_hint}
                updateMasterState={value => setAmount(value)}
                value={amount}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_remarks_hint}
                updateMasterState={value => setRemarks(value)}
                value={remarks}
              />

              {/* <DropdownField
                inputTitle={strings.lbl_status_hint}
                value={status}
                onClick={() => {
                  console.log('status click');
                  setIsDropBoxVisible(true);
                }}
              /> */}

              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={isAdd ? strings.btn_save : strings.btn_update}
                onClick={() => validation()}
                isloading={isLoading}
              />
              {!isAdd && (
                <ButtonBlue
                  btnColor={colors.redColor}
                  btnText={strings.btn_delete}
                  onClick={() => setIsDeleteDialogVisible(true)}
                  isloading={isLoadingDelete}
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

export default AddExpense;
