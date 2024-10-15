import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import React, {useState} from 'react';
import {stack} from '../constants/commonStrings';
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import TabBar from '../custom/TabBar';
import Home from '../screens/Home';
import Payments from '../screens/Payments';
import Profile from '../screens/Profile';
import Reports from '../screens/Reports';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import commonStyle from '../styles/commonStyle';
import strings from '../utility/screenStrings';
import {colors, font, fontSizes} from '../utility/theme';
import {widthPercentageToDP} from '../utility/ResponsiveScreen';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import constant from '../constants/constant';
import {apiName} from '../network/serverConfig';
import Axios from '../network/Axios';
import CountryListRow from '../custom/customRow/CountryListRow';
import Loader from '../custom/Loader';
import {showFlashMessage} from '../utility/Utility';
const Dashboard = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (constant.ROLE_ID == 1) {
      } else if (constant.ROLE_ID == 3) {
        requestGetProject();
        requestGetBalance();
      } else {
        requestGetWarehouse();
      }
    }, []),
  );
  async function requestGetWarehouse() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
    };

    console.log('REQ_WarehouseList', data);
    return Axios.requestData('POST', apiName.WarehouseList, data)
      .then(res => {
        console.log('RES_WarehouseList', res.data.data.WareHouselist);
        setIsScreenLoading(false);
        if (res.data.status == true) {
          setAdminUserData(res.data.data.WareHouselist);
          setIsScreenLoading(false);
        } else {
          setAdminUserData([]);
          setIsScreenLoading(false);
          showFlashMessage('Info', res.data.errorMessage, true);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        setAdminUserData([]);
        console.log('RES_getAdminUser_err', err);
      });
  }
  async function requestGetProject() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      projectId: 0,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getProjectList', data);
    return Axios.requestData('POST', apiName.getProjectList, data)
      .then(res => {
        console.log('RES_getProjectList', res.data.data);

        if (res.data.status == true) {
          setAdminUserData(res.data.data.Projectlist);
          setIsScreenLoading(false);
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
  async function requestGetBalance() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
      projectId: 0,
    };
    console.log('REQ_DashboardBalance', data);
    return Axios.requestData('POST', apiName.DashboardBalance, data)
      .then(res => {
        console.log('RES_DashboardBalance', JSON.stringify(res.data));
        setExpenseData(res.data.data.ExpenseList);
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getAdminUser_err', err);
      });
  }
  function loadProjectListing(data) {
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
                date={item.StartDate + ' - ' + item.EndDate}
                value={item.ProjectName}
                subValue={
                  item.isActive
                    ? strings.lbl_active_status
                    : strings.lbl_inactive_status
                }
                email={
                  'Company: ' +
                  item.CompanyName +
                  '\nAddress: ' +
                  item.Address +
                  '\nRemark: ' +
                  item.Remarks
                }
                isEmail={true}
                isRightArrow={false}
                isbtnVisible={false}
                teamButtonAction={() => {}}
                onClick={() => {}}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={commonStyle.NoListTextStyleMedium}>
            {strings.lbl_no_records}
          </Text>
        )}
      </>
    );
  }
  function loadWarehouseListing(data) {
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
                value={item.WareHouseName}
                subValue={item.StatusText}
                email={'City: ' + item.CityName}
                isEmail={true}
                isRightArrow={false}
                onClick={() => {
                  console.log('123123 ', item);
                  // moveToNext(item);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={commonStyle.NoListTextStyleMedium}>
            {strings.lbl_no_records}
          </Text>
        )}
      </>
    );
  }
  function workInProgress() {
    return (
      <>
        <Text style={commonStyle.NoListTextStyleMedium}>
          {strings.msg_workIn_Progress}
        </Text>
      </>
    );
  }
  function balanceUI() {
    return (
      <>
        <Text style={[commonStyle.NoListTextStyleMedium]}>
          {'Balance Information'}
        </Text>
        {expenseData != null && expenseData.length > 0 ? (
          <View style={{backgroundColor: colors.whiteColor, padding: wp(3)}}>
            <Text style={commonStyle.subLable}>
              {'Total Income: ' + expenseData[0].totalIncome}
            </Text>
            <Text style={commonStyle.subLable}>
              {'Total Expense: ' + expenseData[0].totalExpense}
            </Text>
            <Text style={commonStyle.subLable}>
              {'Current Balance: ' + expenseData[0].currentBalance}
            </Text>
          </View>
        ) : null}
      </>
    );
  }
  return (
    // <View style={styles.bottomContainer}>
    //   <Text style={commonStyle.NoListTextStyleMedium}>
    //     {constant.ROLE_ID == 1
    //       ? strings.Role_Master_Admin
    //       : constant.ROLE_ID == 3
    //       ? strings.Role_Site_Incharge
    //       : strings.Role_Warehouse_person}
    //   </Text>
    //   <Text style={commonStyle.NoListTextStyleMedium}>
    //     {strings.msg_workIn_Progress}
    //   </Text>
    // </View>
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      <Loader isVisible={isScreenLoading} />
      <View style={styles.safeAreaBaseViewContainer}>
        <Text style={commonStyle.NoListTextStyleMedium}>
          {'User Information'}
        </Text>

        <View style={{backgroundColor: colors.whiteColor, padding: wp(3)}}>
          <Text style={commonStyle.subLable}>
            {'User Name: ' + constant.userData.UserName}
          </Text>
          <Text style={commonStyle.subLable}>
            {'Mobile: ' + constant.userData.MobileNumber}
          </Text>

          <Text style={commonStyle.subLable}>
            {constant.ROLE_ID == 1
              ? 'Role: ' + strings.Role_Master_Admin
              : constant.ROLE_ID == 3
              ? 'Role: ' + strings.Role_Site_Incharge
              : constant.ROLE_ID == 6
              ? 'Role: ' + strings.Role_Account_Persion
              : 'Role: ' + strings.Role_Warehouse_person}
          </Text>
        </View>
        {constant.ROLE_ID === 3 && balanceUI()}

        {constant.ROLE_ID != 2 && constant.ROLE_ID != 6 && (
          <Text style={[commonStyle.NoListTextStyleMedium]}>
            {constant.ROLE_ID == 1
              ? ''
              : constant.ROLE_ID == 3
              ? ' Assigned Projects'
              : ' Assigned Warehoused'}
          </Text>
        )}

        {constant.ROLE_ID != 6 && (
          <View style={[styles.bottomContainer]}>
            {constant.ROLE_ID == 1
              ? workInProgress()
              : constant.ROLE_ID == 3
              ? loadProjectListing(adminUserData)
              : loadWarehouseListing(adminUserData)}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
  tabIcon: {
    height: hp(10.5),
    width: wp(8),
    resizeMode: 'contain',
    position: 'absolute',
    right: wp(3),
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  subLable: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
  },
});
