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
const AddMaterialName = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [adminId, setAdminId] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(strings.lbl_active_status);

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
  function importData() {
    var item = route.params.item;
    console.log('item:', item);
    setAdminId(item.Id);
    setFname(item.MaterialName);
    setCategory(item.CategoryName);
    setCategoryI(item.MaterialCategoryId);
    setStatus(
      item.isActive ? strings.lbl_active_status : strings.lbl_inactive_status,
    );
  }
  function validation() {
    if (category.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_category, true);
    } else if (fname.trim().length == 0) {
      showFlashMessage('Required', strings.msg_nameSize_name, true);
    } else if (status.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_status, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            materialCategoryId: categoryI,
            clientId: constant.CLIENT_ID,
            materialName: fname,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            languageId: constant.LANGUAGE_ID,
          }
        : {
            id: adminId,
            materialCategoryId: categoryI,
            clientId: constant.CLIENT_ID,
            materialName: fname,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            languageId: constant.LANGUAGE_ID,
          };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_AddMaterial', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.AddMaterial : apiName.EditMaterial,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_AddMaterial', res.data.data);
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
    console.log('REQ_GetMaterialCat');
    return Axios.requestData('POST', apiName.GetMaterialCat, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetMaterialCat', res.data.data);
          let LArray = [];
          res.data.data.materialCategorylist.map(item => {
            var obj = {label: item.CategoryName, value: item.Id};
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
        console.log('RES_GetCity_err', err);
      });
  }
  async function requestDelete() {
    const data = {
      id: adminId,
    };
    console.log('REQ_DeleteWarehouse', data);
    return Axios.requestData('POST', apiName.DeleteMaterial, data)
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
            route={
              isAdd
                ? strings.lbl_add_materialName
                : strings.lbl_edit_materialName
            }
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
                inputTitle={strings.lbl_name_size_hint}
                updateMasterState={value => setFname(value)}
                value={fname}
                returnKey={constant.KEY_BTN_NEXT}
              />

              <DropdownField
                inputTitle={strings.lbl_status_hint}
                value={status}
                onClick={() => {
                  console.log('status click');
                  setIsDropBoxVisible(true);
                }}
              />

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

export default AddMaterialName;
