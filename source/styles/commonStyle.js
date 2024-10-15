import {StyleSheet, Platform, Dimensions} from 'react-native';

import {dimens, fontsizes} from '../constants/dimens';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../utility/theme';

const styles = StyleSheet.create({
  superViewBackground: {
    flex: 1,
    backgroundColor: colors.appBGColor,
  },
  subLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
    marginHorizontal: wp(3),
  },
  backgroundStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  commonBackgroundStyle: {
    flex: 1,
    backgroundColor: colors.appBGColor,
    marginBottom: Platform.OS == 'ios' ? 15 : 0,
  },
  imageBackgroundStyle: {flex: 1},
  marginHorizontal: {
    marginHorizontal: wp(3.34),
  },
  bottomViewDetails: {
    marginHorizontal: wp(3.34),
    flexDirection: 'row',
    marginTop: hp(2),
    borderTopColor: colors.lightGrayColor,
    borderTopWidth: hp(0.1),
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
  bottomSingleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(7),
  },
  optionIcon: {
    margin: 3,
    height: hp(2.5),
    width: hp(2.5),
  },
  NoListTextStyleMedium: {
    color: colors.blackColor,
    fontSize: fontSizes.pt_14,
    fontFamily: font.Medium,
    alignSelf: 'center',
    marginVertical: hp(2),
  },
  NoListTextStyleCenter: {
    color: colors.blackColor,
    fontSize: fontSizes.pt_18,
    fontFamily: font.Semi_Bold,
    alignSelf: 'center',
    marginVertical: hp(10),
  },
  titleTextStyleMedium: {
    color: colors.blackColor,
    fontSize: fontSizes.pt_18,
    fontFamily: font.Semi_Bold,
  },
  box: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.btnColor,
    margin: hp(1),
    paddingStart: 10,
    paddingTop: 10,
  },
  shadowProp: {
    shadowColor: colors.blackColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default styles;
