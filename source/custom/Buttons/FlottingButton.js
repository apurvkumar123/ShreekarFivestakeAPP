import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import {imagePath} from '../../utility/imagePath';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
const TouchableOpacity = withPreventDoubleClick();
const FlottingButton = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={[styles.inputContainer, {bottom: props.isTabView ? 80 : 30}]}>
      <View
        style={[styles.inputBoxContainer, {backgroundColor: props.btnColor}]}>
        <Image style={styles.tabIcon} source={imagePath.ic_plus} />
      </View>
    </TouchableOpacity>
  );
};

export default FlottingButton;

const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    end: 20,
    bottom: 80,
  },
  inputBoxContainer: {
    backgroundColor: colors.tabBGColor,
    borderRadius: hp(7) / 2,
    height: hp(7),
    width: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  tabIcon: {
    height: hp(3),
    width: hp(3),
    resizeMode: 'contain',
  },
});
