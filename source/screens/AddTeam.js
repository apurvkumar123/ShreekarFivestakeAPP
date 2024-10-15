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
import strings from '../utility/screenStrings';
import Loader from '../custom/Loader';
import MultiListDialog from '../custom/Dialogs/MultiListDialog';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddTeam = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [adminId, setAdminId] = useState('');
  const [fname, setFname] = useState('');
  const [gst, setGst] = useState('');

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');

  const [projectId, setProjectId] = useState(route.params.id);
  const [companyId, setCompanyId] = useState(route.params.CompanyId);

  const [siteIncharge, setSiteIncharge] = useState('');
  const [siteInchargeI, setSiteInchargeI] = useState('');

  const [manager, setManager] = useState(''); //developer
  const [managerI, setManagerI] = useState('');

  const [superwisors, setSuperwisors] = useState('');
  const [superwisorsI, setSuperwisorsI] = useState('');

  const [engineers, setEngineers] = useState('');
  const [engineersI, setEngineersI] = useState('');

  const [driverHelper, setDriverHelper] = useState('');
  const [driverHelperI, setDriverHelperI] = useState('');
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);

  const [labour, setLabour] = useState('');
  const [labourI, setLabourI] = useState('');
  const [type, setType] = useState(1);
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [commonlist, setCommonList] = useState([]);

  const [siteInchargelist, setsiteInchargelist] = useState([]);
  const [managerlist, setmanagerlist] = useState([]); //developer
  const [superwisorslist, setsuperwisorslist] = useState([]);
  const [engineerslist, setengineerslist] = useState([]);
  const [driverHelperlist, setdriverHelperlist] = useState([]); //Account person

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
        requestGetSelectedTeam();
      }, 1000);
    }, []),
  );

  async function requestGetSelectedTeam() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      projectId: projectId,
      companyId: companyId,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getProjectAllTeamUser', data);
    return Axios.requestData('POST', apiName.getProjectAllTeamUser, data)
      .then(res => {
        console.log('RES_getProjectAllTeamUser', res.data.data);

        if (res.data.status == true) {
          let AArray = [];
          res.data.data.SiteInchargelist.map(item => {
            if (item.selected == 1) {
              setSiteIncharge(item.UserName);
              setSiteInchargeI(item.Id);
            }
            var obj = {label: item.UserName, value: item.Id};
            AArray.push(obj);
          });
          setsiteInchargelist(AArray);
          let BArray = [];
          res.data.data.Developerlist.map(item => {
            if (item.selected == 1) {
              setManager(item.UserName);
              setManagerI(item.Id);
            }
            var obj = {label: item.UserName, value: item.Id};
            BArray.push(obj);
          });
          setmanagerlist(BArray);

          let CArray = [];
          res.data.data.Supervisorlist.map(item => {
            var obj = {
              label: item.UserName,
              value: item.Id,
              isSelected: item.selected == 1 ? true : false,
            };
            CArray.push(obj);
          });
          setsuperwisorslist(CArray);

          var matchingSupervisorNames = res.data.data.Supervisorlist.filter(
            item => item.selected == 1,
          )
            .map(item => item.UserName)
            .join(',');
          var matchingSupervisorID = res.data.data.Supervisorlist.filter(
            item => item.selected == 1,
          )
            .map(item => item.Id)
            .join(',');
          setSuperwisors(matchingSupervisorNames);
          setSuperwisorsI(matchingSupervisorID);
          let DArray = [];
          res.data.data.Engineerlist.map(item => {
            var obj = {
              label: item.UserName,
              value: item.Id,
              isSelected: item.selected == 1 ? true : false,
            };
            DArray.push(obj);
          });
          setengineerslist(DArray);

          var matchingEngineerNames = res.data.data.Engineerlist.filter(
            item => item.selected == 1,
          )
            .map(item => item.UserName)
            .join(',');
          var matchingEngineerID = res.data.data.Engineerlist.filter(
            item => item.selected == 1,
          )
            .map(item => item.Id)
            .join(',');
          setEngineers(matchingEngineerNames);
          setEngineersI(matchingEngineerID);
          let EArray = [];
          res.data.data.AccountPersonlist.map(item => {
            var obj = {
              label: item.UserName,
              value: item.Id,
              isSelected: item.selected == 1 ? true : false,
            };
            EArray.push(obj);
          });
          setdriverHelperlist(EArray);
          setIsScreenLoading(false);

          var matchingDriverHelperNames =
            res.data.data.AccountPersonlist.filter(item => item.selected == 1)
              .map(item => item.UserName)
              .join(',');
          var matchingDriverHelperID = res.data.data.AccountPersonlist.filter(
            item => item.selected == 1,
          )
            .map(item => item.Id)
            .join(',');
          setDriverHelper(matchingDriverHelperNames);
          setDriverHelperI(matchingDriverHelperID);
        } else {
          setIsScreenLoading(false);
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getAdminUser_err', err);
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
    console.log('item:', item);
    setAdminId(item.Id);
    setFname(item.CompanyName);
    setGst(item.GST);
  }
  function validation() {
    if (siteIncharge.trim().length == 0) {
      showFlashMessage('Required', strings.msg_select_siteIncharge, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            projectId: projectId,
            clientId: constant.CLIENT_ID,
            companyId: companyId,
            languageId: constant.LANGUAGE_ID,
            createdBy: constant.USER_ID,
            superAdminIds: '',
            developerIds: '' + managerI,
            siteInchargeIds: '' + siteInchargeI,
            superwisorIds: '' + superwisorsI,
            engineersIds: '' + engineersI,
            accountPersonIds: '' + driverHelperI,
            warehousePersonIds: '',
          }
        : {
            id: adminId,
            projectId: projectId,
            clientId: constant.CLIENT_ID,
            companyId: companyId,
            languageId: constant.LANGUAGE_ID,
            createdBy: constant.USER_ID,
            superAdminIds: '',
            developerIds: '' + managerI,
            siteInchargeIds: '' + siteInchargeI,
            superwisorIds: '' + superwisorsI,
            engineersIds: '' + engineersI,
            accountPersonIds: '' + driverHelperI,
            warehousePersonIds: '',
          };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_AddProjectTeam', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.AddProjectTeam : apiName.EditCompany,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_AddProjectTeam', res.data);
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
        <Loader isVisible={isScreenLoading} />
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
        <MultiListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={true}
          buttonText={strings.btn_close}
          isVisible={isDisplayListdialog}
          title={headerTitle}
          list={
            type == 3
              ? superwisorslist
              : type == 4
              ? engineerslist
              : driverHelperlist
          }
          onItemClick={array => {
            console.log('items--', array);
            if (type == 3) {
              setSuperwisors(array.map(item => item.label).join(','));
              setSuperwisorsI(array.map(item => item.value).join(','));
            } else if (type == 4) {
              setEngineers(array.map(item => item.label).join(','));
              setEngineersI(array.map(item => item.value).join(','));
            } else if (type == 5) {
              setDriverHelper(array.map(item => item.label).join(','));
              setDriverHelperI(array.map(item => item.value).join(','));
            } else {
              setLabour(array.map(item => item.label).join(','));
              setLabourI(array.map(item => item.value).join(','));
            }
            setDisplayListDialog(false);
          }}
        />

        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={strings.btn_close}
          isVisible={isDropBoxVisible}
          title={headerTitle}
          list={type == 1 ? siteInchargelist : managerlist}
          onItemClick={item => {
            if (type == 1) {
              setSiteIncharge(item.label);
              setSiteInchargeI(item.value);
            } else if (type == 2) {
              setManager(item.label);
              setManagerI(item.value);
            }
            setIsDropBoxVisible(false);
          }}
        />
      </>
    );
  }
  async function requestDelete() {
    const data = {
      id: adminId,
    };
    console.log('REQ_DeleteCompany', data);
    return Axios.requestData('POST', apiName.DeleteCompany, data)
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
  async function requestGetUser(from) {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      projectId: projectId,
      companyId: companyId,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getAdminUser', data);
    return Axios.requestData('POST', apiName.getProjectAllTeamUser, data)
      .then(res => {
        console.log('RES_getAdminUser', res.data.data);

        if (res.data.status == true) {
          let LArray = [];
          if (from == 1) {
            res.data.data.SiteInchargelist.map(item => {
              var obj = {label: item.UserName, value: item.Id};
              LArray.push(obj);
            });
          } else if (from == 2) {
            res.data.data.Developerlist.map(item => {
              var obj = {label: item.UserName, value: item.Id};
              LArray.push(obj);
            });
          } else if (from == 3) {
            res.data.data.Supervisorlist.map(item => {
              var obj = {
                label: item.UserName,
                value: item.Id,
                isSelected: superwisorsI.split(',').includes(String(item.Id)),
              };
              LArray.push(obj);
            });
          } else if (from == 4) {
            res.data.data.Engineerlist.map(item => {
              var obj = {
                label: item.UserName,
                value: item.Id,
                isSelected: engineersI.split(',').includes(String(item.Id)),
              };
              LArray.push(obj);
            });
          } else if (from == 5) {
            res.data.data.AccountPersonlist.map(item => {
              var obj = {
                label: item.UserName,
                value: item.Id,
                isSelected: driverHelperI.split(',').includes(String(item.Id)),
              };
              LArray.push(obj);
            });
          }

          setCommonList(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            if (from == 1 || from == 2) {
              setIsDropBoxVisible(true);
            } else {
              setDisplayListDialog(true);
            }
          }, 300);
        } else {
          setIsScreenLoading(false);
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getAdminUser_err', err);
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
            route={isAdd ? strings.btn_add_team : strings.btn_add_team}
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
                inputTitle={strings.lbl_site_incharge_hint}
                value={siteIncharge}
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_site_incharge_hint);
                  setIsDropBoxVisible(true);
                  setType(1); //Site Incharge
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_manager_hint}
                value={manager}
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_manager_hint);
                  setIsDropBoxVisible(true);
                  setType(2); //manager
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_Superwisors_hint}
                value={superwisors}
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_Superwisors_hint);
                  setDisplayListDialog(true);
                  setType(3); //superwisors
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_Engineers_hint}
                value={engineers}
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_Engineers_hint);
                  setDisplayListDialog(true);
                  setType(4); //engineers
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_driver_hint}
                value={driverHelper}
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_driver_hint);
                  setDisplayListDialog(true);
                  setType(5); //driverHelper
                }}
              />
              {/* <DropdownField
                inputTitle={strings.lbl_Labour_hint}
                value={labour}
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_Labour_hint);
                  requestGetUser(6);
                  setType(6); //labour
                }}
              /> */}
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={isAdd ? strings.btn_save : strings.btn_save}
                onClick={() => validation()}
                isloading={isLoading}
              />
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

export default AddTeam;
