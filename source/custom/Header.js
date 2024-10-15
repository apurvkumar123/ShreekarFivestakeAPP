import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {imagePath} from '../utility/imagePath';
import {font, fontSizes, colors} from '../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
const TouchableOpacity = withPreventDoubleClick();
const Header = props => {
  return (
    <View style={styles.container}>
      {/* <View style={styles.tabHolder} /> */}
      <View
        style={{
          paddingVertical: 20,
          width: '100%',
          justifyContent: 'center',
        }}>
        <Text style={styles.tabLable}>{props.route}</Text>
        {props.isBackShow && (
          <TouchableOpacity
            style={styles.tabIconHolder}
            onPress={() => {
              props.nav.goBack();
            }}>
            <Image style={styles.tabIcon} source={imagePath.ic_Back} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.blackColor,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabHolder: {
    alignItems: 'center',
    backgroundColor: colors.appBGColor,
    justifyContent: 'center',
    overflow: 'hidden',
    height: hp(4),
  },
  tabIconHolder: {
    height: hp(3),
    width: wp(15),
    position: 'absolute',
    justifyContent: 'center',
  },
  tabIcon: {
    height: hp(2),
    width: wp(10),
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
  },
  tabLable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_16,
    color: colors.whiteColor,
    textAlign: 'center',
  },
});
