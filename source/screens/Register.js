import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {stack} from '../constants/commonStrings';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import InputField from '../custom/InputField';
import LoginHeader from '../custom/LoginHeader';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../utility/theme';

import constant from '../constants/constant';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [mobile, setMobile] = useState('');
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');
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
    setTimeout(() => {
      importData();
    }, 1000);
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        importData();
      }, 1000);
    }, []),
  );
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
  function importData() {
    setFname(constant.Register_data.firstname);
    setLname(constant.Register_data.lastname);
    setOrgName(constant.Register_data.orgname);
    setMobile(constant.Register_data.mobilenumber);
    setDescription(constant.Register_data.aboutorg);
  }
  function validation() {
    if (fname.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_fname'), true);
    } else if (lname.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_lname'), true);
    } else if (mobile.trim().length != 0 && mobile.trim().length < 9) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_valid_mobile_number'),
        true,
      );
    } else if (orgName.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_org_name'), true);
    } else if (description.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_enter_description'),
        true,
      );
    } else {
      exportData();
    }
  }
  function exportData() {
    let userinfo = {...constant.Register_data};
    userinfo.firstname = fname;
    userinfo.lastname = lname;
    userinfo.orgname = orgName;
    userinfo.aboutorg = description;
    userinfo.mobilenumber = mobile;
    constant.Register_data = userinfo;
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      <View style={styles.safeAreaBaseViewContainer}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideUpAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenHeight / 12, 0],
                }),
              },
            ],
          }}>
          <LoginHeader
            route={getStringMessage('lbl_provide_details')}
            isIconDisplay={true}
          />
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={[styles.topContainer]}>
            <ScrollView>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_fname_hint')}
                updateMasterState={value => setFname(value)}
                value={fname}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_lname_hint')}
                updateMasterState={value => setLname(value)}
                value={lname}
              />
              <InputField
                number
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_valid_mobile')}
                updateMasterState={value => setMobile(value)}
                value={mobile}
              />
              <TouchableOpacity
                onPress={() => {
                  exportData();
                  navigation.navigate({name: stack.ADD_ORGANIZATION});
                }}>
                <InputField
                  inputTitleVisible={true}
                  isEditable={false}
                  isImage={false}
                  inputTitle={'ORGANIZATION NAME'}
                  updateMasterState={value => setOrgName(value)}
                  value={orgName}
                />
              </TouchableOpacity>
              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_about_organization')}
                updateMasterState={value => setDescription(value)}
                value={description}
              />
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={'Next'}
                onClick={() => validation()}
                isloading={isLoading}
              />
            </ScrollView>
          </View>

          <View style={styles.bottomContainer}>
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={styles.tvBottomText1}>{'ALREADY A MEMBER? '}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate({name: stack.LOGIN});
                }}>
                <Text style={styles.tvBottomText}>{'LOGIN HERE'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
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
    flex: 0.9,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    paddingVertical: hp(3),
  },
  bottomContainer: {
    flex: 0.1,
    backgroundColor: colors.appBGColor,
    alignItems: 'center',
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
  tvEmailBottom: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
    opacity: 0.6,
    marginTop: 5,
  },
  tvStyleForgot: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginTop: hp(3),
    alignSelf: 'center',
  },
});

export default Register;
