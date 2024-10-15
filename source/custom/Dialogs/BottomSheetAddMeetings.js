import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ButtonBlue from '../Buttons/ButtonBlue';
import {colors} from '../../utility/theme';
import {getStringMessage} from '../../utility/Utility';
import {imagePath} from '../../utility/imagePath';
import LoginHeader from '../LoginHeader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import InputField from '../InputField';
import DropdownField from '../DropdownField';
import ListDialog from './ListDialog';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const BottomSheetAddMeetings = ({isVisible, onDialogCloseClick}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isDropBoxVisible, setIsDropBoxVisible] = useState(false);
  const [status, setStatus] = useState('');
  const commonlist = [
    {label: getStringMessage('lbl_active_status'), value: 1},
    {label: getStringMessage('lbl_inactive_status'), value: 0},
  ];

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  function renderDialg() {
    return (
      <View>
        <ListDialog
          onCloseEvent={() => {
            setIsDropBoxVisible(false);
          }}
          buttonText={getStringMessage('btn_close')}
          isVisible={isDropBoxVisible}
          title={getStringMessage('lbl_select_status')}
          list={commonlist}
          onItemClick={item => {
            setStatus(item.label);
            setIsDropBoxVisible(false);
          }}
        />
      </View>
    );
  }

  function datePicker() {
    if (isDatePickerVisible) {
      return <RNDateTimePicker value={new Date()} />;
    } else {
      return null;
    }
  }

  return (
    <Modal
      animationType={isVisible ? 'slide' : 'fade'}
      transparent={true}
      visible={isVisible}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'position' : 'height'}
        style={styles.mainContainer}>
        {renderDialg()}
        {datePicker()}
        <View style={styles.container}>
          <View style={{justifyContent: 'center'}}>
            <LoginHeader route={getStringMessage('add_meeting_title')} />
            <TouchableOpacity
              onPress={() => {
                onDialogCloseClick(false);
              }}
              style={styles.closeIconContainer}>
              <Image style={styles.closeIcon} source={imagePath.ic_Close} />
            </TouchableOpacity>
          </View>

          <View style={styles.viewContainer}>
            <InputField
              inputTitleVisible={true}
              isEditable={true}
              isImage={false}
              inputTitle={getStringMessage('lbl_meeting_name')}
              updateMasterState={value => {
                setMeetingName(value);
              }}
              value={meetingName}
            />

            <InputField
              inputTitleVisible={true}
              isEditable={true}
              isImage={false}
              inputTitle={getStringMessage('lbl_description')}
              updateMasterState={value => {
                setDescription(value);
              }}
              value={description}
            />

            <Pressable onPress={()=> {setDatePickerVisibility(true)}}>
              <InputField
                inputTitleVisible={true}
                isEditable={false}
                isImage={false}
                inputTitle={getStringMessage('lbl_date')}
                updateMasterState={value => {}}
                value={date}
              />
            </Pressable>

            <InputField
              inputTitleVisible={true}
              isEditable={false}
              isImage={false}
              inputTitle={getStringMessage('lbl_time')}
              updateMasterState={value => {}}
              value={time}
            />

            <DropdownField
              inputTitle={getStringMessage('lbl_status')}
              value={status}
              onClick={() => {
                console.log('status click');
                setIsDropBoxVisible(true);
              }}
            />

            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_save')}
              onClick={() => onDialogCloseClick(true)}
              isloading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomSheetAddMeetings;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    backgroundColor: colors.appBGColor,
    overflow: 'hidden',
    bottom: 0,
    width: wp(100),
    justifyContent: 'flex-end',
    paddingBottom: hp(2),
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },

  closeIcon: {
    height: hp(4),
    width: wp(7),
    resizeMode: 'contain',
    margin: 10,
  },
  closeIconContainer: {
    position: 'absolute',
    right: wp(2),
  },
  viewContainer: {
    padding: wp(3),
    backgroundColor: colors.appBGColor,
  },
});
