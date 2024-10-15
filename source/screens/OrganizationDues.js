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
import {stack} from '../constants/commonStrings';
import Loader from '../custom/Loader';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import BottomSheetAddOrganizationDue from '../custom/Dialogs/BottomSheetAddOrganizationDue';
import ButtonBlue from '../custom/Buttons/ButtonBlue';

const OrganizationDues = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isAdd, setIsAdd] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      requestGetOrganizationDue();
    }, []),
  );
  function loadListing(data) {
    console.log('data', data);
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
                value={
                  constant.CURRENCY_SYMBOL + item.amount + ' - ' + item.title
                }
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

  function moveToNext(item) {
    navigation.navigate(stack.ADD_MEMBER_USER, {
      isAdd: item == '' ? true : false,
      item: item,
    });
  }
  async function requestGetOrganizationDue() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('REQ_getOrgDues', data);
    return Axios.requestData('POST', apiName.getOrgDues, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getOrgDues', res.data.result);
          setAdminUserData(res.data.result);
          setIsScreenLoading(false);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getOrgDues_err', err);
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
            'Organization Due',
          )}
          title={getStringMessage('lbl_delete_title').replace(
            '##',
            'Organization Due',
          )}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);
            setIsScreenLoading(true);
            requestDelete();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
        />
        <BottomSheetAddOrganizationDue
          onDialogCloseClick={isSuccess => {
            setIsVisibleBottom(false);
            if (isSuccess) {
              requestGetOrganizationDue();
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
    let formData = new FormData();
    formData.append('id', selectedItem.id);
    console.log('REQ_Deletedues', formData);
    return Axios.requestData('POST', apiName.Deletedues, formData)
      .then(res => {
        setIsScreenLoading(false);
        if (res.status == 200) {
          console.log('RES_Deletedues', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            requestGetOrganizationDue();
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
          route={getStringMessage('lbl_manage_organization_dues')}
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
              btnText={getStringMessage('btn_add_new_sub_fees')}
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

export default OrganizationDues;

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
