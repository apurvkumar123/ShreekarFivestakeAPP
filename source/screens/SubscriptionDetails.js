import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {stack} from '../constants/commonStrings';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import Header from '../custom/Header';
import Loader from '../custom/Loader';
import {apiName, basePath} from '../network/serverConfig';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {getStringMessage} from '../utility/Utility';
import {SESSION_NAME, getPrefData} from '../utility/session';
import {colors, font, fontSizes} from '../utility/theme';
const SubscriptionDetails = ({route}) => {
  const navigation = useNavigation();
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [item, setItem] = useState(route.params.SubscriptionDetail);
  const [userDetails, setUserDetails] = useState({});
  const [orgDetails, setOrgDetails] = useState({});

  useEffect(() => {
    console.log('rrr=', route.params.SubscriptionDetail);
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response: ', response);
        if (response.userdetails) {
          setUserDetails(response.userdetails);
        }
        if (response.organization) {
          setOrgDetails(response.organization);
        }
      }
    });
  }, []);

  function randerDialog() {}
  function onClickPay() {
    var orgID = orgDetails.id;
    var userID = userDetails.id;
    var planID = route.params.SubscriptionDetail.id;
    // +planid/orgid/userid
    navigation.push(stack.WEB_VIEW, {
      myUrl:
        basePath +
        apiName.paymentEndPoint +
        '/' +
        planID +
        '/' +
        orgID +
        '/' +
        userID,
    });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Loader isVisible={isScreenLoading} />
        <Header
          route={getStringMessage('lbl_subscription_details_title')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        <View style={[styles.topContainer]}>
          <View style={styles.lbl_container}>
            <Text style={styles.tabLable}>
              {getStringMessage('lbl_joiningFee')}
            </Text>
            <Text style={styles.tabLable}>
              {route.params.SubscriptionDetail.amount}
            </Text>
          </View>
          <ButtonBlue
            btnColor={colors.btnColor}
            btnText={getStringMessage('btn_paynow')}
            onClick={() => onClickPay()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionDetails;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  lbl_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteColor,
    padding: 10,
  },
  tabLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_16,
    color: colors.blackColor,
    textAlign: 'center',
  },
});
