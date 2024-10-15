import {Platform} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './ResponsiveScreen';

const colors = {
  // btnColor: '#d3ac92',
  btnColor: '#1DA1F2',
  tabBGColor: '#6b646b',
  appBGColor: '#EEF1FB',
  blackColor: '#000000',
  textInputBorderColor: '#0000001C',
  grayColor: '#31354E',
  cancelledColor: '#7F7F7F',
  blueColor: '#0067E0',
  redColor: '#E60019',
  yellowColor: '#FFE400',
  orangeColor: '#F09E38',
  lightPinkColor: '#FA8FBC',
  lightGrayColor: '#CCCCCC',
  lightGreenColor: '#97D17B20',
  whiteColor: '#ffffff',
  colorInActive: '#CCCCCC',
  colorInActiveTab: '#EAEDE8',
  colorBlackFiftyPercent: '#00000050',
  lightGrayBorderColor: '#00000015',
  green_color: '#00D986',
  facebookBlueColor: '#3B5998',
  payment_green: '#0BA735',
  link_btn: '#105CA9',

  requested: '#007BFF', // Blue
  approved: '#28A745', // Green
  validated: '#FFC107', // Orange
  rejected: '#DC3545', // Red
  released: '#6F42C1', // Purple
  received: '#6C757D', // Gray
};

const fontSizes = {
  pt_28: wp(7.2),
  pt_30: wp(7.7),
  pt_10: wp(2.6),
  pt_14: wp(3.6),
  pt_16: wp(4),
  pt_12: wp(3.1),
  pt_11: wp(3.0),
  pt_18: wp(4.7),
  pt_20: wp(5.15),
  pt_26: wp(6.7),
  pt_50: wp(12.9),
};

const font = {
  Regular: 'Montserrat-Regular',
  Light: 'Montserrat-Light',
  Medium: 'Montserrat-Medium',
  Bold: 'Montserrat-Bold',
  Italic: 'Montserrat-Italic',
  Semi_Bold: 'Montserrat-SemiBold',
  Extra_Light: 'Montserrat-ExtraLight',
  Extra_Bold: 'Montserrat-ExtraBold',
};

export {colors, fontSizes, font};
