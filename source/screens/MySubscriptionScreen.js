import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import Header from '../custom/Header';
import InputField from '../custom/InputField';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import {colors, font, fontSizes} from '../utility/theme';

import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {dateFormat} from '../constants/commonStrings';
import constant from '../constants/constant';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import MediaDialog from '../custom/Dialogs/MediaDialog';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import {SESSION_NAME, getPrefData} from '../utility/session';
import Loader from '../custom/Loader';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const MySubscriptionScreen = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isCancelDialogVisible, setIsCancelDialogVisible] = useState(false);
  const [subDetails, setSubDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [orgLogo, setOrgLogo] = useState('');
  useEffect(() => {
    importData();
  }, []);
  function importData() {
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response-: ', response);
        if (response.userdetails) {
          setUserDetails(response.userdetails);
        }
        if (response.is_subscribed == constant.USER_SUBSCRIBED) {
          console.log('response-: ', response.subscriptiondetails);
          setSubscriptionDetails(response.subscriptiondetails);
        }
        if (response.organization) {
          setOrgLogo(response.organization.logourl);
          setOrgDetails(response.organization);
        }
      }
    });
  }

  function randerDialog() {
    return (
      <>
        <Loader isVisible={loading} />
        <DoubleButtonDialog
          submitbuttonText={getStringMessage('btn_yes_cancel')}
          cancelbuttonText={getStringMessage('btn_cancel')}
          isVisible={isCancelDialogVisible}
          title={getStringMessage('btn_cancel_subscription')}
          message={getStringMessage('msg_active_inactive_warning')
            .replace('&&', ' Cancel this')
            .replace('##', ' ' + subscriptionDetails.title)}
          submitButtonAction={() => {
            setIsCancelDialogVisible(false);
            requestDelete();
          }}
          cancelButtonAction={() => {
            setIsCancelDialogVisible(false);
          }}
        />
      </>
    );
  }
  async function requestDelete() {
    setIsLoading(true);
    let formData = new FormData();
    formData.append('subscription_id', subscriptionDetails.id);
    formData.append('org_id', constant.orgID);
    console.log('REQ_CancelSubscription', formData);
    return Axios.requestData('POST', apiName.CancelSubscription, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_CancelSubscription', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            navigation.goBack();
          }
        } else {
          showFlashMessage('Info', res.message, true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', getStringMessage('msg_something_wrong'), true);
        console.log('err', err);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <View style={{}}>
          <Header
            route={getStringMessage('lbl_my_active_subscription')}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
          <View>
            <View style={[styles.card, styles.shadowProp]}>
              <Image
                style={styles.orgchangeicon}
                source={imagePath.ic_active_tag}
              />
              <View style={styles.innerStyle}>
                <Text style={styles.orgLable}>
                  {orgDetails.organizationname}
                </Text>
                <Text style={styles.subInfoLable}>
                  {constant.CURRENCY_SYMBOL +
                    ' ' +
                    subscriptionDetails.amount +
                    ' - ' +
                    subscriptionDetails.title}
                </Text>
                <Text style={styles.descLable}>
                  {subscriptionDetails.description}
                </Text>
                <Text style={styles.expireLable}>
                  {'expired on ' +
                    moment(subscriptionDetails.org_sub_enddate).format(
                      dateFormat.DISPLAY,
                    )}
                </Text>
              </View>
              {subscriptionDetails.cancel_req_date == null ? (
                <TouchableOpacity
                  onPress={() => {
                    setIsCancelDialogVisible(true);
                  }}>
                  <Text style={styles.cancelSubLable}>
                    {getStringMessage('btn_cancel_subscription')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.descLable}>
                  {getStringMessage('lbl_sub_cancelled_on') +
                    ' ' +
                    moment(subscriptionDetails.cancel_req_date).format(
                      dateFormat.DISPLAY,
                    )}
                </Text>
              )}
            </View>
            <Image style={styles.orgLogostyle} source={{uri: orgLogo}} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MySubscriptionScreen;

const styles = StyleSheet.create({
  innerStyle: {alignSelf: 'center', marginVertical: hp(2)},
  orgLogostyle: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(25) / 2,
    resizeMode: 'contain',
    position: 'absolute',
    alignSelf: 'center',
  },
  orgLable: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.btnColor,
    textAlign: 'center',
    marginTop: hp(3),
    alignSelf: 'center',
  },
  expireLable: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.redColor,
    textAlign: 'center',
    marginTop: hp(1),
    alignSelf: 'center',
  },
  subInfoLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    textAlign: 'center',
    marginTop: hp(1),
    alignSelf: 'center',
  },

  descLable: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    textAlign: 'center',
    alignSelf: 'center',
    opacity: 0.6,
  },
  cancelSubLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.btnColor,
    textAlign: 'center',
    borderBottomColor: colors.btnColor,
    paddingVertical: hp(0.5),
    borderBottomWidth: 0.5,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.whiteColor,
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: hp(5),
    width: wp(95),
    marginTop: wp(25) / 2,
  },
  shadowProp: {
    shadowColor: colors.blackColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },

  orgchangeicon: {
    height: hp(10),
    width: hp(10),
    resizeMode: 'contain',
    position: 'absolute',
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
