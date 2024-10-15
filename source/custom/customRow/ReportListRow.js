import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {imagePath} from '../../utility/imagePath';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import {colors, font, fontSizes} from '../../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {all} from 'axios';
import {dateFormat} from '../../constants/commonStrings';
import moment from 'moment';
import constant from '../../constants/constant';
const TouchableOpacity = withPreventDoubleClick();
const ReportListRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.container}>
      {console.log('props.item', props.item)}
      <View style={styles.middleContainer}>
        <Text style={styles.LableAmountDate}>
          {moment(props.item.created_at).format(dateFormat.DISPLAY)}
        </Text>
        {props.item.firstname != null && (
          <Text style={styles.Lable}>
            {props.item.firstname + ' ' + props.item.lastname}
          </Text>
        )}

        <Text
          style={
            props.item.entrytype == 'credit'
              ? styles.LableAmountCR
              : styles.LableAmountDB
          }>
          {props.item.transactiontype}
        </Text>
      </View>
      <Text
        style={
          props.item.entrytype == 'credit'
            ? styles.LableAmountCR
            : styles.LableAmountDB
        }>
        {constant.CURRENCY_SYMBOL + props.item.amount}
      </Text>
    </TouchableOpacity>
  );
};

export default ReportListRow;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.textInputBorderColor,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignItems: 'center',
  },
  Lable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_16,
    color: colors.blackColor,
    marginBottom: hp(0.5),
  },
  subLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
  },
  arrowIcon: {
    height: hp(2),
    width: wp(3),
    resizeMode: 'contain',
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  orgLogo: {
    width: wp(30),
    height: wp(30),
    resizeMode: 'cover',
    borderRadius: 10,
    marginStart: wp(3),
  },
  middleContainer: {flex: 1},
  LableAmountCR: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  LableAmountDate: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  LableAmountDB: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.redColor,
  },
});
