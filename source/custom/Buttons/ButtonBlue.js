import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {heightPercentageToDP as hp} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
const TouchableOpacity = withPreventDoubleClick();
const ButtonBlue = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.inputContainer}>
      <View
        style={[styles.inputBoxContainer, {backgroundColor: props.btnColor}]}>
        {props.isloading ? (
          <View>
            <ActivityIndicator
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              color={colors.whiteColor}
              animating={true}
            />
          </View>
        ) : (
          <Text style={styles.inputLable}>{props.btnText}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ButtonBlue;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: hp(2),
    backgroundColor: Colors.whiteColor,
  },
  inputBoxContainer: {
    backgroundColor: colors.tabBGColor,
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  inputLable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.whiteColor,
    marginHorizontal: 5,
  },
});
