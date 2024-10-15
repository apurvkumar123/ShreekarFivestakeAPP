import {StyleSheet, Platform, Dimensions} from 'react-native';

import {dimens, fontsizes} from '../constants/dimens';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../utility/theme';

const tabStyles = StyleSheet.create({
  mainTabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp(1),
    height: hp(5),
  },
  tabContainerSelected: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp(1),
    borderBottomColor: colors.btnColor,
    borderBottomWidth: hp(0.5),
    height: hp(5),
  },
  tabTitle: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
});

export default tabStyles;
