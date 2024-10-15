import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {stack} from '../constants/commonStrings';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../utility/theme';

import {getStringMessage} from '../utility/Utility';
import {imagePath} from '../utility/imagePath';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const LoginSuccess = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mobile, setMobile] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fadeValue = new Animated.Value(0);
  const slideUpAnimation = new Animated.Value(0);
  useEffect(() => {
    fadeValue.setValue(0);
    slideUpAnimation.setValue(0);
    setTimeout(() => {
      fadeInAnimation();
    }, 500);
    slideViewUpAnimation();
  }, []);

  function fadeInAnimation() {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  function slideViewUpAnimation() {
    Animated.timing(slideUpAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  function moveToNextScreen() {
    // navigation.reset({
    //   index: 0,
    //   routes: [{name: stack.DASHBOARD}],
    // });
    navigation.reset({
      index: 0,
      routes: [{name: stack.SUBSCRIPTION_LIST}],
    });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      <Animated.View style={{flex: 1, opacity: fadeValue}}>
        <View style={[styles.topContainer]}>
          <Image style={styles.tabIcon} source={imagePath.ic_login_success} />
          <Text style={styles.tvTitle}>
            {getStringMessage('lbl_Login_created')}
          </Text>
          <Text style={styles.tvSubTitle}>
            {getStringMessage('lbl_Login_created_sub')}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <ButtonBlue
            btnColor={colors.btnColor}
            btnText={getStringMessage('btn_next')}
            onClick={() => moveToNextScreen()}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: hp(6),
    width: wp(70),
    height: hp(35),
    alignSelf: 'center',
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  topContainer: {
    flex: 0.8,
    alignItems: 'center',
    padding: hp(3),
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 0.2,
    backgroundColor: colors.appBGColor,
    paddingHorizontal: wp(3),
  },
  tvBottomText: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.tabBGColor,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.tabBGColor,
  },
  tvBottomText1: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
  },
  tvTitle: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_20,
    color: colors.blackColor,
    marginTop: 5,
    textAlign: 'center',
  },
  tvSubTitle: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginTop: 5,
    textAlign: 'center',
  },
  tvStyleForgot: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginTop: hp(3),
    alignSelf: 'center',
  },
  tabIcon: {
    height: hp(40),
    width: wp(80),
    resizeMode: 'contain',
    marginBottom: hp(5),
  },
});

export default LoginSuccess;
