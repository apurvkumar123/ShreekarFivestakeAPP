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
import FlottingButton from '../custom/Buttons/FlottingButton';
import CountryListRow from '../custom/customRow/CountryListRow';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import Loader from '../custom/Loader';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import BottomSheetAddRegistrationFees from '../custom/Dialogs/BottomSheetAddRegistrationFees';
import ButtonBlue from '../custom/Buttons/ButtonBlue';

const RegistrationFees = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isAdd, setIsAdd] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      requestGetRegistrationfees();
    }, []),
  );
  function loadListing(data) {
    return (
      <>
        {data != null && data.length != 0 ? (
          <FlatList
            style={{
              backgroundColor: 'white',
            }}
            data={data}
            renderItem={({item, index}) => (
              <CountryListRow
                value={constant.CURRENCY_SYMBOL + item.amount}
                isRightArrow={false}
                isEdit={true}
                isDelete={true}
                onClick={() => {
                  console.log('123123 ', item);
                }}
                onClickEdit={() => {
                  console.log('123123 ', item);
                  setIsAdd(false);
                  setSelectedItem(item);
                  setIsVisibleBottom(true);
                }}
                onClickDelete={() => {
                  setSelectedItem(item);
                  setIsDeleteDialogVisible(true);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={commonStyle.NoListTextStyleMedium}>
            {getStringMessage('lbl_no_records')}
          </Text>
        )}
      </>
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
          setAdminUserData(res.data.result);
          setIsScreenLoading(false);
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
        <DoubleButtonDialog
          submitbuttonText={getStringMessage('btn_yes_delete')}
          cancelbuttonText={getStringMessage('btn_cancel')}
          isVisible={isDeleteDialogVisible}
          message={getStringMessage('msg_delete').replace(
            '##',
            'Registration fee',
          )}
          title={getStringMessage('lbl_delete_title').replace(
            '##',
            'Registration fee',
          )}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);

            requestDelete();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
        />
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
        <Loader isVisible={isScreenLoading} />
      </View>
    );
  }
  async function requestDelete() {
    setIsScreenLoading(true);
    let formData = new FormData();
    formData.append('id', selectedItem.id);
    console.log('REQ_DeleteFee', formData);
    return Axios.requestData('POST', apiName.Deletefees, formData)
      .then(res => {
        setIsScreenLoading(false);
        if (res.status == 200) {
          console.log('RES_DeleteFee', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            requestGetRegistrationfees();
          }
        } else {
          showFlashMessage('Info', res.message, true);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        showFlashMessage('Info', getStringMessage('msg_something_wrong'), true);
        console.log('err', err);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={getStringMessage('lbl_manage_registration_fees')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />

        <View style={styles.bottomContainer}>
          {loadListing(adminUserData)}

          <View
            style={{
              position: 'absolute',
              bottom: 10,
              width: wp(90),
              alignSelf: 'center',
            }}>
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_add_new_reg_fee')}
              onClick={() => {
                setIsAdd(true);
                setIsVisibleBottom(true);
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegistrationFees;

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
    justifyContent: 'center',
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
