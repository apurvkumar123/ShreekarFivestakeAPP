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
import MaterialTransferRow from '../../custom/customRow/MaterialTransferRow';
import ProjectFundRow from '../../custom/customRow/ProjectFundRow';
import DropdownField from '../../custom/DropdownField';
import ListDialog from '../../custom/Dialogs/ListDialog';
import {useEffect} from 'react';

const ProjectFundList = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearched, setisSearched] = useState(false);

  const [headerTitle, setHeaderTitle] = useState('');
  const [project, setproject] = useState('');
  const [projectI, setprojectI] = useState(0);
  const [commonlist, setCommonList] = useState([]);
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);

  function loadListing(data) {
    return (
      <>
        {data != null && data.length != 0 ? (
          <FlatList
            style={{
              backgroundColor: 'white',
            }}
            data={data}
            renderItem={({item, index}) => {
              const paymentMode =
                item.PaymentMode === 'Credit'
                  ? strings.lbl_credit_mode
                  : item.PaymentMode === 'Debit'
                  ? strings.lbl_debit_mode
                  : item.PaymentMode; // Fallback to original if not matched

              return (
                <ProjectFundRow
                  item={{...item, PaymentMode: paymentMode}}
                  onClick={() => {
                    console.log('123123 ', item);
                    // item.RequestStatus === 1 &&
                    moveToNext(item);
                  }}
                  onClickView={() => {
                    console.log('view ', item);
                  }}
                  onClickChange={() => {
                    console.log('change ', item);
                  }}
                />
              );
            }}
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
  useEffect(() => {
    console.log('PPP>>', projectI);

    requestGetAdminData(searchText);
  }, [projectI]);

  useFocusEffect(
    React.useCallback(() => {
      requestGetAdminData(searchText);
    }, []),
  );
  function onRefresh() {
    requestGetAdminData(searchText);
  }

  function moveToNext(item) {
    if (item == '') {
      navigation.navigate(
        constant.USER_ID == constant.DINESHBHAI_ID && constant.ROLE_ID == 1
          ? stack.ADD_PROJECT_FUND_DINESH
          : constant.USER_ID == constant.KISHANBHAI_ID && constant.ROLE_ID == 1
          ? stack.ADD_PROJECT_FUND_KISHAN
          : constant.ROLE_ID == 1
          ? stack.ADD_PROJECT_SUPER_ADMIN
          : constant.ROLE_ID == 6
          ? stack.ADD_PROJECT_FUND_ACCOUNT
          : stack.ADD_PROJECT_FUND,
        {
          isAdd: true,
        },
      );
    } else {
      navigation.navigate(
        constant.USER_ID == constant.DINESHBHAI_ID && constant.ROLE_ID == 1
          ? stack.ADD_PROJECT_FUND_DINESH
          : constant.USER_ID == constant.KISHANBHAI_ID && constant.ROLE_ID == 1
          ? stack.ADD_PROJECT_FUND_KISHAN
          : constant.ROLE_ID == 1
          ? stack.ADD_PROJECT_SUPER_ADMIN
          : constant.ROLE_ID == 6
          ? stack.ADD_PROJECT_FUND_ACCOUNT
          : stack.ADD_PROJECT_FUND,
        {
          isAdd: false,
          item: item,
        },
      );
    }
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
  async function requestGetAdminData(search) {
    setIsScreenLoading(true);
    setRefreshing(true);
    var data = {
      userId: '' + constant.USER_ID,
      clientId: constant.CLIENT_ID,
      languageId: constant.LANGUAGE_ID,
      roleId: constant.ROLE_ID,
      searchText: search,
      projectId: projectI,
    };

    console.log('REQ_ProjectFundList', data);

    const apiEndpoint =
      constant.USER_ID === constant.DINESHBHAI_ID && constant.ROLE_ID === 1
        ? apiName.getProjectFundDineshBhai
        : constant.USER_ID === constant.KISHANBHAI_ID && constant.ROLE_ID === 1
        ? apiName.getProjectFundKisanBhai
        : constant.ROLE_ID === 1
        ? apiName.getProjectFundKisanBhai
        : constant.ROLE_ID === 6
        ? apiName.getProjectFundAccountPerson
        : apiName.getProjectFund;

    return Axios.requestData('POST', apiEndpoint, data)
      .then(res => {
        console.log(
          'RES_ProjectFundList',
          JSON.stringify(res.data.data.ProjectFundList),
        );
        setIsScreenLoading(false);

        setRefreshing(false);

        if (res.data.status == true) {
          setAdminUserData(res.data.data.ProjectFundList);
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
        console.log('RES_ProjectFundList_err', err);
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
            console.log('DDD>>', item.value);

            setproject(item.label);
            setprojectI(item.value);

            setIsDropBoxVisible(false);
          }}
        />
        <Loader isVisible={isScreenLoading} />
      </View>
    );
  }
  const calculateRequestedAmounts = type =>
    adminUserData.reduce((total, record) => {
      if (
        record.PaymentMode === type &&
        (record.RequestStatus === 5 || record.RequestStatus === 6)
      ) {
        const amount =
          record.ValidatedAmount !== 0
            ? record.ValidatedAmount
            : record.ApprovedAmount !== 0
            ? record.ApprovedAmount
            : record.RequestedAmount;
        return total + amount;
      }
      return total;
    }, 0);

  const shouldShowButton = !(
    ((constant.USER_ID === constant.DINESHBHAI_ID ||
      constant.USER_ID === constant.KISHANBHAI_ID) &&
      constant.ROLE_ID === 1) ||
    constant.ROLE_ID === 6
  );

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={strings.lbl_projectfund_header}
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
        {constant.ROLE_ID == 1 || constant.ROLE_ID == 6 ? (
          <View style={{paddingLeft: wp(2), paddingEnd: wp(5)}}>
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
          </View>
        ) : null}
        {adminUserData != null ? (
          <View style={styles.topTotalbLableContainer}>
            <Text style={styles.topTotalbLable}>
              {adminUserData.length + ' ' + strings.lbl_project_fund_entries}
            </Text>
            <Text style={styles.topTotalbLable}>
              {'Total Shreekar to Project: ₹' +
                calculateRequestedAmounts('Shreekar to Project') +
                '\nTotal Project to Shreekar: ₹' +
                calculateRequestedAmounts('Project to Shreekar')}
            </Text>
          </View>
        ) : null}

        <View style={styles.bottomContainer}>
          {loadListing(adminUserData)}
          {shouldShowButton && (
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

export default ProjectFundList;

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
  tabIcon: {
    height: hp(10.5),
    width: wp(8),
    resizeMode: 'contain',
    position: 'absolute',
    right: wp(3),
  },
});
