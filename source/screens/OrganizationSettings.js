import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Header from '../custom/Header';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../utility/theme';

import constant from '../constants/constant';
import CountryListRow from '../custom/customRow/CountryListRow';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import Loader from '../custom/Loader';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import BottomSheetAddRegistrationFees from '../custom/Dialogs/BottomSheetAddRegistrationFees';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import BottomSheetAddOrganizationDue from '../custom/Dialogs/BottomSheetAddOrganizationDue';
import {SESSION_NAME, getPrefData, setPrefData} from '../utility/session';
import BottomSheetAddBal from '../custom/Dialogs/BottomSheetAddBal';
import InputField from '../custom/InputField';

const OrganizationSettings = () => {
  const navigation = useNavigation();
  const [registerFeeData, setRegisterFeeData] = useState([]);
  const [orgBalanceData, setorgBalanceData] = useState([]);
  const [subscriptionFeeData, setSubscriptionFeeData] = useState([]);
  const [isAdd, setIsAdd] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);
  const [isVisibleBottomS, setIsVisibleBottomS] = useState(false);
  const [isVisibleBottomB, setIsVisibleBottomB] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [orgDetails, setOrgDetails] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      requestGetRegistrationfees();
      requestGetOrganizationDue();
      importData();
      requestGetBalanceList();
    }, []),
  );

  useEffect(() => {
    if (!isVisibleBottomB) {
      importData();
      requestGetBalanceList();
    }
  }, [isVisibleBottomB]);

  function importData() {
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response: ', response);
        if (response.userdetails) {
          setUserDetails(response.userdetails);
        }
        if (response.organization) {
          setOrgDetails(response.organization);
        }
      }
    });
  }
  async function requestGetOrganizationDue() {
    var data = {org_id: constant.orgID};
    console.log('REQ_getOrgDues', data);
    return Axios.requestData('POST', apiName.getOrgDues, data)
      .then(res => {
        if (res.status == 200) {
          setIsScreenLoading(false);
          console.log('RES_getOrgDues', res.data.result);
          if (res.data.result.length > 0)
            setPrefData(
              SESSION_NAME.SUBSCRIPTION_FEE_OBJ,
              res.data.result[0],
              (resType, response) => {
                setSubscriptionFeeData(res.data.result);
              },
            );
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getOrgDues_err', err);
      });
  }
  function loadListingSubscription(data) {
    console.log('loadListingSubscription:', data);
    return (
      <CountryListRow
        value={getStringMessage('lbl_manage_organization_dues')}
        subValue={constant.CURRENCY_SYMBOL + data.amount + ' - ' + data.title}
        isRightArrow={true}
        isEdit={false}
        isDelete={false}
        onClick={() => {
          console.log('123123 ', data);
          setIsAdd(false);
          setSelectedItem(data);
          setIsVisibleBottomS(true);
        }}
      />
      // </View>
    );
  }
  function loadBalence(title, val) {
    return (
      <CountryListRow
        value={title}
        subValue={constant.CURRENCY_SYMBOL + val}
        isRightArrow={false}
        isEdit={false}
        isDelete={false}
        onClick={() => {}}
        isComment={true}
        comment={orgDetails.comment}
      />
      // </View>
    );
  }

  function balanceListing() {
    return (
      <FlatList
        style={styles.balanceList}
        data={orgBalanceData}
        renderItem={item => renderItem(item)}
      />
    );
  }

  function renderItem({item}) {
    return (
      <View style={styles.renderItem}>
        <View style={styles.listUpperContainer}>
          <Text style={[styles.listLbl, {flex: 1}]}>{item.account_name}</Text>
          <Text style={styles.listLbl}>
            {constant.CURRENCY_SYMBOL + item.amount}.00
          </Text>
        </View>
        <Text style={styles.lblDisc}>{item.account_description}</Text>
      </View>
    );
  }

  async function requestGetBalanceList() {
    var data = {org_id: constant.orgID};
    console.log('REQ_getBalList', data);
    return Axios.requestData('POST', apiName.allorgaccount, data)
      .then(res => {
        if (res.status == 200) {
          setIsScreenLoading(false);
          console.log('RES_getBalList', res.data.result);

          if (res.data.result.length > 0) setorgBalanceData(res.data.result);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getOrgDues_err', err);
      });
  }

  function loadListing(data) {
    console.log('loadListing:', data);
    return (
      // <View style={commonStyle.box}>
      //   <Text style={commonStyle.titleTextStyleMedium}>
      //     {getStringMessage('lbl_manage_registration_fees')}
      //   </Text>
      <CountryListRow
        value={getStringMessage('lbl_manage_registration_fees')}
        subValue={constant.CURRENCY_SYMBOL + data.amount}
        isRightArrow={true}
        isEdit={false}
        isDelete={false}
        onClick={() => {
          // console.log('123123 ', data);
          console.log('123123 ', data);
          setIsAdd(false);
          setSelectedItem(data);
          setIsVisibleBottom(true);
        }}
        onClickEdit={() => {
          console.log('123123 ', data);
          setIsAdd(false);
          setSelectedItem(data);
          setIsVisibleBottom(true);
        }}
      />
      // </View>
    );
  }
  async function requestGetRegistrationfees() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('REQ_getRegistrationfees', data);
    return Axios.requestData('POST', apiName.getRegistrationfees, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getRegistrationfees', res.data.result);
          setIsScreenLoading(false);
          if (res.data.result.length > 0)
            setPrefData(
              SESSION_NAME.REGISTER_FEE_OBJ,
              res.data.result[0],
              (resType, response) => {
                setRegisterFeeData(res.data.result);
              },
            );
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getRegistrationfees_err', err);
      });
  }

  function randerDialog() {
    return (
      <View>
        <BottomSheetAddRegistrationFees
          onDialogCloseClick={isSuccess => {
            setIsVisibleBottom(false);
            if (isSuccess) {
              requestGetRegistrationfees();
            }
          }}
          isVisible={isVisibleBottom}
          item={isAdd ? '' : selectedItem}
        />
        <BottomSheetAddOrganizationDue
          onDialogCloseClick={isSuccess => {
            setIsVisibleBottomS(false);
            if (isSuccess) {
              requestGetOrganizationDue();
            }
          }}
          isVisible={isVisibleBottomS}
          item={isAdd ? '' : selectedItem}
        />
        <BottomSheetAddBal
          onDialogCloseClick={isSuccess => {
            setIsVisibleBottomB(false);
            if (isSuccess) {
              importData();
            }
          }}
          isVisible={isVisibleBottomB}
          // item={isAdd ? '' : selectedItem}
        />
        <Loader isVisible={isScreenLoading} />
      </View>
    );
  }

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={getStringMessage('lbl_org_setting')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />

        <View style={styles.bottomContainer}>
          {registerFeeData.length == 0 ? (
            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
              }}>
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_add_reg_fee')}
                onClick={() => {
                  setIsAdd(true);
                  setIsVisibleBottom(true);
                }}
              />
            </View>
          ) : (
            loadListing(registerFeeData[0])
          )}
          {subscriptionFeeData.length == 0 ? (
            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
              }}>
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_add_sub_fees')}
                onClick={() => {
                  setIsAdd(true);
                  setIsVisibleBottomS(true);
                }}
              />
            </View>
          ) : (
            loadListingSubscription(subscriptionFeeData[0])
          )}
          {/* {orgDetails != '' && parseInt(orgDetails.balance) == 0 ? (
            //      {true ? (
            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
              }}>

              {loadBalence(getStringMessage('lbl_org_bal'), orgDetails.balance)}

              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_add_org_bal')}
                onClick={() => {
                  setIsVisibleBottomB(true);
                }}
              />
            </View>
          ) : (
            loadBalence(getStringMessage('lbl_org_bal'), orgDetails.balance)
          )} */}
          <View
            style={{
              width: wp(90),
              alignSelf: 'center',
              flex: 1,
            }}>
            {loadBalence(getStringMessage('lbl_org_bal'), orgDetails.balance)}

            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_add_org_bal')}
              onClick={() => {
                setIsVisibleBottomB(true);
              }}
            />

            {balanceListing()}
          </View>
          {/* <Text style={{marginTop:hp(1),color : colors.redColor,fontSize : fontSizes.pt_10}}>{getStringMessage('lbl_balance_cant_change')}</Text> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrganizationSettings;

const styles = StyleSheet.create({
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    // justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
  topTotalbLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    width: wp(95),
    marginBottom: hp(1),
    textAlign: 'right',
  },
  renderItem: {
    borderColor: colors.textInputBorderColor,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 8,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 0.8,
  },
  balanceList: {
    marginTop: 15,
    marginBottom: 5,
  },
  listLbl: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  lblDisc: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
  },
  listUpperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: colors.textInputBorderColor,
    borderBottomWidth: 1,
  },
});
