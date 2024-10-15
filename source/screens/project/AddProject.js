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
import moment from 'moment';

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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {dateFormat} from '../../constants/commonStrings';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddAdminUsers = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [adminId, setAdminId] = useState('');
  const [fname, setFname] = useState('');
  const [address, setAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState(strings.lbl_active_status);
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [orgLogo, setOrgLogo] = useState('');
  const [isMediaDialogVisible, setIsMediaDialogVisible] = useState(false);
  const [isProfileLoad, setIsProfileLoad] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const commonlist = [
    {label: strings.lbl_active_status, value: 1},
    {label: strings.lbl_inactive_status, value: 0},
  ];
  const [type, setType] = useState(0);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [companylist, setCompanylist] = useState([]);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [isDisplayStatedialog, setDisplayStateDialog] = useState(false);
  const [isDisplayList1dialog, setDisplayList1Dialog] = useState(false);
  const [company, setCompany] = useState('');
  const [companyI, setCompanyI] = useState('');

  const [rolelist, setRolelist] = useState([]);
  const [role, setRole] = useState('');
  const [roleI, setRoleI] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [pstartDate, setpStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pendDate, setpEndDate] = useState('');
  const [toDate, setTodate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(
    new Date().setHours(0, 0, 0, 0),
  );
  const [city, setCity] = useState('');
  const [cityI, setCityI] = useState('');

  const [state, setState] = useState('');
  const [stateI, setStateI] = useState('');
  const fadeValue = new Animated.Value(0);
  const slideUpAnimation = new Animated.Value(0);
  const [citylist, setCitylist] = useState([]);

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
    console.log('item=', item);
    setAdminId(item.Id);
    setFname(item.ProjectName);
    setAddress(item.Address);
    setCity(item.CityName);
    setCityI(item.CityId);
    setCompany(item.CompanyName);
    setCompanyI(item.CompanyId);
    setRemarks(item.Remarks);
    setStartDate(item.StartDate);
    setEndDate(item.EndDate);
    setpEndDate(item.EndDate);
    setStatus(
      item.isActive ? strings.lbl_active_status : strings.lbl_inactive_status,
    );
    requestInitGetComapanyData(item.CompanyId);
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
    // navigation.navigate(stack.ADD_TEAM, {
    //   isAdd: true,
    //   // item: item,
    // });
    if (fname.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_project_name, true);
    } else if (address.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_address, true);
    } else if (city.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_city, true);
    }
    //  else if (state.trim().length == 0) {
    //   showFlashMessage('Required', strings.msg_enter_state, true);
    // }
    else if (startDate.trim().length == 0) {
      showFlashMessage('Required', strings.msg_select_start_date_first, true);
    } else if (pendDate.trim().length == 0) {
      showFlashMessage('Required', strings.msg_select_end_date, true);
    } else if (remarks.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_remarks, true);
    } else if (company.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_company, true);
    } else if (status.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_status, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            cityId: cityI,
            clientId: constant.CLIENT_ID,
            companyId: companyI,
            projectName: fname,
            address: address,
            startDate: startDate,
            endDate: pendDate,
            remarks: remarks,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            languageId: constant.LANGUAGE_ID,
          }
        : {
            cityId: cityI,
            clientId: constant.CLIENT_ID,
            companyId: companyI,
            projectName: fname,
            address: address,
            startDate: startDate,
            endDate: pendDate,
            remarks: remarks,
            isActive: status == strings.lbl_active_status ? true : false,
            createdBy: constant.USER_ID,
            languageId: constant.LANGUAGE_ID,
            id: adminId,
          };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_AddProject', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.AddProject : apiName.EditProject,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_AddProject', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.errorMessag, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            navigation.goBack();
          }
        } else {
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', strings.msg_something_wrong, true);
        console.log('err', err);
      });
  }
  async function requestGetCity() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_GetCity');
    return Axios.requestData('POST', apiName.getCity, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetCity', res.data.data.citylist);
          let LArray = [];
          res.data.data.citylist.map(item => {
            var obj = {label: item.CityName, value: item.Id};
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
  async function requestGetState() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_GetCity');
    return Axios.requestData('POST', apiName.getCity, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetCity', res.data.data.citylist);
          let LArray = [];
          res.data.data.citylist.map(item => {
            var obj = {label: item.CityName, value: item.Id};
            LArray.push(obj);
          });
          setCitylist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayStateDialog(true);
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
            setDisplayList1Dialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayList1dialog}
          title={headerTitle}
          list={companylist}
          onItemClick={item => {
            console.log('item--', item);
            setCompany(item.label);
            setCompanyI(item.value);
            setDisplayList1Dialog(false);
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
            setCity(item.label);
            setCityI(item.value);
            setDisplayListDialog(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setDisplayStateDialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayStatedialog}
          title={headerTitle}
          list={citylist}
          onItemClick={item => {
            console.log('item--', item);
            setState(item.label);
            setStateI(item.value);
            setDisplayStateDialog(false);
          }}
        />
      </>
    );
  }
  async function requestDelete() {
    const data = {
      id: adminId,
      createdBy: constant.USER_ID,
      projectId: adminId,
      clientId: constant.CLIENT_ID,
      companyId: companyI,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_DeleteProject', data);
    return Axios.requestData('POST', apiName.DeleteProject, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_DeleteProject', res.data);
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
            };
            LArray.push(obj);
          });

          setCompanylist(LArray);
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
        console.log('RES_GetCompany_err', err);
      });
  }

  /**
   * onDatePickerClicked
   */
  function onDatePickerClicked(from) {
    if (from == 2 && pstartDate == '') {
      showFlashMessage('Info', strings.msg_select_start_date_first, true);
    } else {
      setDatePickerVisibility(true);
      setType(from);
    }
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async date => {
    if (type == 1) {
      if (currentDate <= date) {
        setStartDate(moment(date).format(dateFormat.DISPLAY));
        setpStartDate(moment(date).format(dateFormat.DISPLAY));
        setCurrentDate(date);
      } else {
        showFlashMessage('Info', strings.msg_formGreaterThanTo, true);
      }
    } else if (type == 2) {
      console.log('date333 ', date);
      if (date < currentDate) {
        console.log('date4444 ', date);
        showFlashMessage('Info', strings.msg_geaterThanCurrDate, true);
      } else {
        setTodate(date);
        setEndDate(moment(date).format(dateFormat.DISPLAY));
        setpEndDate(moment(date).format(dateFormat.DISPLAY));
      }
    }

    hideDatePicker();
  };

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
            route={
              isAdd ? strings.lbl_create_new_project : strings.lbl_edit_project
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
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_project_name_hint}
                updateMasterState={value => setFname(value)}
                value={fname}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_address_hint}
                updateMasterState={value => setAddress(value)}
                value={address}
                returnKey={constant.KEY_BTN_NEXT}
              />
              <DropdownField
                inputTitle={strings.lbl_city_hint}
                value={city}
                onClick={() => {
                  setCitylist([]);
                  setHeaderTitle(strings.lbl_select_city);
                  requestGetCity();
                }}
              />
              {/* <DropdownField
                inputTitle={strings.lbl_state_hint}
                value={state}
                onClick={() => {
                  setCitylist([]);
                  setHeaderTitle(strings.lbl_select_state);
                  requestGetState();
                }}
              /> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => {
                    onDatePickerClicked(1);
                  }}>
                  <InputField
                    date
                    inputTitleVisible={true}
                    isEditable={false}
                    inputTitle={strings.lbl_start_date_hint}
                    isImage={true}
                    inputIconHint={imagePath.ic_calendar}
                    updateMasterState={value => setStartDate(value)}
                    value={startDate}
                  />
                </TouchableOpacity>
                <View style={{width: wp(5)}} />
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => {
                    onDatePickerClicked(2);
                  }}>
                  <InputField
                    date
                    inputTitleVisible={true}
                    isEditable={false}
                    inputTitle={strings.lbl_end_date_hint}
                    isImage={true}
                    inputIconHint={imagePath.ic_calendar}
                    updateMasterState={value => setEndDate(value)}
                    value={endDate}
                  />
                </TouchableOpacity>
              </View>
              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_remarks_hint}
                updateMasterState={value => setRemarks(value)}
                value={remarks}
              />
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
