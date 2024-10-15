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
const CMSPage = ({route}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      <View style={styles.safeAreaBaseViewContainer}>
        <Header
          route={getStringMessage('lblContactUs')}
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
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CMSPage;

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
});
