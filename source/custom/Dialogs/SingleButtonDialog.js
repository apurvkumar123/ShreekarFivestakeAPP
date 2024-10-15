import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import ButtonBlue from '../Buttons/ButtonBlue';
import LoginHeader from '../LoginHeader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
const TouchableOpacity = withPreventDoubleClick();
const SingleButtonDialog = props => {
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
            <LoginHeader route={props.title} />
          </View>

          <View style={styles.viewContainer}>
            <Text style={styles.hintLable}>{props.message}</Text>
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={props.buttonText}
              onClick={() => props.submitButtonAction()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SingleButtonDialog;

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
