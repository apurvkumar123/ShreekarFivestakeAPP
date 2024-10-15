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

const MaterialName = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryI, setCategoryI] = useState(0);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [citylist, setCitylist] = useState([]);
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
                value={item.MaterialName}
                subValue={item.StatusText}
                email={item.CategoryName}
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
  }, [categoryI]);
  function onRefresh() {
    requestGetAdminData();
  }
  function moveToNext(item) {
    setCategoryI(0);
    setCategory('');
    navigation.navigate(stack.ADD_MATERIAL_NAME, {
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
    };

    console.log('REQ_getMaterialName', data);
    return Axios.requestData('POST', apiName.MaterialList, data)
      .then(res => {
        console.log('RES_getMaterialName', res.data.data);
        setIsScreenLoading(false);
        setRefreshing(false);
        if (res.data.status == true) {
          setAdminUserData(res.data.data.Materiallist);
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
        console.log('RES_getMaterialName_err', err);
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
      </View>
    );
  }
  async function requestGetCity() {
    setIsScreenLoading(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
      screenname: 'materialName',
    };
    console.log('REQ_GetMaterialCat');
    return Axios.requestData('POST', apiName.GetMaterialCat, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetMaterialCat', res.data.data);
          let LArray = [];
          LArray.unshift({label: 'All', value: 0});
          res.data.data.materialCategorylist.map(item => {
            var obj = {label: item.CategoryName, value: item.Id};
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
        console.log('RES_GetCity_err', err);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={strings.lbl_menu_materialName}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        <View style={{paddingHorizontal: wp(3)}}>
          <DropdownField
            isTitleShow={false}
            inputTitle={strings.lbl_select_category}
            value={category}
            onClick={() => {
              setCitylist([]);
              setHeaderTitle(strings.lbl_select_category);
              requestGetCity();
            }}
          />
        </View>
        {adminUserData != null ? (
          <Text style={styles.topTotalbLable}>
            {adminUserData.length + ' ' + strings.lbl_menu_materialName + '(s)'}
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

export default MaterialName;

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
