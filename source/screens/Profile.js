import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {dateFormat, stack} from '../constants/commonStrings';
import constant from '../constants/constant';
import DoubleButtonDialog from '../custom/Dialogs/DoubleButtonDialog';
import MediaDialog from '../custom/Dialogs/MediaDialog';
import LoginHeader from '../custom/LoginHeader';
import CountryListRow from '../custom/customRow/CountryListRow';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {getStringMessage, logout, showFlashMessage} from '../utility/Utility';
import {imagePath} from '../utility/imagePath';
import {SESSION_NAME, getPrefData, setPrefData} from '../utility/session';
import {colors, font, fontSizes} from '../utility/theme';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import moment from 'moment';
const TouchableOpacity = withPreventDoubleClick();
const Profile = () => {
  const navigation = useNavigation();
  const [isDoubleDialogVisible, setIsDoubleDialogVisible] = useState(false);
  const [isMediaDialogVisible, setIsMediaDialogVisible] = useState(false);
  const [isProfileLoad, setIsProfileLoad] = useState(false);
  const [successDialogBtnTxt, setSuccessDialogBtnTxt] = useState('OK');
  const [cancelDialogBtnTxt, setCancelDialogBtnTxt] = useState('CANCEL');
  const [message, setMessage] = useState('No update available');
  const [title, setTitle] = useState('Alert');
  const [userDetails, setUserDetails] = useState({});
  const [orgDetails, setOrgDetails] = useState({});
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [orgLogo, setOrgLogo] = useState('');
  const [profileOptions, setProfileOptions] = useState([
    {id: 9, name: getStringMessage('lbl_edit_profile_user')},
    {id: 1, name: getStringMessage('lbl_edit_profile')},
    {id: 2, name: getStringMessage('lbl_manager_admin_user')},
    {id: 3, name: getStringMessage('lbl_member_details')},
    {id: 11, name: getStringMessage('lbl_member_member')},
    {id: 13, name: getStringMessage('lbl_member_meeting')},

    {id: 10, name: getStringMessage('lbl_org_setting')},
    // {id: 4, name: getStringMessage('lbl_manage_registration_fees')},
    // {id: 5, name: getStringMessage('lbl_manage_organization_dues')},
    {id: 6, name: getStringMessage('lbl_my_subscription')},
    {id: 7, name: getStringMessage('lbl_manage_payment_methods')},
    {id: 12, name: getStringMessage('lblContactUs')},
    {id: 8, name: getStringMessage('btn_logout')},
  ]);
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        importData();
      }, 1000);
    }, []),
  );
  function importData() {
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response: ', response);
        if (response.userdetails) {
          setUserDetails(response.userdetails);
        }
        if (response.is_subscribed == constant.USER_SUBSCRIBED) {
          setSubscriptionDetails(response.subscriptiondetails);
        }
        if (response.organization) {
          setOrgLogo(response.organization.logourl);
          setOrgDetails(response.organization);
        }
      }
    });
  }

  function LoadDailog() {
    return (
      <View>
        <DoubleButtonDialog
          submitbuttonText={successDialogBtnTxt}
          cancelbuttonText={cancelDialogBtnTxt}
          isVisible={isDoubleDialogVisible}
          message={message}
          title={title}
          submitButtonAction={() => {
            setIsDoubleDialogVisible(false);
            requestLogout();
          }}
          cancelButtonAction={() => {
            setIsDoubleDialogVisible(false);
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
      </View>
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
          setOrgLogo(image.path);
          uploadLogo(image.path);
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
          setOrgLogo(image.path);
          uploadLogo(image.path);
          setIsMediaDialogVisible(false);
        });
      }, 500);
    }
  }

  async function uploadLogo(logo) {
    setIsProfileLoad(true);
    let formData = new FormData();
    formData.append('org_id', orgDetails.id);
    formData.append('user_id', userDetails.id);
    let res1 = logo.split('/');
    let spltDot = res1[res1.length - 1].split('.');
    var timeStamp = Math.floor(Date.now());
    const newFile = {
      uri: Platform.OS == 'android' ? logo : 'file:///' + logo,
      type: 'image/jpeg',
      name: timeStamp + '.' + spltDot[spltDot.length - 1],
    };
    formData.append('logo', newFile);

    console.log('REQ_LogoUpdate', formData);
    return Axios.requestData('POST', apiName.updateOrgLogo, formData)
      .then(res => {
        setIsProfileLoad(false);
        if (res.status == 200) {
          console.log('RES_LogoUpdate', res.data);
          if (res.data.status == 0) {
          } else {
            showFlashMessage('Info', res.data.message, false);
            setPrefData(
              SESSION_NAME.USER_INFO,
              res.data.result,
              (resType, response) => {},
            );
          }
        } else {
        }
      })
      .catch(err => {
        setIsProfileLoad(false);
        console.log('err', err);
      });
  }

  const menuList = profileOptions.map(data => {
    console.log('menulistItem---->', JSON.stringify(data));
    return (
      <CountryListRow
        value={data.name}
        subValue={
          data.id == 6 &&
          'expired on ' +
            moment(subscriptionDetails.org_sub_enddate).format(
              dateFormat.DISPLAY,
            )
        }
        textColor={data.id == 8 && colors.redColor}
        isRightArrow={data.id == 8 ? false : true}
        onClick={() => {
          console.log('123123 ', data.name);
          if (data.id == 1) {
            navigation.navigate({name: stack.EDIT_PROFILE});
          } else if (data.id == 9) {
            navigation.navigate({name: stack.EDIT_PROFILE_USER});
          } else if (data.id == 2) {
            navigation.navigate({name: stack.ADMIN_USER});
          } else if (data.id == 3) {
            navigation.navigate({name: stack.MEMBER_USER});
          } else if (data.id == 4) {
            navigation.navigate({name: stack.REGISTRATION_FEE});
          } else if (data.id == 5) {
            navigation.navigate({name: stack.ORGANIZATION_DUES});
          } else if (data.id == 6) {
            navigation.navigate(stack.MY_SUBSCRIPTION_SCREEN, {
              item: subscriptionDetails,
            });
          } else if (data.id == 7) {
            navigation.navigate({name: stack.PAYMENT_METHOD});
          } else if (data.id == 8) {
            console.log('123123 ', data.name);
            setIsDoubleDialogVisible(true);
            setMessage(getStringMessage('lbl_logout_message'));
            setSuccessDialogBtnTxt(getStringMessage('lbl_logout_title'));
            setCancelDialogBtnTxt(getStringMessage('btn_cancel'));
            setTitle(getStringMessage('lbl_logout_title'));
          } else if (data.id == 10) {
            navigation.navigate({name: stack.ORG_SETTINGS});
          } else if (data.id == 11) {
            navigation.navigate({name: stack.MESSAGE_WINDOW});
          } else if (data.id == 12) {
            navigation.navigate(stack.CMS_PAGE, {
              myUrl: constant.contact_url,
            });
          } else if (data.id == 13) {
            navigation.navigate({name: stack.MANAGE_MEETING});
          } else {
            console.log('123123 ', data.name);
          }
        }}
      />
    );
  });
  async function requestLogout() {
    const data = {
      deviceToken: constant.deviceToken,
    };
    console.log('REQ_Logout', data);
    return Axios.requestData('POST', apiName.logoutUser, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_Logout', res.data);
          if (res.data.status == 0) {
          } else {
            logout(navigation);
          }
        } else {
        }
      })
      .catch(err => {
        console.log('err', err);
        logout(navigation);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {LoadDailog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <LoginHeader route={''} isIconDisplay={true} />
        <View style={styles.topContainer}>
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
              }}>
              <Image style={styles.orgchangeicon} source={imagePath.ic_edit} />
            </TouchableOpacity>
          </View>
          <Text style={styles.tvStyleOrgName}>
            {orgDetails.organizationname}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <ScrollView>
            <View>{menuList}</View>
          </ScrollView>
        </View>
      </View>
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
  styleIndecator: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  profileContainerMain: {
    alignItems: 'center',
    width: wp(100),
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
    right: wp(35),
    justifyContent: 'center',
  },
  topContainer: {
    backgroundColor: colors.appBGColor,
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
  },

  tvStyleOrgName: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    textAlign: 'center',
    margin: hp(1),
  },
});
export default Profile;
