import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
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
import ImageCropPicker from 'react-native-image-crop-picker';
import MediaDialog from '../../custom/Dialogs/MediaDialog';
import Loader from '../../custom/Loader';
import {imagePath} from '../../utility/imagePath';
import MultiListDialog from '../../custom/Dialogs/MultiListDialog';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddAdminUsers = ({route}) => {
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
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [orgLogo, setOrgLogo] = useState('');
  const [isMediaDialogVisible, setIsMediaDialogVisible] = useState(false);
  const [isProfileLoad, setIsProfileLoad] = useState(false);
  const commonlist = [
    {label: strings.lbl_active_status, value: 1},
    {label: strings.lbl_inactive_status, value: 0},
  ];
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [companylist, setCompanylist] = useState([]);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [isDisplayList1dialog, setDisplayList1Dialog] = useState(false);
  const [company, setCompany] = useState('');
  const [companyI, setCompanyI] = useState('');

  const [rolelist, setRolelist] = useState([]);
  const [role, setRole] = useState('');
  const [roleI, setRoleI] = useState(0);
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
    setAdminId(item.Id);
    setFname(item.UserName);
    setMobile(item.MobileNumber);
    setEmail(item.Email);
    setCompanyI(item.CompanyIds);
    setRoleI(item.RoleId);
    setStatus(
      item.isActive ? strings.lbl_active_status : strings.lbl_inactive_status,
    );
    requestInitGetComapanyData(item.CompanyIds);
    requestInitGetRoleData(item.RoleId);
  }
  async function requestInitGetRoleData(selectedids) {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_getRoleData');
    return Axios.requestData('POST', apiName.getRoleData, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getRoleData', res.data.data);
          var matchingRoleNames = res.data.data.rolelist
            .filter(item => selectedids == String(item.Id))
            .map(item => item.RoleName)
            .join(',');
          console.log('companyI--', selectedids);
          console.log('matchingCompanyNames=', matchingRoleNames);
          setTimeout(() => {
            setIsScreenLoading(false);
            setRole(matchingRoleNames);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getRoleData_err', err);
      });
  }

  async function requestInitGetComapanyData(selectedids) {
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
          var matchingCompanyNames = res.data.data.companylist
            .filter(item => selectedids.split(',').includes(String(item.Id)))
            .map(item => item.CompanyName)
            .join(',');
          console.log('companyI--', selectedids);
          console.log('matchingCompanyNames=', matchingCompanyNames);
          setTimeout(() => {
            setIsScreenLoading(false);
            setCompany(matchingCompanyNames);
            // setDisplayListDialog(true);
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
  function validation() {
    if (fname.trim().length == 0) {
      showFlashMessage('Required', strings.msg_name, true);
    } else if (mobile.trim().length < 9) {
      showFlashMessage('Required', strings.msg_valid_mobile, true);
    } else if (email.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_email, true);
    } else if (!validateEmail(email)) {
      showFlashMessage('Required', strings.msg_valid_email, true);
    } else if (isAdd && password.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_pass, true);
    } else if (isAdd && !validatePassword(password)) {
      showFlashMessage('Required', strings.msg_valid_pass, true);
    } else if (company.trim().length == 0) {
      showFlashMessage('Required', strings.msg_select_company_name, true);
    } else if (role.trim().length == 0) {
      showFlashMessage('Required', strings.msg_select_role, true);
    } else if (status.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_status, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            clientId: constant.CLIENT_ID,
            companyIds: '' + companyI,
            roleId: roleI,
            userName: fname,
            mobileNumber: mobile,
            email: email,
            photo: '',
            password: password,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            deviceToken: '',
            deviceType: 0,
            deviceVersion: '',
            deviceDetails: '',
          }
        : {
            clientId: constant.CLIENT_ID,
            companyIds: '' + companyI,
            roleId: roleI,
            userName: fname,
            mobileNumber: mobile,
            email: email,
            photo: '',
            password: '123',
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            deviceToken: '',
            deviceType: 0,
            deviceVersion: '',
            deviceDetails: '',
            id: adminId,
          };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_AddAdminUser', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.AddAdminUser : apiName.EditAdminUser,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_AddAdminUser', res.data);
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
        <MultiListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayListdialog}
          title={headerTitle}
          list={companylist}
          onItemClick={array => {
            console.log('items--', array);
            setCompany(array.map(item => item.label).join(','));
            setCompanyI(array.map(item => item.value).join(','));
            setDisplayListDialog(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setDisplayList1Dialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayList1dialog}
          title={headerTitle}
          list={rolelist}
          onItemClick={item => {
            console.log('item--', item);
            setRole(item.label);
            setRoleI(item.value);
            setDisplayList1Dialog(false);
          }}
        />
      </>
    );
  }
  async function requestDelete() {
    let formData = new FormData();
    formData.append('id', adminId);
    console.log('REQ_DeleteAdmin', formData);
    return Axios.requestData('POST', apiName.DeleteAdminUser, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_DeleteAdmin', res.data);
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
        showFlashMessage('Info', strings.msg_something_wrong, true);
        console.log('err', err);
      });
  }
  function SelectedMedia(option) {
    if (option == constant.CAMERA_OPTION) {
      //Camera
      setTimeout(() => {
        ImageCropPicker.openCamera({
          width: window.width,
          height: window.width,
          cropping: true,
        }).then(image => {
          console.log('camera_image', JSON.stringify(image));
          {
            setOrgLogo(image.path);
          }

          setIsMediaDialogVisible(false);
        });
      }, 500);
    } else {
      //Gallery
      setTimeout(() => {
        ImageCropPicker.openPicker({
          width: window.width,
          height: window.height,
          cropping: true,
        }).then(image => {
          console.log('gallery_image', JSON.stringify(image));
          {
            setOrgLogo(image.path);
          }
          setIsMediaDialogVisible(false);
        });
      }, 500);
    }
  }
  async function requestGetRoleData() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_getRoleData');
    return Axios.requestData('POST', apiName.getRoleData, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getRoleData', res.data.data);
          let LArray = [];
          res.data.data.rolelist.map(item => {
            var obj = {label: item.RoleName, value: item.Id};
            LArray.push(obj);
          });
          setRolelist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayList1Dialog(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getRoleData_err', err);
      });
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
              isSelected: companyI.split(',').includes(String(item.Id)),
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
        <MediaDialog
          isVisible={isMediaDialogVisible}
          cameraButtonAction={() => {
            SelectedMedia(constant.CAMERA_OPTION);
          }}
          GalleryButtonAction={() => {
            SelectedMedia(constant.GALLERY_OPTION);
          }}
          cancelButtonAction={() => {
            setIsMediaDialogVisible(false);
          }}
        />
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
            route={isAdd ? strings.lbl_add_user : strings.lbl_edit_user}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
          <View style={styles.profileContainerMain}>
            <View style={styles.profileContainer}>
              <Image style={styles.orgLogo} source={{uri: orgLogo}} />
              {isProfileLoad && (
                <ActivityIndicator
                  style={styles.styleIndecator}
                  size="large"
                  color={colors.btnColor}
                  animating={true}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.profilechangeContainer}
              onPress={() => {
                setIsMediaDialogVisible(true);
              }}>
              <Image style={styles.orgchangeicon} source={imagePath.ic_edit} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={[styles.topContainer]}>
            {randerDialog()}
            <ScrollView style={{marginHorizontal: 5}}>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_name_hint}
                updateMasterState={value => setFname(value)}
                value={fname}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                number
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_mobile_hint}
                updateMasterState={value => setMobile(value)}
                value={mobile}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                email
                isImage={false}
                inputTitle={strings.lbl_email_hint}
                updateMasterState={value => setEmail(value)}
                value={email}
                returnKey={
                  isAdd ? constant.KEY_BTN_NEXT : constant.KEY_BTN_DONE
                }
              />
              {isAdd && (
                <InputField
                  inputTitleVisible={true}
                  isEditable={true}
                  pass
                  secure={true}
                  inputTitle={strings.lbl_password_hint}
                  isImage={false}
                  updateMasterState={value => setPassword(value)}
                  value={password}
                  returnKey={constant.KEY_BTN_DONE}
                />
              )}
              <DropdownField
                inputTitle={strings.lbl_menu_company}
                value={company}
                onClick={() => {
                  setCompanylist([]);
                  setHeaderTitle(strings.lbl_menu_company);
                  requestGetComapanyData();
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_role_hint}
                value={role}
                onClick={() => {
                  setRolelist([]);
                  setHeaderTitle(strings.lbl_role_hint);
                  requestGetRoleData();
                }}
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
              {/* {!isAdd && (
                <ButtonBlue
                  btnColor={colors.redColor}
                  btnText={strings.btn_delete}
                  onClick={() => setIsDeleteDialogVisible(true)}
                  isloading={isLoadingDelete}
                />
              )} */}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  profileContainerMain: {
    alignItems: 'center',
    width: wp(80),
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  orgLogo: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35) / 2,
    resizeMode: 'contain',
  },
  orgchangeicon: {
    height: hp(2.5),
    width: wp(5),
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    alignSelf: 'center',
  },
  profileContainer: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35) / 2,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
  },
  profilechangeContainer: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: colors.btnColor,
    position: 'absolute',
    bottom: hp(0),
    right: wp(25),
    justifyContent: 'center',
  },
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

export default AddAdminUsers;
