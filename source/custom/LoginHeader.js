import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {imagePath} from '../utility/imagePath';
import {font, fontSizes, colors} from '../utility/theme';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
const LoginHeader = ({route, isIconDisplay}) => {
  return (
    <View style={styles.tabHolder}>
      {isIconDisplay && (
        <Image style={styles.tabIcon} source={imagePath.ic_app_icon} />
      )}
      {route != '' && <Text style={styles.tabLable}>{route}</Text>}
    </View>
  );
};

export default LoginHeader;

const styles = StyleSheet.create({
  tabHolder: {
    alignItems: 'center',
    backgroundColor: colors.blackColor,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabIcon: {
    height: hp(10),
    width: wp(40),
    resizeMode: 'contain',
    marginBottom: hp(1),
    marginTop: hp(4),
    marginRight: hp(2),
  },
  tabLable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_16,
    color: colors.whiteColor,
    // borderBottomColor: colors.tabBGColor,
    // borderBottomWidth: hp(0.5),
    paddingVertical: hp(1),
    marginVertical: hp(1),
  },
});
