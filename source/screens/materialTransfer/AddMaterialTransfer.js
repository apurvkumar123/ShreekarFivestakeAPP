import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {dateFormat, stack} from '../../constants/commonStrings';
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
import MultiListDialog from '../../custom/Dialogs/MultiListDialog';
import FlashMessage from 'react-native-flash-message';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddMaterialTransfer = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState(route.params.isAdd);

  const [adminId, setAdminId] = useState('');

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');

  const [quantity, setQuantity] = useState('');
  const [deliveredQuantity, setDeliveredQuantity] = useState('');

  const [locationFrom, setlocationFrom] = useState('');
  const [locationIFrom, setlocationIFrom] = useState('');

  const [locationTo, setlocationTo] = useState('');
  const [locationITo, setlocationITo] = useState('');

  const [warehouseFrom, setWarehouseFrom] = useState('');
  const [warehouseIFrom, setWarehouseIFrom] = useState('');

  const [warehouseTo, setWarehouseTo] = useState('');
  const [warehouseITo, setWarehouseITo] = useState('');

  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');

  const [category, setcategory] = useState('');
  const [categoryI, setcategoryI] = useState('');

  const [materialName, setMaterialName] = useState('');
  const [materialNameI, setMaterialNameI] = useState('');
  const [materialPreqty, setMaterialPreqty] = useState('');

  const [status, setStatus] = useState('');
  const [statusI, setStatusI] = useState('');
  const [availablestatusI, setAvailablestatusI] = useState('');
  const [statusData, setStatusData] = useState('');
  const [isDropShow, setIsDropShow] = useState(false);
  const [type, setType] = useState(1);

  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commonlist, setCommonList] = useState([
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
        getRole();
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
  function getRole() {
    if (constant.ROLE_ID == 7) {
      setlocationITo(1);
      setlocationTo(strings.lbl_option_warehouse);
    } else if (constant.ROLE_ID == 3) {
      setlocationITo(0);
      setlocationTo(strings.lbl_option_project);
    }
  }
  function importData() {
    var item = route.params.item;
    console.log('item:', item);
    setAdminId(item.Id);
    setlocationFrom(item.from_request_type);
    setWarehouseFrom(item.from_name);
    setlocationTo(item.to_request_type);
    setWarehouseTo(item.to_name);
    setcategory(item.CategoryName);
    setMaterialName(item.MaterialName);
    setQuantity('' + item.Quantity);
    setRemarks(item.RequestRemarks);
    setAvailablestatusI(item.RequestStatus);
    if (!route.params.isAdd) {
      requestGetStatus(item);
    }
  }
  function validation() {
    if (isAdd) {
      if (locationFrom.trim().length == 0) {
        showFlashMessage('Required', strings.msg_location_from_select, true);
      } else if (warehouseFrom.trim().length == 0) {
        showFlashMessage(
          'Required',
          strings.msg_Warehouse_project_from_select.replace('##', locationFrom),
          true,
        );
      } else if (locationTo.trim().length == 0) {
        showFlashMessage('Required', strings.msg_location_to_select, true);
      } else if (warehouseTo.trim().length == 0) {
        showFlashMessage('Required', strings.msg_Warehouse_to_select, true);
      } else if (category.trim().length == 0) {
        showFlashMessage('Required', strings.msg_enter_category, true);
      } else if (materialName.trim().length == 0) {
        showFlashMessage('Required', strings.msg_MaterialName_select, true);
      } else if (quantity.trim().length == 0) {
        showFlashMessage('Required', strings.lbl_qty_select, true);
      } else if (quantity <= 0) {
        showFlashMessage('Required', strings.lbl_qty_valid_select, true);
      } else if (quantity > materialPreqty) {
        showFlashMessage('Required', strings.lbl_qty_valid_select, true);
      } else if (remarks.trim().length == 0) {
        showFlashMessage('Required', strings.msg_enter_remarks, true);
      } else {
        setIsLoading(true);
        const UserData = {
          userId: '' + constant.USER_ID,
          clientId: constant.CLIENT_ID,
          companyId: constant.COMPANY_ID,
          languageId: constant.LANGUAGE_ID,
          from_request_type: locationFrom.toLowerCase(),
          transferFromId: warehouseIFrom,
          to_request_type: locationTo.toLowerCase(),
          transferToId: warehouseITo,
          materialCategoryId: categoryI,
          materialNameId: materialNameI,
          quantity: quantity,
          requestRemarks: remarks,
          approveRemarks: '',
          createdBy: constant.USER_ID,
        };
        requestAddAdminUser(UserData);
      }
    } else {
      if (status.trim().length == 0) {
        showFlashMessage('Required', strings.msg_enter_status, true);
      } else if (statusI == 4 && deliveredQuantity.trim().length == 0) {
        showFlashMessage('Required', strings.lbl_delivered_qty_select, true);
      } else if (statusI == 4 && deliveredQuantity > quantity) {
        showFlashMessage(
          'Required',
          strings.lbl_delivered_qty_valid_select,
          true,
        );
      } else if (otherRemarks.trim().length == 0) {
        showFlashMessage('Required', strings.msg_enter_remarks, true);
      } else {
        setIsDeleteDialogVisible(true);
      }
    }
  }
  function updateStatusAPI() {
    setIsLoading(true);
    const UserData = {
      id: adminId,
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      approveRemarks: otherRemarks,
      requestStatus: statusI,
      requestStatusText: status,
      deliveredQuantity: deliveredQuantity == '' ? 0 : deliveredQuantity,
      createdBy: constant.USER_ID,
    };
    requestAddAdminUser(UserData);
  }
  async function requestAddAdminUser(data) {
    console.log(
      isAdd
        ? 'REQ_addMaterialTransferEntry'
        : 'REQ_updateMaterialTransferEntry',
      data,
    );
    return Axios.requestData(
      'POST',
      isAdd
        ? apiName.addMaterialTransferEntry
        : apiName.UpdateMaterialTransferStatus,
      data,
    )
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_addMaterialTransferEntry', res.data.data);
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
  async function requestGetStatus(item) {
    const UserData = {
      userId: '' + constant.USER_ID,
      roleId: constant.ROLE_ID,
      clientId: constant.CLIENT_ID,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      createdBy: constant.USER_ID,
      id: item.Id,
    };
    console.log('REQ_getTransferStatusButton', UserData);
    return Axios.requestData('POST', apiName.getTransferStatusButton, UserData)
      .then(res => {
        setIsLoading(false);
        if (res.data.status == true) {
          console.log('RES_getTransferStatusButton', res.data.data);
          var res = res.data.data;
          var isDropShow =
            res.isApproved ||
            res.isDelivered ||
            res.isRejected ||
            res.isCancelled;

          setIsDropShow(isDropShow);
          setStatusData(res);
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
  function displayQtyMsg(givenQty) {
    return givenQty > 0 ? (
      <Text style={styles.tvEmailBottom}>
        {strings.lbl_not_more_then.replace('##', givenQty)}
      </Text>
    ) : (
      <Text style={styles.tvEmailBottom}>{strings.lbl_qty_not_available}</Text>
    );
  }
  function randerDialog() {
    return (
      <>
        <Loader isVisible={isScreenLoading} />
        <DoubleButtonDialog
          submitbuttonText={strings.btn_yes}
          cancelbuttonText={strings.btn_cancel}
          isVisible={isDeleteDialogVisible}
          message={strings.msg_change_status}
          title={strings.lbl_change_Status}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);
            updateStatusAPI();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
        />

        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          isSearch={type == 4 ? true : false}
          buttonText={strings.btn_close}
          isVisible={isDropBoxVisible}
          title={headerTitle}
          list={
            type == 6 ? commonlist.filter(item => item.isVisible) : commonlist
          }
          onItemClick={item => {
            console.log('type', type);
            if (type == 0) {
              setlocationFrom(item.label);
              setlocationIFrom(item.value);
              setWarehouseFrom('');
              setWarehouseIFrom('');
            } else if (type == 2) {
              setlocationTo(item.label);
              setlocationITo(item.value);
              setWarehouseTo('');
              setWarehouseITo('');
            } else if (type == 1) {
              setWarehouseFrom(item.label);
              setWarehouseIFrom(item.value);
            } else if (type == 3) {
              setWarehouseTo(item.label);
              setWarehouseITo(item.value);
            } else if (type == 4) {
              setcategory(item.label);
              setcategoryI(item.value);
              setMaterialName('');
              setMaterialNameI('');
              setMaterialPreqty('');
            } else if (type == 5) {
              setMaterialName(item.label);
              setMaterialNameI(item.value);
              setMaterialPreqty(item.qty);
            } else {
              console.log('item.value', item.value);
              setStatus(item.label);
              setStatusI(item.value);
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
  async function requestGetProjectList(isFrom) {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
      screenname: isFrom ? constant.FROM_PROJECT : constant.TO_PROJECT,
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
      companyId: constant.COMPANY_ID,
      request_type: locationFrom.toLowerCase(),
      warehouse_or_project_Id: warehouseIFrom,
    };
    console.log('REQ_getTransferCategory', data);
    return Axios.requestData('POST', apiName.getTransferCategory, data)
      .then(res => {
        if (res.data.status == true) {
          console.log(
            'RES_getTransferCategory',
            res.data.data.materialCategorylist,
          );
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
      companyId: constant.COMPANY_ID,
      request_type: locationFrom.toLowerCase(),
      warehouse_or_project_Id: warehouseIFrom,
    };
    console.log('REQ_getTransferMaterialNameList', data);
    return Axios.requestData('POST', apiName.getTransferMaterialNameList, data)
      .then(res => {
        console.log('RES_getTransferMaterialNameList', res.data);
        if (res.data.status == true) {
          console.log(
            'RES_getTransferMaterialNameList',
            res.data.data.materialCategorylist,
          );
          let LArray = [];
          res.data.data.materialCategorylist.map(item => {
            var obj = {
              label: item.MaterialName,
              qty: locationIFrom == 0 ? item.projectQty : item.warehouseQty,
              value: item.Id,
            };
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
        console.log('RES_getTransferMaterialNameList_err', err);
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
                ? strings.btn_Add_trnasfer_project_material
                : route.params.item.CreatedDate
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
                inputTitle={strings.lbl_select_location_from_header}
                value={locationFrom}
                isDisable={!isAdd}
                onClick={() => {
                  setCommonList([
                    {label: strings.lbl_option_warehouse, value: 1},
                    {label: strings.lbl_option_project, value: 0},
                  ]);
                  setHeaderTitle(strings.lbl_select_location_header);
                  setIsDropBoxVisible(true);
                  setType(0); //select location from
                }}
              />
              {locationFrom == strings.lbl_option_warehouse && (
                <DropdownField
                  inputTitle={strings.lbl_transfer_from_warehouse}
                  value={warehouseFrom}
                  isDisable={!isAdd}
                  onClick={() => {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_transfer_from_warehouse);
                    requestGetWarehouse();
                    setType(1); //Warehouse
                  }}
                />
              )}
              {locationFrom == strings.lbl_option_project && (
                <DropdownField
                  inputTitle={strings.lbl_transfer_from_project}
                  value={warehouseFrom}
                  isDisable={!isAdd}
                  onClick={() => {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_transfer_from_project);
                    requestGetProjectList(true);
                    setType(1); //Project
                  }}
                />
              )}
              {constant.ROLE_ID == 7 || constant.ROLE_ID == 3 ? null : (
                <DropdownField
                  inputTitle={strings.lbl_select_location_to_header}
                  value={locationTo}
                  isDisable={!isAdd ? true : false}
                  // isDisable={!isAdd }
                  onClick={() => {
                    setCommonList([
                      {label: strings.lbl_option_warehouse, value: 1},
                      {label: strings.lbl_option_project, value: 0},
                    ]);
                    setHeaderTitle(strings.lbl_select_location_header);
                    setIsDropBoxVisible(true);
                    setType(2); //select location To
                  }}
                />
              )}
              {locationTo == strings.lbl_option_warehouse && (
                <DropdownField
                  inputTitle={strings.lbl_transfer_to_warehouse}
                  value={warehouseTo}
                  isDisable={!isAdd}
                  onClick={() => {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_transfer_to_warehouse);
                    requestGetWarehouse();
                    setType(3); //Warehouse
                  }}
                />
              )}
              {locationTo == strings.lbl_option_project && (
                <DropdownField
                  inputTitle={strings.lbl_transfer_to_project}
                  value={warehouseTo}
                  isDisable={!isAdd}
                  onClick={() => {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_transfer_to_project);
                    requestGetProjectList(false);
                    setType(3); //Project
                  }}
                />
              )}
              <DropdownField
                inputTitle={strings.lbl_category_hint}
                value={category}
                isDisable={!isAdd}
                onClick={() => {
                  if (warehouseFrom.trim().length == 0) {
                    showFlashMessage(
                      'Required',
                      strings.msg_Warehouse_from_select,
                      true,
                    );
                  } else {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_select_category);
                    requestGetCategory();
                    setType(4); //category
                  }
                }}
              />
              <DropdownField
                inputTitle={strings.lbl_name_size_hint}
                value={materialName}
                isDisable={!isAdd}
                onClick={() => {
                  if (category.trim().length == 0) {
                    showFlashMessage(
                      'Required',
                      strings.msg_enter_category,
                      true,
                    );
                  } else {
                    setCommonList([]);
                    setHeaderTitle(strings.lbl_MaterialName_header);
                    requestGetMaterialName();
                    setType(5); //Material Name
                  }
                }}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={isAdd && materialPreqty > 0}
                phone
                isImage={false}
                inputTitle={strings.lbl_quentity_hint}
                updateMasterState={value => setQuantity(value)}
                value={quantity}
              />
              {isAdd && materialPreqty != ''
                ? displayQtyMsg(materialPreqty)
                : null}

              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={isAdd}
                isImage={false}
                inputTitle={strings.lbl_remarks_hint}
                updateMasterState={value => setRemarks(value)}
                value={remarks}
              />

              {!isAdd && isDropShow ? (
                <DropdownField
                  inputTitle={strings.lbl_select_status}
                  value={status}
                  onClick={() => {
                    setCommonList([
                      {
                        label: strings.lbl_option_approved,
                        value: 2,
                        isVisible: statusData.isApproved,
                      },
                      {
                        label: strings.lbl_option_rejected,
                        value: 3,
                        isVisible: statusData.isRejected,
                      },
                      {
                        label: strings.lbl_option_Delivered,
                        value: 4,
                        isVisible: statusData.isDelivered,
                      },
                      {
                        label: strings.lbl_option_Canceled,
                        value: 5,
                        isVisible: statusData.isCancelled,
                      },
                    ]);
                    setHeaderTitle(strings.lbl_select_status);
                    setIsDropBoxVisible(true);
                    setType(6); //select Status
                  }}
                />
              ) : null}

              {!isAdd && statusI == 4 ? (
                <InputField
                  inputTitleVisible={true}
                  isEditable={!isAdd && quantity > 0}
                  phone
                  isImage={false}
                  inputTitle={strings.lbl_delivered_quentity_hint}
                  updateMasterState={value => setDeliveredQuantity(value)}
                  value={deliveredQuantity}
                />
              ) : null}
              {!isAdd && statusI == 4 ? displayQtyMsg(quantity) : null}

              {!isAdd && isDropShow && statusI != '' ? (
                <InputField
                  multiline
                  inputTitleVisible={true}
                  isEditable={!isAdd}
                  isImage={false}
                  inputTitle={
                    statusI == 4
                      ? strings.lbl_del_remarks_hint
                      : statusI == 5
                      ? strings.lbl_cancelled_remarks_hint
                      : strings.lbl_Other_remarks_hint
                  }
                  updateMasterState={value => setOtherRemarks(value)}
                  value={otherRemarks}
                />
              ) : null}
              {isAdd && (
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={strings.btn_save}
                  onClick={() => validation()}
                  isloading={isLoading}
                />
              )}
              {!isAdd && isDropShow ? (
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={strings.btn_update_status}
                  onClick={() => validation()}
                  isloading={isLoading}
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
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.facebookBlueColor,
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

export default AddMaterialTransfer;
