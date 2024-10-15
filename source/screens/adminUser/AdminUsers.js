import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
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
import {stack} from '../../constants/commonStrings';
import Loader from '../../custom/Loader';
import strings from '../../utility/screenStrings';
import DropdownField from '../../custom/DropdownField';
import ListDialog from '../../custom/Dialogs/ListDialog';
import {showFlashMessage} from '../../utility/Utility';

const AdminUsers = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [companylist, setCompanylist] = useState([]);
  const [company, setCompany] = useState('');
  const [companyI, setCompanyI] = useState(0);

  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
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
                value={item.UserName}
                subValue={
                  item.isActive
                    ? strings.lbl_active_status
                    : strings.lbl_inactive_status
                }
                email={
                  'Email: ' +
                  item.Email +
                  '\nMobile: ' +
                  item.MobileNumber +
                  '\nRole: ' +
                  item.RoleName +
                  '\nProjects: ' +
                  item.AssingedProjects
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
  useEffect(() => {
    requestGetAdminData();
  }, [companyI]);
  function onRefresh() {
    requestGetAdminData();
  }

  function moveToNext(item) {
    setCompanyI(0);
    setCompany('');
    navigation.navigate(stack.ADD_ADMIN_USER, {
      isAdd: item == '' ? true : false,
      item: item,
    });
  }

  async function requestGetAdminData() {
    setIsScreenLoading(true);
    setRefreshing(true);
    var data = {
      userId: '' + constant.USER_ID,
      companyId: companyI,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getAdminUser', data);
    return Axios.requestData('POST', apiName.AdminUserList, data)
      .then(res => {
        console.log('RES_getAdminUser', res.data.data);

        if (res.data.status == true) {
          setAdminUserData(res.data.data.userLogin);
          setIsScreenLoading(false);
          setRefreshing(false);
        } else {
          setIsScreenLoading(false);
          setRefreshing(false);
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        setRefreshing(false);
        console.log('RES_getAdminUser_err', err);
      });
  }
  function randerDialog() {
    return (
      <View>
        <Loader isVisible={isScreenLoading} />
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
            setCompany(item.label);
            setCompanyI(item.value);
            setDisplayListDialog(false);
          }}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={strings.lbl_menu_user}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        {/* <View style={{paddingHorizontal: wp(3)}}>
          <DropdownField
            isTitleShow={false}
            inputTitle={strings.lbl_select_company}
            value={company}
            onClick={() => {
              setCompanylist([]);
              setHeaderTitle(strings.lbl_select_company);
              requestGetComapanyData();
            }}
          />
        </View> */}
        <Text style={styles.topTotalbLable}>
          {adminUserData.length + ' ' + strings.lbl_menu_user}
        </Text>
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

export default AdminUsers;

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
