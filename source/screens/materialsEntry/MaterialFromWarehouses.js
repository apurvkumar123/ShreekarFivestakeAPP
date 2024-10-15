import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
import DoubleButtonDialog from '../../custom/Dialogs/DoubleButtonDialog';
import InputField from '../../custom/InputField';
import {imagePath} from '../../utility/imagePath';

const MaterialFromWarehouses = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearched, setisSearched] = useState(false);
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
                value={item.CategoryName + ' (' + item.MaterialName + ')'}
                subValue={'Qty: ' + item.Quantity}
                email={item.request_type + ': ' + item.Name}
                isEmail={true}
                isRightArrow={false}
                isDelete={true}
                onClick={() => {
                  console.log('123123 ', item);
                  // navigation.navigate(stack.MATERIAL_SUB_LIST, {
                  //   item: item,
                  // });
                  moveToNext(item);
                }}
                onClickDelete={() => {}}
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
      requestGetAdminData(searchText);
    }, []),
  );
  function onRefresh() {
    requestGetAdminData(searchText);
  }
  function moveToNext(item) {
    navigation.navigate(stack.ADD_MATERIAL_FROM_WAREHOUSE, {
      isAdd: item == '' ? true : false,
      item: item,
    });
  }
  async function requestGetAdminData(search) {
    setIsScreenLoading(true);
    setRefreshing(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
      companyId: constant.COMPANY_ID,
      searchText: search,
    };

    console.log('REQ_MaterialFromwarehouse', data);
    return Axios.requestData('POST', apiName.MaterialFromwarehouse, data)
      .then(res => {
        console.log(
          'RES_MaterialFromwarehouse',
          res.data.data.Warehouse_Materiallist,
        );
        setIsScreenLoading(false);
        setRefreshing(false);
        if (res.data.status == true) {
          setAdminUserData(res.data.data.Warehouse_Materiallist);
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
        console.log('RES_MaterialFromwarehouse_err', err);
      });
  }

  function randerDialog() {
    return (
      <View>
        <DoubleButtonDialog
          submitbuttonText={strings.btn_yes_delete}
          cancelbuttonText={strings.btn_cancel}
          isVisible={isDeleteDialogVisible}
          message={strings.msg_delete}
          title={strings.btn_delete}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);
            setIsScreenLoading(true);
            // requestDelete();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
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
          route={strings.lbl_menu_Material_entry}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        <View style={{paddingHorizontal: wp(2), flexDirection: 'row'}}>
          <InputField
            search
            inputTitleVisible={false}
            isEditable={true}
            isImage={true}
            inputTitle={strings.lbl_search_hint}
            updateMasterState={value => setSearchText(value)}
            value={searchText}
          />
          {searchText.trim().length != 0 && (
            <TouchableOpacity
              onPress={() => {
                if (isSearched) {
                  setSearchText('');
                  requestGetAdminData('');
                  setisSearched(false);
                } else {
                  requestGetAdminData(searchText);
                  setisSearched(true);
                }
              }}>
              <Image
                style={styles.tabIcon}
                source={
                  isSearched ? imagePath.ic_Close : imagePath.ic_Searchbtn
                }
              />
            </TouchableOpacity>
          )}
        </View>
        {adminUserData != null ? (
          <Text style={styles.topTotalbLable}>
            {adminUserData.length +
              ' ' +
              strings.lbl_menu_MaterialList_From_WareHouse}
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

export default MaterialFromWarehouses;

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
  tabIcon: {
    height: hp(10.5),
    width: wp(8),
    resizeMode: 'contain',
    position: 'absolute',
    right: wp(3),
  },
});
