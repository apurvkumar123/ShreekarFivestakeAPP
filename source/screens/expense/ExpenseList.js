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
import {getStringMessage, showFlashMessage} from '../../utility/Utility';
import {stack} from '../../constants/commonStrings';
import Loader from '../../custom/Loader';
import strings from '../../utility/screenStrings';
import ListDialog from '../../custom/Dialogs/ListDialog';
import DropdownField from '../../custom/DropdownField';
import ExpenseRow from '../../custom/customRow/ExpenseRow';

const ExpenseList = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryI, setCategoryI] = useState(0);

  const [project, setproject] = useState('');
  const [projectI, setprojectI] = useState(0);

  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [citylist, setCitylist] = useState([]);
  const [commonlist, setCommonList] = useState([]);
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
              <ExpenseRow
                item={item}
                onClick={() => {
                  constant.ROLE_ID != 1 &&
                    constant.ROLE_ID != 6 &&
                    moveToNext(item);
                }}
                onClickView={() => {
                  console.log('view ', item);
                }}
                onClickChange={() => {
                  console.log('change ', item);
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
  }, [categoryI, projectI]);
  function onRefresh() {
    requestGetAdminData();
  }
  function moveToNext(item) {
    setCategoryI(0);
    setCategory('');
    navigation.navigate(stack.ADD_EXPENSE, {
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
      materialCategoryId: categoryI,
      projectId: projectI,
      search: '',
    };

    console.log('REQ_getExpenseList>>', data);
    return Axios.requestData('POST', apiName.ExpenseList, data)
      .then(res => {
        console.log('RES_getExpenseList', res.data.data);
        setIsScreenLoading(false);
        setRefreshing(false);
        if (res.data.status == true) {
          setAdminUserData(res.data.data.ExpenseList);
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
        console.log('RES_geExpenseList_err', err);
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
          list={citylist}
          onItemClick={item => {
            console.log('item--', item);
            setCategory(item.label);
            setCategoryI(item.value);
            setDisplayListDialog(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={strings.btn_close}
          isSearch={true}
          isVisible={isDropBoxVisible}
          title={headerTitle}
          list={commonlist}
          onItemClick={item => {
            setproject(item.label);
            setprojectI(item.value);

            setIsDropBoxVisible(false);
          }}
        />
      </View>
    );
  }
  async function requestGetProjectList() {
    setIsScreenLoading(true);
    var data = {
      userId: '0',
      companyId: constant.COMPANY_ID,
      languageId: constant.LANGUAGE_ID,
      clientId: constant.CLIENT_ID,
    };
    console.log('REQ_getDropProjectList', data);
    return Axios.requestData('POST', apiName.getDropProjectList, data)
      .then(res => {
        console.log(
          'RES_getDropProjectList',
          JSON.stringify(res.data.data.Proejectlist),
        );
        if (res.data.status == true) {
          let LArray = [];
          LArray.unshift({label: 'All', value: 0});
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
  async function requestGetCity() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
      screenname: 'ExpenseList',
    };
    console.log('REQ_getExpenseCategoryList');
    return Axios.requestData('POST', apiName.getExpenseCategoryList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getExpenseCategoryList', res.data.data);
          let LArray = [];
          LArray.unshift({label: 'All', value: 0});
          res.data.data.tExpenseCategorylist.map(item => {
            var obj = {label: item.ExpenseName, value: item.Id};
            LArray.push(obj);
          });
          setCitylist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayListDialog(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getExpenseCategoryList_err', err);
      });
  }
  const calculateRequestedAmounts = () =>
    adminUserData.reduce((total, record) => {
      return total + record.Amount;
    }, 0);
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={strings.lbl_menu_Expense}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        <View style={{paddingHorizontal: wp(3)}}>
          <DropdownField
            isTitleShow={false}
            inputTitle={strings.lbl_select_expense_category}
            value={category}
            onClick={() => {
              setCitylist([]);
              setHeaderTitle(strings.lbl_select_expense_category);
              requestGetCity();
            }}
          />
          {constant.ROLE_ID == 1 || constant.ROLE_ID == 6 ? (
            <DropdownField
              isTitleShow={false}
              inputTitle={strings.lbl_select_project}
              value={project}
              isDisable={false}
              onClick={() => {
                setCommonList([]);
                setHeaderTitle(strings.lbl_select_project);
                requestGetProjectList();
              }}
            />
          ) : null}
        </View>
        {adminUserData != null ? (
          <View style={styles.topTotalbLableContainer}>
            <Text style={styles.topTotalbLable}>
              {adminUserData.length + ' ' + strings.lbl_menu_Expense + '(s)'}
            </Text>
            <Text style={styles.topTotalbLable}>
              {'Total Expense: ₹' + calculateRequestedAmounts()}
            </Text>
          </View>
        ) : null}

        <View style={styles.bottomContainer}>
          {loadListing(adminUserData)}
          {constant.ROLE_ID != 1 && (
            <FlottingButton
              isTabView={false}
              btnColor={colors.btnColor}
              onClick={() => moveToNext('')}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExpenseList;

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
  topTotalbLableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    marginVertical: hp(1),
  },
  topTotalbLable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
  },
});
