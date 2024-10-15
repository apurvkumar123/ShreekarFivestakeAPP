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
import {getStringMessage} from '../utility/Utility';
import {stack} from '../constants/commonStrings';
import Loader from '../custom/Loader';
import {SESSION_NAME, getPrefData} from '../utility/session';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import {showFlashMessage} from '../utility/Utility';
const TouchableOpacity = withPreventDoubleClick();

const MemberUsers = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [regFees, setRegFees] = useState('');
  const [orgDues, setOrgDues] = useState('');
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
                value={item.firstname + ' ' + item.lastname}
                subValue={
                  item.status == 1
                    ? getStringMessage('lbl_active_status')
                    : getStringMessage('lbl_inactive_status')
                }
                isRightArrow={false}
                onClick={() => {
                  console.log('123123 ', item);
                  moveToNext(item);
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
  useFocusEffect(
    React.useCallback(() => {
      requestGetAdminData();
      getPrefs();
    }, []),
  );
  function getPrefs() {
    getPrefData(SESSION_NAME.REGISTER_FEE_OBJ, (resType, item) => {
      if (item != null) {
        console.log('response fee: ', item);
        setRegFees(item.amount);
      }
    });
    getPrefData(SESSION_NAME.SUBSCRIPTION_FEE_OBJ, (resType, item) => {
      if (item != null) {
        console.log('response sub: ', item);
        // setOrgDuesObj(item);
        setOrgDues(item.amount);
      }
    });
  }
  function moveToNext(item) {
    if (regFees == '' || orgDues == '') {
      showFlashMessage(
        'Required!',
        getStringMessage('lbl_please_fill_org_settings'),
        true,
      );
    } else {
      navigation.navigate(stack.ADD_MEMBER_USER, {
        isAdd: item == '' ? true : false,
        item: item,
      });
    }
  }
  async function requestGetAdminData() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID, type: constant.ALL_MEMBER};
    console.log('REQ_getMemberUser', data);
    return Axios.requestData('POST', apiName.getMemberUserList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getMemberUser', res.data.result);
          setAdminUserData(res.data.result);
          setIsScreenLoading(false);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getMemberUser_err', err);
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
          route={getStringMessage('lbl_members_title')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        <Text style={styles.topTotalbLable}>
          {adminUserData.length + ' ' + getStringMessage('lbl_users')}
        </Text>
        {regFees == '' || orgDues == '' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate({name: stack.ORG_SETTINGS});
            }}>
            <Text style={styles.topWarningLable}>
              {getStringMessage('msg_warning_addfees')}
            </Text>
          </TouchableOpacity>
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

export default MemberUsers;

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
  topWarningLable: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_16,
    color: colors.redColor,
    width: wp(95),
    padding: hp(1),
    textAlign: 'center',
    opacity: 80,
  },
});
