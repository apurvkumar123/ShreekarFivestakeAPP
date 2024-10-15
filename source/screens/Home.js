import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import commonStyle from '../styles/commonStyle';
import LoginHeader from '../custom/LoginHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {apiName} from '../network/serverConfig';
import Axios from '../network/Axios';
import constant from '../constants/constant';
import Loader from '../custom/Loader';
import {colors, font, fontSizes} from '../utility/theme';
import CountryListRow from '../custom/customRow/CountryListRow';
import {getStringMessage} from '../utility/Utility';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import {stack} from '../constants/commonStrings';
const TouchableOpacity = withPreventDoubleClick();
const Home = () => {
  const navigation = useNavigation();

  const [adminUserData, setAdminUserData] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(0);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
      requestGetDueData();
    }, []),
  );
  function moveToNext() {
    navigation.navigate({name: stack.VIEW_MORE_DUES});
  }
  async function requestGetDueData() {
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
  function loadListing(data) {
    return (
      <>
        {data != null && data.length != 0 ? (
          <>
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
            <TouchableOpacity
              onPress={() => {
                moveToNext();
              }}>
              <Text style={styles.viewallLable}>
                {getStringMessage('lbl_view_all')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={commonStyle.NoListTextStyleCenter}>
            {getStringMessage('lbl_no_records')}
          </Text>
        )}
      </>
    );
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  topContainer: {
    // flex: 0.45,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    paddingHorizontal: wp(3),
    borderRadius: wp(6),
    marginHorizontal: wp(3),
    overflow: 'hidden',
    marginBottom: hp(2),
  },

  emptyContainer: {
    flex: 0.1,
    margin: wp(3),
  },
  topTotalbLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    width: wp(95),
    marginBottom: hp(1),
    textAlign: 'center',
  },
  viewallLable: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.btnColor,
    marginVertical: hp(2),
    textAlign: 'center',
  },
});
export default Home;
