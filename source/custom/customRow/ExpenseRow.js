import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import {colors, font, fontSizes} from '../../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {dateFormat} from '../../constants/commonStrings';
import moment from 'moment';
const TouchableOpacity = withPreventDoubleClick();
const ExpenseRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.container}>
      <View style={styles.middleContainer}>
        <Text style={styles.LableAmountDate}>{props.item.displaydate}</Text>
        <Text style={[styles.Lable]}>{props.item.ExpenseName}</Text>
        {props.item.voucherNumber != '' && (
          <Text style={styles.subLable}>
            {'Voucher No.: ' + props.item.voucherNumber}
          </Text>
        )}

        <Text style={styles.subLable}>
          {'Project: ' + props.item.ProjectName}
        </Text>
        <Text style={styles.subLable}>{'Remark: ' + props.item.Remarks}</Text>
      </View>
      <View style={{width: wp(15)}}>
        <Text style={styles.Lable}>{'₹' + props.item.Amount}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default ExpenseRow;
const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.textInputBorderColor,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignItems: 'center',
  },
  LableAmountDate: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
  },
  Lable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginBottom: hp(0.5),
  },
  subLable: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
  },

  middleContainer: {flex: 1},
  LableAmountRequest: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.requested,
  },

  LableAmountValidated: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.validated,
  },
  LableAmountApprove: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.approved,
  },
  LableAmountRejected: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.rejected,
  },
  LableAmountReleased: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.released,
  },
  LableAmountReceived: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.received,
  },
  termsAndConditionTextStyle: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.link_btn,
  },
});
