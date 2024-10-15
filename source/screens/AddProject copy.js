import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
import {Text} from 'react-native';
import strings from '../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
let screenHeight = Dimensions.get('window').height;
const AddProject = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [projectLogo, setProjectLogo] = useState('');
  const [isAdd, setIsAdd] = useState(route.params.isAdd);
  const [pid, setPid] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [pstartDate, setpStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pendDate, setpEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [toDate, setTodate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(
    new Date().setHours(0, 0, 0, 0),
  );
  const [type, setType] = useState(0);
  const [isMediaDialogVisible, setIsMediaDialogVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isDonationCompulsory, setIsDonationCompulsory] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    {
      !isAdd && importData();
    }
  }, []);

  function importData() {
    var item = route.params.item;
    setPid(item.id);
    setProjectLogo(item.imageurl);
    setProjectName(item.title);
    setDescription(item.description);
    setpStartDate(item.startdate);
    setStartDate(moment(item.startdate).format(dateFormat.DISPLAY));
    setpEndDate(item.enddate);
    setEndDate(moment(item.enddate).format(dateFormat.DISPLAY));
    setAmount(item.donation_amount);
    setIsDonationCompulsory(item.is_donation_compulsory == 1 ? true : false);
  }
  function validation() {
    if (projectLogo.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_image').replace(
          '##',
          route.params.isFrom == 1 ? 'Project' : 'Event',
        ),
        true,
      );
    } else if (projectName.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_enter_project_name').replace(
          '##',
          route.params.isFrom == 1 ? 'Project' : 'Event',
        ),
        true,
      );
    } else if (description.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_enter_description'),
        true,
      );
    } else if (amount.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_amount'), true);
    } else if (startDate.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_start_date_first'),
        true,
      );
    } else if (pendDate.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_end_date'),
        true,
      );
    } else {
      setIsLoading(true);

      let formData = new FormData();

      formData.append('org_id', constant.orgID);
      formData.append('title', projectName);
      formData.append('description', description);
      formData.append('startdate', pstartDate);
      formData.append('enddate', pendDate);
      formData.append('donation_amount', amount);
      formData.append('is_donation_compulsory', isDonationCompulsory ? 1 : 0);

      {
        !isAdd && formData.append('id', pid);
      }
      if (isAdd) {
        let res1 = projectLogo.split('/');
        let spltDot = res1[res1.length - 1].split('.');
        var timeStamp = Math.floor(Date.now());
        const newFile = {
          uri:
            Platform.OS == 'android' ? projectLogo : 'file:///' + projectLogo,
          type: 'image/jpeg',
          name: timeStamp + '.' + spltDot[spltDot.length - 1],
        };
        formData.append('image', newFile);
      }

      requestAddUpdateProject(formData);
    }
  }

  async function requestAddUpdateProject(formData) {
    console.log('REQ_AddProject', formData);
    return Axios.requestData('POST', apiName.AddProject, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_AddProject', res.data);
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

  function randerDialog() {
    return (
      <>
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
        <DoubleButtonDialog
          submitbuttonText={getStringMessage('btn_yes_delete')}
          cancelbuttonText={getStringMessage('btn_cancel')}
          isVisible={isDeleteDialogVisible}
          message={getStringMessage('msg_delete')}
          submitButtonAction={() => {
            setIsDeleteDialogVisible(false);
            requestDelete();
          }}
          cancelButtonAction={() => {
            setIsDeleteDialogVisible(false);
          }}
        />
      </>
    );
  }

  async function requestDelete() {
    let formData = new FormData();
    formData.append('id', pid);
    console.log('REQ_Delete', formData);
    return Axios.requestData('POST', apiName.DeleteProject, formData)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_Delete', res.data);
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
          setProjectLogo(image.path);
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
          setProjectLogo(image.path);
          setIsMediaDialogVisible(false);
        });
      }, 500);
    }
  }

  /**
   * onDatePickerClicked
   */
  function onDatePickerClicked(from) {
    if (from == 2 && pstartDate == '') {
      showFlashMessage(
        'Info',
        getStringMessage('msg_select_start_date_first'),
        true,
      );
    } else {
      setDatePickerVisibility(true);
      setType(from);
    }
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async date => {
    if (type == 1) {
      if (currentDate <= date) {
        setStartDate(moment(date).format(dateFormat.DISPLAY));
        setpStartDate(moment(date).format(dateFormat.POSTING));
        setCurrentDate(date);
      } else {
        showFlashMessage(
          'Info',
          getStringMessage('msg_formGreaterThanTo'),
          true,
        );
      }
    } else if (type == 2) {
      console.log('date333 ', date);
      if (date < currentDate) {
        console.log('date4444 ', date);
        showFlashMessage(
          'Info',
          getStringMessage('msg_geaterThanCurrDate'),
          true,
        );
      } else {
        setTodate(date);
        setEndDate(moment(date).format(dateFormat.DISPLAY));
        setpEndDate(moment(date).format(dateFormat.POSTING));
      }
    }

    hideDatePicker();
  };

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <View style={{}}>
          <Header
            route={
              isAdd ? strings.lbl_create_new_project : strings.lbl_edit_project
            }
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </View>

        <View style={{flex: 1}}>
          <View style={[styles.topContainer]}>
            <ScrollView>
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_project_name_hint}
                updateMasterState={value => setProjectName(value)}
                value={projectName}
              />
              <InputField
                multiline
                inputTitleVisible={true}
                isEditable={true}
                isImage={false}
                inputTitle={strings.lbl_address_hint}
                updateMasterState={value => setDescription(value)}
                value={description}
              />
              <InputField
                inputTitleVisible={true}
                isEditable={true}
                number
                isImage={false}
                inputTitle={getStringMessage('min_donate_amount')}
                updateMasterState={value => setAmount(value)}
                value={amount}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => {
                    onDatePickerClicked(1);
                  }}>
                  <InputField
                    date
                    inputTitleVisible={true}
                    isEditable={false}
                    inputTitle={getStringMessage('lbl_start_date_hint')}
                    isImage={true}
                    inputIconHint={imagePath.ic_calendar}
                    updateMasterState={value => setStartDate(value)}
                    value={startDate}
                  />
                </TouchableOpacity>
                <View style={{width: wp(5)}} />
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => {
                    onDatePickerClicked(2);
                  }}>
                  <InputField
                    date
                    inputTitleVisible={true}
                    isEditable={false}
                    inputTitle={getStringMessage('lbl_end_date_hint')}
                    isImage={true}
                    inputIconHint={imagePath.ic_calendar}
                    updateMasterState={value => setEndDate(value)}
                    value={endDate}
                  />
                </TouchableOpacity>
              </View>
              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={
                  isAdd
                    ? getStringMessage('btn_save')
                    : getStringMessage('btn_update_small')
                }
                onClick={() => validation()}
                isloading={isLoading}
              />
              {!isAdd && (
                <ButtonBlue
                  btnColor={colors.redColor}
                  btnText={getStringMessage('btn_delete')}
                  onClick={() => setIsDeleteDialogVisible(true)}
                  isloading={isLoadingDelete}
                />
              )}
            </ScrollView>
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={currentDate}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  hintLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  container: {
    marginTop: hp(6),
    width: wp(70),
    height: hp(35),
    alignSelf: 'center',
  },
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

  orgcheckicon: {
    height: hp(2.5),
    width: wp(5),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginEnd: wp(3),
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

export default AddProject;
