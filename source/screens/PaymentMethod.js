import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

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
import BottomSheetAddPaymentMode from '../custom/Dialogs/BottomSheetAddPaymentMode';

const PaymentMethod = () => {
  const navigation = useNavigation();
  const [isAdd, setIsAdd] = useState();
  const [isPayEmail, setIsPayEmail] = useState();
  const [selectedItem, setSelectedItem] = useState();
  // const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);
  const [isVisibleBottomS, setIsVisibleBottomS] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [orgDetails, setOrgDetails] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      getPrefs();
    }, []),
  );

  function getPrefs() {
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

  function loadListing(from, data) {
    console.log('loadListing:', data);
    return (
      // <View style={commonStyle.box}>
      //   <Text style={commonStyle.titleTextStyleMedium}>
      //     {from == 1
      //       ? getStringMessage('lbl_zelle_payment_email')
      //       : getStringMessage('lbl_zelle_payment_mobile')}
      //   </Text>
      <CountryListRow
        value={
          from == 1
            ? getStringMessage('lbl_zelle_payment_email')
            : getStringMessage('lbl_zelle_payment_mobile')
        }
        subValue={from == 1 ? data.zelle_email : data.zelle_number}
        isRightArrow={true}
        isEdit={false}
        isDelete={false}
        onClick={() => {
          setIsPayEmail(from == 1 ? true : false);
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
          setPrefData(
            SESSION_NAME.REGISTER_FEE_OBJ,
            res.data.result[0],
            (resType, response) => {
              setRegisterFeeData(res.data.result);
              setIsScreenLoading(false);
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
        <BottomSheetAddPaymentMode
          from={isPayEmail}
          onDialogCloseClick={isSuccess => {
            setIsVisibleBottom(false);
            if (isSuccess) {
              requestGetRegistrationfees();
            }
          }}
          isVisible={isVisibleBottom}
          item={isAdd ? '' : selectedItem}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={getStringMessage('lbl_manage_payment_methods')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />

        <View style={styles.bottomContainer}>
          {orgDetails.zelle_email == '' ? (
            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
              }}>
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_add_zelle_pay_email')}
                onClick={() => {
                  setIsPayEmail(true);
                  setIsAdd(true);
                  setIsVisibleBottom(true);
                }}
              />
            </View>
          ) : (
            loadListing(1, orgDetails)
          )}
          {orgDetails.zelle_number == '' ? (
            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
              }}>
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_add_zelle_pay_mobile')}
                onClick={() => {
                  setIsPayEmail(false);
                  setIsAdd(true);
                  setIsVisibleBottom(true);
                }}
              />
            </View>
          ) : (
            loadListing(2, orgDetails)
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethod;

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
});
