import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
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
import {imagePath} from '../../utility/imagePath';
import MediaDialog from '../../custom/Dialogs/MediaDialog';
import ImageCropPicker from 'react-native-image-crop-picker';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddProjectFund = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [adminId, setAdminId] = useState('');

  const [amount, setAmount] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [mode, setMode] = useState(strings.lbl_credit_mode);
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('Requested');
  const [statusI, setStatusI] = useState(1);
  const [fromCompany, setFromCompany] = useState('');
  const [fromCompanyI, setFromCompanyI] = useState('');

  const [project, setProject] = useState('');
  const [projectI, setProjectI] = useState('');

  const [orgLogo, setOrgLogo] = useState('');
  const [isMediaDialogVisible, setIsMediaDialogVisible] = useState(false);
  const [isProfileLoad, setIsProfileLoad] = useState(false);

  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isStatusDropBoxVisible, setIsStatusDropBoxVisible] = useState(false);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [isDisplayProjectdialog, setDisplayProjectDialog] = useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const [headerTitle, setHeaderTitle] = useState('');
  const [companylist, setCompanylist] = useState([]);
  const [projectlist, setProjectlist] = useState([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const commonlist = [
    {label: strings.lbl_credit_mode, value: 1},
    {label: strings.lbl_debit_mode, value: 0},
  ];
  const [statuslist, setStatusList] = useState([
    {label: strings.lbl_option_warehouse, value: 1},
    {label: strings.lbl_option_project, value: 0},
  ]);
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
        {
          isAdd ? setShowUI(true) : getFundDetails();
        }
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
    console.log('itemAP:', item);

    setAdminId(item.Id);

    setFromCompanyI('' + item.CompanyId);
    setFromCompany('' + item.CompanyName);

    setProject('' + item.ProjectName);
    setProjectI('' + item.ProejectId);

    setMode(
      item.PaymentMode === 'Credit'
        ? strings.lbl_credit_mode
        : item.PaymentMode === 'Debit'
        ? strings.lbl_debit_mode
        : item.PaymentMode,
    );

    setAmount('' + item.RequestedAmount);
    setShowUI(true);
  }
  function validation() {
    // if (fromCompany.trim().length == 0) {
    //   showFlashMessage('Required', strings.msg_enter_from_company, true);
    // } else
    if (project.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_project, true);
    } else if (mode.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_mode, true);
    } else if (amount.trim().length == 0) {
      showFlashMessage('Required', strings.msg_valid_request_amount, true);
    } else if (purpose.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_purpose, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            createdBy: constant.USER_ID,
            clientId: constant.CLIENT_ID,
            isActive: true,
            languageId: constant.LANGUAGE_ID,
            // companyId: +fromCompanyI,
            proejectId: +projectI,
            paymentMode: mode,
            requestedAmount: +amount,
            purpose: purpose,
            requestRemark: '',
            photo: '',
          }
        : {
            id: adminId,
            createdBy: constant.USER_ID,
            clientId: constant.CLIENT_ID,
            isActive: true,
            languageId: constant.LANGUAGE_ID,
            // companyId: +fromCompanyI,
            proejectId: +projectI,
            paymentMode: mode,
            requestedAmount: +amount,
            purpose: purpose,
            requestRemark: '',
            photo: '',
          };
      console.log('data', UserData);
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_addProjectFund', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.addProjectFund : apiName.editProjectFund,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_addProjectFund', res.data.data);
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
          title={strings.lbl_select_mode}
          list={commonlist}
          onItemClick={item => {
            setMode(item.label);
            setIsDropBoxVisible(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setIsStatusDropBoxVisible(false);
          }}
          buttonText={strings.btn_close}
          isVisible={isStatusDropBoxVisible}
          title={strings.lbl_select_status}
          list={statuslist}
          onItemClick={item => {
            setStatus(item.label);
            setStatusI(item.value);
            setIsStatusDropBoxVisible(false);
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
          list={companylist}
          onItemClick={item => {
            console.log('item--', item);
            setFromCompany(item.label);
            setFromCompanyI(item.value);
            setDisplayListDialog(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setDisplayProjectDialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayProjectdialog}
          title={headerTitle}
          list={projectlist}
          onItemClick={item => {
            console.log('item--', item);
            setProject(item.label);
            setProjectI(item.value);
            setDisplayProjectDialog(false);
          }}
        />
      </>
    );
  }
  async function requestGetCompany() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_getComapanyData');
    return Axios.requestData('POST', apiName.CompanyList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getComapanyData', res.data.data);
          let LArray = [];
          res.data.data.companylist.map(item => {
            var obj = {label: item.CompanyName, value: item.Id};
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
        console.log('RES_getComapanyData_err', err);
      });
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
            setDisplayProjectDialog(true);
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

  async function getFundDetails() {
    const data = {
      id: route.params.item.Id,
      createdBy: constant.USER_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_getFundDetails', data);
    return Axios.requestData('POST', apiName.getProjectFUndDetails, data)
      .then(res => {
        setIsLoading(false);
        if (res.data.status == false) {
          showFlashMessage('Info', res.data.errorMessage, true);
        } else {
          const detailedRes = res.data.data.ProjectFundList[0];
          console.log('detailedRes', detailedRes);
          console.log('detailedRes', detailedRes.ApprovedAmount);
          setPurpose(detailedRes.Purpose);
          setStatus(detailedRes.RequestStatusText);
          setStatusI(detailedRes.RequestStatus);
          setRemarks(detailedRes.RequestRemark);
          setFinalAmount('' + detailedRes.ApprovedAmount);
          importData();
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', strings.msg_something_wrong, true);
        console.log('err', err);
      });
  }

  async function requestDelete() {
    const data = {
      id: adminId,
      createdBy: constant.USER_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_deleteProjectFund', data);
    return Axios.requestData('POST', apiName.deleteProjectFund, data)
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
              isAdd
                ? strings.lbl_add_project_fund
                : strings.lbl_edit_project_fund
            }
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
          {/* <View style={styles.profileContainerMain}>
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
          </View> */}
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          {showUI ? (
            <View style={[styles.topContainer]}>
              {randerDialog()}

              <ScrollView style={{marginHorizontal: 5}}>
                {/* <DropdownField
                isDisable={statusI != 1 && !isAdd}
                inputTitle={strings.lbl_from_company_hint}
                value={fromCompany}
                onClick={() => {
                  setCompanylist([]);
                  setHeaderTitle(strings.lbl_select_company);
                  requestGetCompany();
                }}
              /> */}

                <DropdownField
                  isDisable={statusI != 1 && !isAdd}
                  inputTitle={strings.lbl_project_hint}
                  value={project}
                  onClick={() => {
                    setProjectlist([]);
                    setHeaderTitle(strings.lbl_select_project);
                    requestGetProject();
                  }}
                />

                <DropdownField
                  isDisable={statusI != 1 && !isAdd}
                  inputTitle={strings.lbl_mode_hint}
                  value={mode}
                  onClick={() => {
                    setIsDropBoxVisible(true);
                  }}
                />
                {!isAdd && (
                  <DropdownField
                    isDisable
                    inputTitle={strings.lbl_select_status}
                    value={status}
                    onClick={() => {
                      setStatusList([]);
                      setHeaderTitle(strings.lbl_select_status);
                      requestGetProject();
                    }}
                  />
                )}
                <InputField
                  number
                  inputTitleVisible={true}
                  isEditable={statusI == 1}
                  isImage={false}
                  inputTitle={strings.lbl_r_amount_hint}
                  updateMasterState={value => setAmount(value)}
                  value={amount}
                  returnKey={constant.KEY_BTN_NEXT}
                />
                {!isAdd && (
                  <InputField
                    number
                    inputTitleVisible={true}
                    isEditable={false}
                    isImage={false}
                    inputTitle={strings.lbl_f_amount_hint + ' by Company'}
                    updateMasterState={value => setFinalAmount(value)}
                    value={finalAmount}
                    returnKey={constant.KEY_BTN_NEXT}
                  />
                )}
                <InputField
                  multiline
                  inputTitleVisible={true}
                  isEditable={statusI == 1}
                  isImage={false}
                  inputTitle={strings.lbl_purpose_hint}
                  updateMasterState={value => setPurpose(value)}
                  value={purpose}
                />
                {!isAdd && (
                  <InputField
                    multiline
                    inputTitleVisible={true}
                    isEditable={false}
                    isImage={false}
                    inputTitle={strings.lbl_remarks_hint + ' by Company'}
                    updateMasterState={value => setRemarks(value)}
                    value={remarks}
                  />
                )}

                {statusI == 1 && (
                  <ButtonBlue
                    btnColor={colors.btnColor}
                    btnText={isAdd ? strings.btn_request : strings.btn_update}
                    onClick={() => validation()}
                    isloading={isLoading}
                  />
                )}
                {!isAdd && statusI == 1 ? (
                  <ButtonBlue
                    btnColor={colors.redColor}
                    btnText={strings.btn_delete}
                    onClick={() => setIsDeleteDialogVisible(true)}
                    isloading={isLoadingDelete}
                  />
                ) : null}
              </ScrollView>
            </View>
          ) : (
            <Loader isVisible={true} /> // Optional: show a loading indicator during delay
          )}
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

export default AddProjectFund;
