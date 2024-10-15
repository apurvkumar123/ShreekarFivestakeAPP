import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import LoginHeader from '../LoginHeader';
import {getStringMessage} from '../../utility/Utility';
import ButtonBlue from '../Buttons/ButtonBlue';
import strings from '../../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
const MediaDialog = props => {
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={props.isVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{justifyContent: 'center'}}>
            <LoginHeader route={strings.lbl_choose_media} />
          </View>

          <View style={styles.viewContainer}>
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={strings.btn_camera}
              onClick={() => props.cameraButtonAction()}
            />
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={strings.btn_gallery}
              onClick={() => props.GalleryButtonAction()}
            />
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={strings.btn_cancel}
              onClick={() => props.cancelButtonAction()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaDialog;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: colors.appBGColor,
    width: wp(90),
    borderRadius: 6,
    overflow: 'hidden',
  },
  viewContainer: {
    padding: wp(3),
    backgroundColor: colors.whiteColor,
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
  hintLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
});
