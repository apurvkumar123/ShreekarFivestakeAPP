import {useNavigation} from '@react-navigation/native';
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
import InputField from '../custom/InputField';
import LoginHeader from '../custom/LoginHeader';
import Header from '../custom/Header';
import {setUserData} from '../store/user';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import {colors, font, fontSizes} from '../utility/theme';

import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import ForgotPassword from '../custom/Dialogs/ForgotPassword';
import {
  getStringMessage,
  showFlashMessage,
  validateEmail,
  validatePassword,
} from '../utility/Utility';
import {apiName} from '../network/serverConfig';
import Axios from '../network/Axios';
import constant from '../constants/constant';
import {SESSION_NAME, setPrefData} from '../utility/session';
import DropdownField from '../custom/DropdownField';
import ListDialog from '../custom/Dialogs/ListDialog';
import Loader from '../custom/Loader';
import GogglePlaces from '../custom/GogglePlaces';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;

const AddOrgDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchGoogle, setSearchGoogle] = useState('');
  const [orgName, setOrgName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [changeCountryValue, setchangeCountryValue] = useState('');
  const [changeStateValue, setchangeStateValue] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [placeobject, setPlaceobject] = useState('');

  const [headerTitle, setHeaderTitle] = useState('');
  const [commonlist, setCommonlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleGoogle, setIsVisibleGoogle] = useState(false);

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [type, setType] = useState(0);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
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

  function fadeInAnimation() {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
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
  function validation() {
    if (orgName.trim().length == 0) {
      showFlashMessage('Required', 'Please enter Organization name', true);
    } else if (address1.trim().length == 0) {
      showFlashMessage('Required', 'Please enter Address line 1', true);
    } else if (address2.trim().length == 0) {
      showFlashMessage('Required', 'Please enter Address line 2', true);
    } else if (country.trim().length == 0) {
      showFlashMessage('Required', 'Please select country', true);
    } else if (state.trim().length == 0) {
      showFlashMessage('Required', 'Please enter state', true);
    } else if (city.trim().length == 0) {
      showFlashMessage('Required', 'Please enter city', true);
    } else {
      let userinfo = {...constant.Register_data};
      userinfo.orgname = orgName;
      userinfo.address1 = address1;
      userinfo.address2 = address2;
      userinfo.address3 = address3;
      userinfo.country = country;
      userinfo.state = state;
      userinfo.city = city;
      userinfo.lat = latitude;
      userinfo.long = longitude;
      userinfo.placeobject = placeobject;

      constant.Register_data = userinfo;
      navigation.goBack();
    }
  }
  function importData() {
    setOrgName(constant.Register_data.orgname);
    setAddress1(constant.Register_data.address1);
    setAddress2(constant.Register_data.address2);
    setAddress3(constant.Register_data.address3);
    setCountry(constant.Register_data.country);
    setState(constant.Register_data.state);
    setCity(constant.Register_data.city);
    setLatitude(constant.Register_data.lat);
    setLongitude(constant.Register_data.long);
    setPlaceobject(constant.Register_data.placeobject);
  }
  async function requestGetCountry() {
    setIsScreenLoading(true);
    console.log('REQ_GetCountry');
    return Axios.request('POST', apiName.getCountry)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetCountry', res.data.result);
          let LArray = [];
          res.data.result.map(item => {
            var obj = {label: item.countryname, value: item.id};
            LArray.push(obj);
          });
          setCommonlist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayListDialog(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_GetCountry_err', err);
      });
  }
  async function requestGetState() {
    if (changeCountryValue == '') {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_country'),
        true,
      );
    } else {
      setIsScreenLoading(true);
      var data = {countryid: changeCountryValue};
      console.log('REQ_GetState - ', data);
      return Axios.requestData('POST', apiName.getState, data)
        .then(res => {
          if (res.status == 200) {
            console.log('RES_GetState', res.data.result);
            let LArray = [];
            res.data.result.map(item => {
              var obj = {label: item.statename, value: item.id};
              LArray.push(obj);
            });
            setCommonlist(LArray);
            setTimeout(() => {
              setDisplayListDialog(true);
              setIsScreenLoading(false);
            }, 300);
          } else {
            setIsScreenLoading(false);
          }
        })
        .catch(err => {
          setIsScreenLoading(false);
          console.log('RES_GetState_err', err);
        });
    }
  }
  async function requestGetCity() {
    if (changeStateValue == '') {
      showFlashMessage(
        'Required',
        getStringMessage('msg_please_select_state'),
        true,
      );
    } else {
      setIsScreenLoading(true);
      var data = {stateid: changeStateValue};
      console.log('REQ_GetCity');
      return Axios.requestData('POST', apiName.getCity, data)
        .then(res => {
          if (res.status == 200) {
            console.log('RES_GetCity', res.data.result);
            let LArray = [];
            res.data.result.map(item => {
              var obj = {label: item.cityname, value: item.id};
              LArray.push(obj);
            });
            setCommonlist(LArray);
            setTimeout(() => {
              setIsScreenLoading(false);
              setDisplayListDialog(true);
            }, 300);
          } else {
            setIsScreenLoading(false);
          }
        })
        .catch(err => {
          setIsScreenLoading(false);
          console.log('RES_GetCity_err', err);
        });
    }
  }
  function randerDialog() {
    return (
      <>
        <GogglePlaces
          onDialogCloseClick={() => {
            setIsVisibleGoogle(false);
          }}
          onDialogAddressClick={place => {
            setIsVisibleGoogle(false);
            setPlaceobject(JSON.stringify(place));
            setLatitude(place.geometry.location.lat);
            setLongitude(place.geometry.location.lng);
            setSearchGoogle(place.name);
            setOrgName(place.name);
            setAddress1(place.formatted_address);

            var addresscom = place.address_components;
            for (let i = 0; i < addresscom.length; i++) {
              let typesArray = addresscom[i].types;
              for (let j = 0; j < typesArray.length; j++) {
                if (typesArray[j] == 'postal_code') {
                  setAddress3(addresscom[i].long_name);
                }
                if (typesArray[j] == 'locality') {
                  setCity(addresscom[i].long_name);
                }
                if (typesArray[j] == 'administrative_area_level_1') {
                  setState(addresscom[i].long_name);
                }
                if (typesArray[j] == 'country') {
                  setCountry(addresscom[i].long_name);
                }
                if (typesArray[j] == 'sublocality_level_1') {
                  setAddress2(addresscom[i].long_name);
                }
              }
            }
          }}
          isVisible={isVisibleGoogle}
          emailAddress={'test'}
        />

        <ListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={true}
          buttonText={getStringMessage('btn_close')}
          isVisible={isDisplayListdialog}
          title={headerTitle}
          list={commonlist}
          onItemClick={item => {
            console.log('item--', item);
            if (type == 1) {
              setchangeCountryValue(item.value);
              setCountry(item.label);
            } else if (type == 2) {
              setchangeStateValue(item.value);
              setState(item.label);
            } else if (type == 3) {
              setCity(item.label);
            }
            setDisplayListDialog(false);
          }}
        />
      </>
    );
  }
  /**
   * onAddressClicked
   */
  function onAddressClicked() {
    setIsVisibleGoogle(true);
  }

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Loader isVisible={isScreenLoading} />
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
          <Header
            route={getStringMessage('lbl_title_enter_org_details')}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={[styles.topContainer]}>
            <ScrollView>
              <View style={{width: wp(95)}} />
              <TouchableOpacity
                onPress={() => {
                  onAddressClicked();
                }}>
                <InputField
                  search
                  inputTitleVisible={true}
                  isEditable={false}
                  isImage={true}
                  inputTitle={getStringMessage('lbl_hint_search_org')}
                  updateMasterState={value => setSearchGoogle(value)}
                  value={searchGoogle}
                />
              </TouchableOpacity>

              <Text style={styles.centerLable}>
                {getStringMessage('lbl_add_details_manually')}
              </Text>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_hint_orgname')}
                updateMasterState={value => setOrgName(value)}
                value={orgName}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_hint_address1')}
                updateMasterState={value => setAddress1(value)}
                value={address1}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_hint_address2')}
                updateMasterState={value => setAddress2(value)}
                value={address2}
              />
              {/* <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_hint_address3')}
                updateMasterState={value => setAddress3(value)}
                value={address3}
              /> */}
              <DropdownField
                inputTitle={getStringMessage('lbl_country')}
                value={country}
                onClick={() => {
                  setCommonlist([]);
                  setType(1);
                  setHeaderTitle(getStringMessage('lbl_select_country'));
                  requestGetCountry();
                }}
              />
              <DropdownField
                inputTitle={getStringMessage('lbl_state')}
                value={state}
                onClick={() => {
                  setCommonlist([]);
                  setType(2);
                  setHeaderTitle(getStringMessage('lbl_select_state'));
                  requestGetState();
                }}
              />
              <DropdownField
                inputTitle={getStringMessage('lbl_city')}
                value={city}
                onClick={() => {
                  setCommonlist([]);
                  setType(3);
                  setHeaderTitle(getStringMessage('lbl_select_city'));
                  requestGetCity();
                }}
              />

              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={getStringMessage('btn_save')}
                onClick={() => validation()}
                isloading={isLoading}
              />
            </ScrollView>
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
    flex: 1,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    paddingVertical: hp(3),
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
  centerLable: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.btnColor,
    textAlign: 'center',
    marginTop: hp(1),
    borderBottomColor: colors.btnColor,
    paddingVertical: hp(0.5),
    borderBottomWidth: 0.5,
    alignSelf: 'center',
  },
});

export default AddOrgDetails;
