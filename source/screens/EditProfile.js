import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
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

import ImageCropPicker from 'react-native-image-crop-picker';
import constant from '../constants/constant';
import ChangePassword from '../custom/Dialogs/ChangePassword';
import ListDialog from '../custom/Dialogs/ListDialog';
import MediaDialog from '../custom/Dialogs/MediaDialog';
import DropdownField from '../custom/DropdownField';
import GogglePlaces from '../custom/GogglePlaces';
import Loader from '../custom/Loader';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import {SESSION_NAME, getPrefData, setPrefData} from '../utility/session';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [orgId, setOrgId] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [userId, setUserId] = useState('');
  const userIdRef = useRef();
  userIdRef.current = userId;
  const [orgCoverImage, setOrgCoverImage] = useState('');
  const [searchGoogle, setSearchGoogle] = useState('');
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');
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
  const [isVisibleGoogle, setIsVisibleGoogle] = useState(false);

  const [isMediaDialogVisible, setIsMediaDialogVisible] = useState(false);
  const [isProfileLoad, setIsProfileLoad] = useState(false);

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [type, setType] = useState(0);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isCoverChoose, setIsCoverChoose] = useState(false);
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
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response ed: ', response);
        if (response.userdetails) {
          setUserId(response.userdetails.id);
        }
        if (response.organization) {
          setOrgId(response.organization.id);
          setOrgLogo(response.organization.logourl);
          setOrgCoverImage(response.organization.coverpicurl);
          setOrgName(response.organization.organizationname);
          setDescription(response.organization.aboutorg);
          setAddress1(response.organization.address1);
          setAddress2(response.organization.address2);
          setAddress3(response.organization.address3);
          setCity(response.organization.cityname);
          setState(response.organization.statename);
          setCountry(response.organization.countryname);
          setLatitude(response.organization.lat);
          setLongitude(response.organization.long);
          setPlaceobject(response.organization.placeobject);
        }
      }
    });
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
      setIsLoading(true);
      let formData = new FormData();
      formData.append('type', '2');
      formData.append('org_id', orgId);
      formData.append('user_id', userId);
      formData.append('orgname', orgName);
      formData.append('aboutorg', description);
      formData.append('address1', address1);
      formData.append('address2', address2);
      formData.append('address3', address3);
      formData.append('country', country);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('lat', latitude);
      formData.append('long', longitude);
      formData.append('placeobject', placeobject);
      let res1 = orgLogo.split('/');
      let spltDot = res1[res1.length - 1].split('.');
      var timeStamp = Math.floor(Date.now());
      if (!orgLogo.includes('http') || !orgLogo.includes('')) {
        const newFile = {
          uri: Platform.OS == 'android' ? orgLogo : 'file:///' + orgLogo,
          type: 'image/jpeg',
          name: timeStamp + '.' + spltDot[spltDot.length - 1],
        };
        formData.append('logo', newFile);
      }

      if (!orgCoverImage.includes('http') || !orgCoverImage.includes('')) {
        const coverFile = {
          uri:
            Platform.OS == 'android'
              ? orgCoverImage
              : 'file:///' + orgCoverImage,
          type: 'image/jpeg',
          name: timeStamp + '.' + spltDot[spltDot.length - 1],
        };
        formData.append('coverpic', coverFile);
      }

      requestRegister(formData);
    }
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
      showFlashMessage('Required', 'Please select Country.', true);
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
      showFlashMessage('Required', 'Please select State.', true);
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
  async function requestRegister(formData) {
    console.log('REQ_EditProfile', formData);
    return Axios.requestData('POST', apiName.editProfile, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_EditProfile', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            setPrefData(
              SESSION_NAME.USER_INFO,
              res.data.result,
              (resType, response) => {
                constant.USER_ID = res.data.result.userdetails.id;
                constant.orgID = res.data.result.organization.id;
                showFlashMessage('Success!', res.data.message, false);
                navigation.goBack();
              },
            );
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

  function randerDialog() {
    return (
      <>
        <GogglePlaces
          onDialogCloseClick={() => {
            setIsVisibleGoogle(false);
          }}
          onDialogAddressClick={place => {
            setIsVisibleGoogle(false);
            console.log('place =', JSON.stringify(place));
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
        />

        <ListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={true}
          buttonText={'Close'}
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
        <MediaDialog
          isVisible={isMediaDialogVisible}
          cameraButtonAction={() => {
            SelectedMedia(constant.CAMERA_OPTION);
          }}
          GalleryButtonAction={() => {
            SelectedMedia(constant.GALLERY_OPTION);
          }}
          cancelButtonAction={() => {
            setIsMediaDialogVisible(false);
          }}
        />
      </>
    );
  }
  function SelectedMedia(option) {
    if (option == constant.CAMERA_OPTION) {
      //Camera
      setTimeout(() => {
        ImageCropPicker.openCamera({
          width: window.width,
          height: window.width,
          cropping: true,
        }).then(image => {
          console.log('camera_image', JSON.stringify(image));
          {
            isCoverChoose
              ? setOrgCoverImage(image.path)
              : setOrgLogo(image.path);
          }

          setIsMediaDialogVisible(false);
        });
      }, 500);
    } else {
      //Gallery
      setTimeout(() => {
        ImageCropPicker.openPicker({
          width: window.width,
          height: window.height,
          cropping: true,
        }).then(image => {
          console.log('gallery_image', JSON.stringify(image));
          {
            isCoverChoose
              ? setOrgCoverImage(image.path)
              : setOrgLogo(image.path);
          }
          setIsMediaDialogVisible(false);
        });
      }, 500);
    }
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
            route={getStringMessage('lbl_edit_profile')}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </Animated.View>

        <Animated.View style={{flex: 1, opacity: fadeValue}}>
          <View style={styles.profileContainerMain}>
            <View style={styles.profileContainer}>
              <Image style={styles.orgLogo} source={{uri: orgLogo}} />
              {isProfileLoad && (
                <ActivityIndicator
                  style={styles.styleIndecator}
                  size="large"
                  color={colors.btnColor}
                  animating={true}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.profilechangeContainer}
              onPress={() => {
                setIsMediaDialogVisible(true);
                setIsCoverChoose(false);
              }}>
              <Image style={styles.orgchangeicon} source={imagePath.ic_edit} />
            </TouchableOpacity>
          </View>
          <View style={[styles.topContainer]}>
            <ScrollView style={{marginHorizontal: 5}}>
              <TouchableOpacity
                onPress={() => {
                  onAddressClicked();
                }}>
                <InputField
                  search
                  inputTitleVisible={true}
                  isEditable={false}
                  isImage={true}
                  inputTitle={'SEARCH ORGANIZATION'}
                  updateMasterState={value => setSearchGoogle(value)}
                  value={searchGoogle}
                />
              </TouchableOpacity>
              {/* Note : remove label as per client requierement (22-09-2023) */}

              {/* {userIdRef.current == '' && (
                <Text style={styles.centerLable}>
                  {getStringMessage('lbl_add_details_manually')}
                </Text>
              )} */}
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
                  setHeaderTitle('Select Country');
                  requestGetCountry();
                }}
              />
              <DropdownField
                inputTitle={'STATE'}
                value={state}
                onClick={() => {
                  setCommonlist([]);
                  setType(2);
                  setHeaderTitle('Select State');
                  requestGetState();
                }}
              />
              <DropdownField
                inputTitle={'CITY'}
                value={city}
                onClick={() => {
                  setCommonlist([]);
                  setType(3);
                  setHeaderTitle('Select City');
                  requestGetCity();
                }}
              />
              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={getStringMessage('lbl_about_organization')}
                updateMasterState={value => setDescription(value)}
                value={description}
              />
              <View style={styles.coverContainerMain}>
                <View style={styles.profileCoverContainer}>
                  {orgCoverImage != '' && (
                    <Image
                      style={styles.orgCover}
                      source={{uri: orgCoverImage}}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.profileCoverchangeContainer}
                    onPress={() => {
                      setIsMediaDialogVisible(true);
                      setIsCoverChoose(true);
                    }}>
                    <Image
                      style={styles.orgchangeCover}
                      source={imagePath.ic_upload}
                    />
                    <Text style={styles.tvcoverchangeTitle}>
                      {getStringMessage('lbl_tap_to_upload_picture')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  profileContainerMain: {
    alignItems: 'center',
    width: wp(80),
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  orgLogo: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35) / 2,
    resizeMode: 'contain',
  },
  orgchangeicon: {
    height: hp(2.5),
    width: wp(5),
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    alignSelf: 'center',
  },
  profileContainer: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35) / 2,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
  },
  profilechangeContainer: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: colors.btnColor,
    position: 'absolute',
    bottom: hp(0),
    right: wp(25),
    justifyContent: 'center',
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

  tvcoverchangeTitle: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.btnColor,
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

  coverContainerMain: {
    alignItems: 'center',
    marginVertical: hp(2),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.textInputBorderColor,
    overflow: 'hidden',
  },
  orgCover: {
    width: wp(100),
    height: wp(35),
    resizeMode: 'cover',
  },
  orgchangeCover: {
    height: hp(5),
    width: wp(15),
    resizeMode: 'contain',
    tintColor: colors.lightGrayColor,
    alignSelf: 'center',
  },
  profileCoverContainer: {
    height: wp(35),
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
  },
  profileCoverchangeContainer: {
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
});
export default EditProfile;
