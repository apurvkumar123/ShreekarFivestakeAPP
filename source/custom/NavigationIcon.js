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
const NavigationIcon = ({routeIcon, route, isFocused}) => {
  return (
    <View style={styles.tabHolder}>
      <Image style={styles.tabIcon} source={routeIcon} />
      <Text style={styles.tabLable}>{route}</Text>
    </View>
  );
};

export default NavigationIcon;

const styles = StyleSheet.create({
  tabHolder: {alignItems: 'center'},
  tabIcon: {
    height: hp(2),
    width: wp(10),
    resizeMode: 'contain',
    marginBottom: 5,
  },
  tabLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_11,
    color: colors.whiteColor,
  },
});
