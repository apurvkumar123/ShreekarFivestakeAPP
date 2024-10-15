import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import ButtonBlue from '../Buttons/ButtonBlue';
import LoginHeader from '../LoginHeader';
const TouchableOpacity = withPreventDoubleClick();
const DoubleButtonDialog = props => {
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
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flex: 1, marginEnd: wp(2)}}>
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={props.cancelbuttonText}
                  onClick={() => props.cancelButtonAction()}
                />
              </View>
              <View style={{flex: 1, marginStart: wp(2)}}>
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={props.submitbuttonText}
                  onClick={() => props.submitButtonAction()}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DoubleButtonDialog;

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
