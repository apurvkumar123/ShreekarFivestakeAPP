import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import Header from '../../custom/Header';
import commonStyle from '../../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';

import constant from '../../constants/constant';
import FlottingButton from '../../custom/Buttons/FlottingButton';
import CountryListRow from '../../custom/customRow/CountryListRow';
import Axios from '../../network/Axios';
import {apiName} from '../../network/serverConfig';
import {getStringMessage, showFlashMessage} from '../../utility/Utility';
import {stack} from '../../constants/commonStrings';
import Loader from '../../custom/Loader';
import strings from '../../utility/screenStrings';

const LabourList = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
                value={item.LabourName}
                subValue={item.StatusText}
                email={
                  'Mobile: ' +
                  item.MobileNumber +
                  '\nCity: ' +
                  item.CityName +
                  '\nNo of Person: ' +
                  item.NoOfPerson +
                  '\nAadharNo: ' +
                  item.AadharNo
                }
                isEmail={true}
                isRightArrow={false}
                onClick={() => {
                  console.log('123123 ', item);
                  moveToNext(item);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <Text style={commonStyle.NoListTextStyleMedium}>
            {strings.lbl_no_records}
          </Text>
        )}
      </>
    );
  }
  useFocusEffect(
    React.useCallback(() => {
      requestGetAdminData();
    }, []),
  );
  function onRefresh() {
    requestGetAdminData();
  }
  function moveToNext(item) {
    navigation.navigate(stack.ADD_LABOUR, {
      isAdd: item == '' ? true : false,
      item: item,
    });
  }
  async function requestGetAdminData() {
    setIsScreenLoading(true);
    setRefreshing(true);
    console.log('ccc', constant.USER_ID, constant.CLIENT_ID);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };

    console.log('REQ_getgetLabourList', data);
    return Axios.requestData('POST', apiName.getLabourList, data)
      .then(res => {
        console.log('RES_getgetLabourList', res.data.data);
        setIsScreenLoading(false);
        setRefreshing(false);
        if (res.data.status == true) {
          setAdminUserData(res.data.data.labourlist);
          setIsScreenLoading(false);
          setRefreshing(false);
        } else {
          setAdminUserData([]);
          setIsScreenLoading(false);
          setRefreshing(false);
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        setRefreshing(false);
        setAdminUserData([]);
        console.log('RES_getgetLabourList_err', err);
      });
  }
  function randerDialog() {
    return (
      <View>
        <Loader isVisible={isScreenLoading} />
      </View>
    );
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={strings.lbl_menu_labour}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        {adminUserData != null ? (
          <Text style={styles.topTotalbLable}>
            {adminUserData.length + ' ' + strings.lbl_menu_labour + '(s)'}
          </Text>
        ) : null}

        <View style={styles.bottomContainer}>
          {loadListing(adminUserData)}
          <FlottingButton
            isTabView={false}
            btnColor={colors.btnColor}
            onClick={() => moveToNext('')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LabourList;

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
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    width: wp(95),
    marginVertical: hp(1),
    textAlign: 'right',
  },
});
