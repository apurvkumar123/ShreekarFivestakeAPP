import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {apiName} from '../network/serverConfig';
import {useState, useEffect} from 'react';
import Axios from '../network/Axios';
import commonStyle from '../styles/commonStyle';
import Loader from '../custom/Loader';
import Header from '../custom/Header';
import {useNavigation} from '@react-navigation/native';
import {colors, font, fontSizes} from '../utility/theme';
import {stack} from '../constants/commonStrings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import SubscriptionRow from '../custom/customRow/SubscriptionRow';
import {getStringMessage} from '../utility/Utility';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import WebView from 'react-native-webview';
import constant from '../constants/constant';
import {SESSION_NAME, setPrefData} from '../utility/session';
const WebViewScreen = ({route}) => {
  const navigation = useNavigation();
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [commonlist, setCommonlist] = useState([]);
  const [currentURL, setCurrentURL] = useState('');
  useEffect(() => {
    console.log('rrr=', route.params.myUrl);
  }, []);

  function randerDialog() {}
  function handleWebViewNavigationStateChange(newNavState) {
    if (newNavState != undefined) {
      const {url} = newNavState;
      // setCurrentURL(newNavState.url);
      console.log('url::' + url);

      if (url.includes('success')) {
        requestGetUserDetails();
      }
    }
  }
  async function requestGetUserDetails() {
    const data = {
      deviceToken: constant.deviceToken,
      userid: constant.USER_ID,
    };
    console.log('REQ_UserDetails', data);
    return Axios.requestData('POST', apiName.UserDetails, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_UserDetails', res.data);
          if (res.data.status == 0) {
          } else {
            setPrefData(
              SESSION_NAME.USER_INFO,
              res.data.result,
              (resType, response) => {
                constant.USER_ID = res.data.result.userdetails.id;
                constant.orgID = res.data.result.organization.id;
                navigation.reset({
                  index: 0,
                  routes: [{name: stack.DASHBOARD}],
                });
              },
            );
          }
        } else {
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Loader isVisible={isScreenLoading} />
        <Header
          route={getStringMessage('lbl_payment_title')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />
        <View style={[styles.topContainer]}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: colors.white,
              alignSelf: 'center',
            }}>
            {/* Load webview */}
            <WebView
              sharedCookiesEnabled
              thirdPartyCookiesEnabled
              originWhitelist={['*']}
              mixedContentMode="compatibility"
              javaScriptEnabled={true}
              startInLoadingState={true}
              automaticallyAdjustContentInsets={false}
              domStorageEnabled={true}
              decelerationRate="normal"
              scrollEnabled={true}
              scalesPageToFit={false}
              source={{uri: route.params.myUrl}}
              onNavigationStateChange={newNavState =>
                handleWebViewNavigationStateChange(newNavState)
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
  },
  safeAreaBaseViewContainer: {
    flex: 1,
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
