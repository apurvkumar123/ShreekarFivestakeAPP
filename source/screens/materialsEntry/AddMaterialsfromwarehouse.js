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
import ButtonBlue from '../../custom/Buttons/ButtonBlue';
import InputField from '../../custom/InputField';
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
import MultiListDialog from '../../custom/Dialogs/MultiListDialog';
import FlashMessage from 'react-native-flash-message';
import {SESSION_NAME, getPrefData} from '../../utility/session';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddMaterialsfromwarehouse = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [adminId, setAdminId] = useState('');
  const [fname, setFname] = useState('');
  const [gst, setGst] = useState('');

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');

  const [quantity, setQuantity] = useState('');

  const [location, setlocation] = useState('');
  const [locationI, setlocationI] = useState('');

  const [warehouse, setWarehouse] = useState('');
  const [warehouseI, setWarehouseI] = useState('');

  const [category, setcategory] = useState('');
  const [categoryI, setcategoryI] = useState('');

  const [materialName, setMaterialName] = useState('');
  const [materialNameI, setMaterialNameI] = useState('');

  const [siteIncharge, setSiteIncharge] = useState('');
  const [siteInchargeI, setSiteInchargeI] = useState('');

  const [createdBy, setCreatedBy] = useState('');

  const [type, setType] = useState(1);
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [commonlist, setCommonList] = useState([
    {label: strings.lbl_menu_warehouse, value: 1},
    {label: strings.lbl_menu_project, value: 0},
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
        importData();
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
    if (isAdd) {
      if (constant.ROLE_ID == 7) {
        setlocationI(1);
        setlocation(strings.lbl_option_warehouse);
      } else if (constant.ROLE_ID == 3) {
        setlocationI(0);
        setlocation(strings.lbl_option_project);
      }
    } else {
      var initItem = route.params.item;
      console.log('initItem:', initItem);
      setAdminId(initItem.Id);
      setlocation(initItem.request_type);
      setlocationI(
        initItem.request_type == strings.lbl_option_warehouse ? 1 : 0,
      );
      setWarehouse(initItem.Name);
      setWarehouseI(initItem.warehouse_or_project_Id);
      setcategory(initItem.CategoryName);
      setcategoryI(initItem.MaterialCategoryId);
      setMaterialName(initItem.MaterialName);
      setMaterialNameI(initItem.MaterialNameId);
      setQuantity('' + initItem.Quantity);
      setCreatedBy('' + initItem.CreatedBy);
    }
  }
  function validation() {
    if (location.trim().length == 0) {
      showFlashMessage('Required', strings.msg_location_select, true);
    } else if (warehouse.trim().length == 0) {
      showFlashMessage(
        'Required',
        strings.msg_Warehouse_project_select.replace('##', location),
        true,
      );
    } else if (category.trim().length == 0) {
      showFlashMessage('Required', strings.msg_enter_category, true);
    } else if (materialName.trim().length == 0) {
      showFlashMessage('Required', strings.msg_MaterialName_select, true);
    } else if (quantity.trim().length == 0) {
      showFlashMessage('Required', strings.lbl_qty_select, true);
    } else {
      setIsLoading(true);
      const UserData = isAdd
        ? {
            userId: '' + constant.USER_ID,
            clientId: constant.CLIENT_ID,
            companyId: constant.COMPANY_ID,
            languageId: constant.LANGUAGE_ID,
            materialCategoryId: categoryI,
            warehouse_or_project_Id: warehouseI,
            materialNameId: materialNameI,
            quantity: quantity,
            request_type: location.toLowerCase(),
            createdBy: constant.USER_ID,
          }
        : {
            Id: adminId,
            userId: '' + constant.USER_ID,
            clientId: constant.CLIENT_ID,
            companyId: constant.COMPANY_ID,
            languageId: constant.LANGUAGE_ID,
            materialCategoryId: categoryI,
            warehouse_or_project_Id: warehouseI,
            materialNameId: materialNameI,
            quantity: quantity,
            request_type: location.toLowerCase(),
            createdBy: constant.USER_ID,
          };
      requestAddAdminUser(UserData);
    }
  }
  async function requestAddAdminUser(data) {
    console.log('REQ_addMaterialEntry', data);
    return Axios.requestData(
      'POST',
      isAdd ? apiName.addMaterialEntry : apiName.editMaterialEntry,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_addMaterialEntry', res.data.data);
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

        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={strings.btn_close}
          isSearch={type == 2 ? true : false}
          isVisible={isDropBoxVisible}
          title={headerTitle}
          list={commonlist}
          onItemClick={item => {
            if (type == 0) {
              setlocation(item.label);
              setlocationI(item.value);
              setWarehouse('');
              setWarehouseI('');
            } else if (type == 1) {
              setWarehouse(item.label);
              setWarehouseI(item.value);
            } else if (type == 2) {
              setcategory(item.label);
              setcategoryI(item.value);
              setMaterialName('');
              setMaterialNameI('');
            } else {
              setMaterialName(item.label);
              setMaterialNameI(item.value);
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
      createdBy: constant.USER_ID,
      languageId: constant.LANGUAGE_ID,
    };
    console.log('REQ_deleteMaterialEntry', data);
    return Axios.requestData('POST', apiName.deleteMaterialEntry, data)
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
  async function requestGetProjectList() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getDropProjectList', data);
    return Axios.requestData('POST', apiName.getDropProjectList, data)
      .then(res => {
        console.log('RES_getDropProjectList', res.data);
        if (res.data.status == true) {
          let LArray = [];
          res.data.data.Proejectlist.map(item => {
            var obj = {label: item.ProjectName, value: item.Id};
            LArray.push(obj);
          });
          setCommonList(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setIsDropBoxVisible(true);
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
  async function requestGetWarehouse() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getAdminUser', data);
    return Axios.requestData('POST', apiName.getWarehouse, data)
      .then(res => {
        console.log('RES_WarehouseList', res.data);
        if (res.data.status == true) {
          let LArray = [];
          res.data.data.WareHouselist.map(item => {
            var obj = {label: item.WareHouseName, value: item.Id};
            LArray.push(obj);
          });
          setCommonList(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setIsDropBoxVisible(true);
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
  async function requestGetCategory() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
      screenname: 'materialentry',
    };
    console.log('REQ_getMaterialCat', data);
    return Axios.requestData('POST', apiName.getMaterialCat, data)
      .then(res => {
        if (res.data.status == true) {
          console.log('RES_getMaterialCat', res.data.data.materialCategorylist);
          let LArray = [];
          res.data.data.materialCategorylist.map(item => {
            var obj = {label: item.CategoryName, value: item.Id};
            LArray.push(obj);
          });
          setCommonList(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setIsDropBoxVisible(true);
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
  async function requestGetMaterialName() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
      materialCategoryId: categoryI == '' ? 0 : Number(categoryI),
    };
    console.log('REQ_getMaterialNameList', data);
    return Axios.requestData('POST', apiName.getMaterialNameList, data)
      .then(res => {
        console.log('RES_getMaterialNameList', res.data);
        if (res.data.status == true) {
          console.log(
            'RES_getMaterialNameList',
            res.data.data.materialCategorylist,
          );
          let LArray = [];
          res.data.data.materialCategorylist.map(item => {
            var obj = {label: item.MaterialName, value: item.Id};
            LArray.push(obj);
          });
          setCommonList(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setIsDropBoxVisible(true);
          }, 300);
        } else {
          showFlashMessage('Info', res.data.errorMessage, true);
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getAdminUser_err', err);
      });
  }
  console.log('>>', createdBy, constant.USER_ID);

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
                ? strings.btn_Add_project_material
                : strings.btn_Update_project_material
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
              {isAdd ? (
                <DropdownField
                  inputTitle={strings.lbl_select_location_header}
                  value={location}
                  isDisable={
                    constant.ROLE_ID == 7 || constant.ROLE_ID == 3
                      ? true
                      : false
                  }
                  onClick={() => {
                    setCommonList([
                      {label: strings.lbl_option_warehouse, value: 1},
                      {label: strings.lbl_option_project, value: 0},
                    ]);
                    setHeaderTitle(strings.lbl_select_location_header);
                    setIsDropBoxVisible(true);
                    setType(0); //select location
                  }}
                />
              ) : (
                <DropdownField
                  inputTitle={strings.lbl_select_location_header}
                  value={location}
                  isDisable={
                    constant.ROLE_ID != 7 ||
                    constant.ROLE_ID != 3 ||
                    createdBy == constant.USER_ID ||
                    constant.ROLE_ID == 1
                      ? false
                      : true
                  }
                  onClick={() => {
                    setCommonList([
                      {label: strings.lbl_option_warehouse, value: 1},
                      {label: strings.lbl_option_project, value: 0},
                    ]);
                    setHeaderTitle(strings.lbl_select_location_header);
                    setIsDropBoxVisible(true);
                    setType(0); //select location
                  }}
                />
              )}
              {locationI == '1 ' && (
                <DropdownField
                  inputTitle={strings.lbl_menu_warehouse}
                  value={warehouse}
                  isDisable={
                    isAdd ||
                    createdBy == constant.USER_ID ||
                    constant.ROLE_ID == 1
                      ? false
                      : true
                  }
                  onClick={() => {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_Warehouse_header);
                    requestGetWarehouse();
                    setType(1); //Warehouse
                  }}
                />
              )}
              {locationI == '0' && (
                <DropdownField
                  inputTitle={strings.lbl_menu_project}
                  value={warehouse}
                  isDisable={
                    isAdd ||
                    createdBy == constant.USER_ID ||
                    constant.ROLE_ID == 1
                      ? false
                      : true
                  }
                  onClick={() => {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_menu_project);
                    requestGetProjectList();
                    setType(1); //Project
                  }}
                />
              )}
              <DropdownField
                inputTitle={strings.lbl_category_hint}
                value={category}
                isDisable={
                  isAdd ||
                  createdBy == constant.USER_ID ||
                  constant.ROLE_ID == 1
                    ? false
                    : true
                }
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_select_category);
                  requestGetCategory();
                  setType(2); //category
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_name_size_hint}
                value={materialName}
                isDisable={
                  isAdd ||
                  createdBy == constant.USER_ID ||
                  constant.ROLE_ID == 1
                    ? false
                    : true
                }
                onClick={() => {
                  setCommonList([]);
                  setHeaderTitle(strings.lbl_MaterialName_header);
                  requestGetMaterialName();
                  setType(3); //Material Name
                }}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={
                  isAdd ||
                  createdBy == constant.USER_ID ||
                  constant.ROLE_ID == 1
                    ? true
                    : false
                }
                phone
                isImage={false}
                inputTitle={strings.lbl_quentity_hint}
                updateMasterState={value => setQuantity(value)}
                value={quantity}
              />
              {isAdd && (
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={strings.btn_save}
                  onClick={() => validation()}
                  isloading={isLoading}
                />
              )}

              {!isAdd && createdBy == constant.USER_ID ? (
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={strings.btn_update}
                  onClick={() => validation()}
                  isloading={isLoading}
                />
              ) : null}

              {!isAdd && createdBy == constant.USER_ID ? (
                <ButtonBlue
                  btnColor={colors.redColor}
                  btnText={strings.btn_delete}
                  onClick={() => setIsDeleteDialogVisible(true)}
                  isloading={isLoadingDelete}
                />
              ) : null}
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

export default AddMaterialsfromwarehouse;
