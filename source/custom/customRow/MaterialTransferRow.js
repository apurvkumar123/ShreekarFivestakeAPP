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
import constant from '../../constants/constant';
import strings from '../../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
const MaterialTransferRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.container}>
      <View style={styles.middleContainer}>
        <Text style={styles.LableAmountDate}>{props.item.CreatedDate}</Text>

        <Text style={[styles.Lable]}>
          {props.item.CategoryName + ' (' + props.item.MaterialName + ')'}
        </Text>

        <Text style={styles.subLable}>
          {'By: ' + props.item.request_by + ' (' + props.item.to_name + ')'}
        </Text>
        <Text style={styles.subLable}>
          {'To: ' +
            props.item.from_request_type +
            ' (' +
            props.item.from_name +
            ')'}
        </Text>
        <Text style={styles.subLable}>
          {'Remark: ' + props.item.RequestRemarks}
        </Text>

        {props.item.RequestStatus == 2 || props.item.RequestStatus == 4 ? (
          <View style={{marginTop: hp(1)}}>
            <Text style={styles.subLable}>
              {'Approved By: ' + props.item.approvedBy}
            </Text>
            <Text style={styles.subLable}>
              {'(' +
                props.item.approvedDate +
                ')\nRemark: ' +
                props.item.ApproveRemarks}
            </Text>
          </View>
        ) : null}
        {props.item.RequestStatus == 3 || props.item.RequestStatus == 5 ? (
          <View style={{marginTop: hp(1)}}>
            <Text style={styles.subLable}>
              {props.item.RequestStatusText + ' By: ' + props.item.approvedBy}
            </Text>
            <Text style={styles.subLable}>
              {'(' +
                props.item.approvedDate +
                ')\nRemark: ' +
                props.item.ApproveRemarks}
            </Text>
          </View>
        ) : null}
        {props.item.RequestStatus == 4 ? (
          <View style={{marginTop: hp(1)}}>
            <Text style={styles.subLable}>
              {props.item.RequestStatusText + ' By: ' + props.item.deliveredBy}
            </Text>
            <Text style={styles.subLable}>
              {'(' +
                props.item.deliveredDate +
                ')\nRemark: ' +
                props.item.deliveredRemarks}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginTop: hp(1),
          }}>
          {false && (
            <TouchableOpacity
              onPress={() => {
                props.onClickView();
              }}>
              <Text style={styles.termsAndConditionTextStyle}>
                {strings.lbl_view}
              </Text>
            </TouchableOpacity>
          )}
          <View style={{width: wp(3)}} />
          {false ? (
            <TouchableOpacity
              onPress={() => {
                props.onClickChange();
              }}>
              <Text style={styles.termsAndConditionTextStyle}>
                {strings.lbl_change_Status}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View>
        <Text
          style={
            props.item.RequestStatus == 1
              ? styles.LableAmountCR
              : props.item.RequestStatus == 2
              ? styles.LableAmountSS
              : props.item.RequestStatus == 3
              ? styles.LableAmountDB
              : props.item.RequestStatus == 4
              ? styles.LableAmountDE
              : styles.LableAmountCE
          }>
          {'Requested Qty: ' + props.item.Quantity}
        </Text>
        {/* {props.item.approvedQty != 0 && (
          <Text
            style={
              props.item.RequestStatus == 1
                ? styles.LableAmountCR
                : props.item.RequestStatus == 2
                ? styles.LableAmountSS
                : props.item.RequestStatus == 3
                ? styles.LableAmountDB
                : props.item.RequestStatus == 4
                ? styles.LableAmountDE
                : styles.LableAmountCE
            }>
            {props.item.RequestStatusText + ' Qty: ' + props.item.approvedQty}
          </Text>
        )} */}
        {props.item.deliveredQty != 0 && (
          <Text
            style={
              props.item.RequestStatus == 1
                ? styles.LableAmountCR
                : props.item.RequestStatus == 2
                ? styles.LableAmountSS
                : props.item.RequestStatus == 3
                ? styles.LableAmountDB
                : props.item.RequestStatus == 4
                ? styles.LableAmountDE
                : styles.LableAmountCE
            }>
            {props.item.RequestStatusText + ' Qty: ' + props.item.deliveredQty}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MaterialTransferRow;

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
  LableAmountCR: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.orangeColor,
  },

  LableAmountDB: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.redColor,
  },
  LableAmountSS: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.green_color,
  },
  LableAmountDE: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.grayColor,
  },
  LableAmountCE: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.cancelledColor,
  },
  termsAndConditionTextStyle: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.link_btn,
  },
});
