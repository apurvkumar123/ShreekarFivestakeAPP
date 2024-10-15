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

const ViewMoreDues = () => {
  const navigation = useNavigation();
  const [adminUserData, setAdminUserData] = useState([]);
  const [isAdd, setIsAdd] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(0);
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
                value={item.duesname}
                subValueRed={item.enddate}
                isBigText={true}
                isRightArrow={false}
                onClick={() => {
                  console.log('123123 ', item);
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
    var data = {org_id: constant.orgID, limit: limit, pageno: page};
    console.log('REQ_GetDueData', data);
    return Axios.requestData('POST', apiName.GetDueMember, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetDueData', res.data.result);
          setAdminUserData(res.data.result.data);
          setIsScreenLoading(false);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_GetDueData_err', err);
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
          route={getStringMessage('lbl_member_fee_due_month').replace(
            '##',
            adminUserData.length,
          )}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />

        <View style={styles.bottomContainer}>{loadListing(adminUserData)}</View>
      </View>
    </SafeAreaView>
  );
};

export default ViewMoreDues;

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
