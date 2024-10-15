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
import strings from '../../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
const ProjectFundRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.container}>
      <View style={styles.middleContainer}>
        <Text style={styles.LableAmountDate}>
          {moment(props.item.RequestDate).format(dateFormat.DISPLAY)}
        </Text>

        <Text
          style={[
            styles.Lable,
            {
              color:
                props.item.PaymentMode == strings.lbl_credit_mode
                  ? colors.green_color
                  : colors.redColor,
            },
          ]}>
          {props.item.PaymentMode}
        </Text>

        <Text style={styles.subLable}>{'For: ' + props.item.ProjectName}</Text>
        <Text style={styles.subLable}>{'To: ' + props.item.CompanyName}</Text>
        {/* <Text style={styles.subLable}>
          {'Remark: ' + props.item.RequestRemarks}
        </Text> */}

        {/* {props.item.RequestStatus == 2 || props.item.RequestStatus == 4 ? (
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
        ) : null} */}

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
      <View style={{width: wp(30)}}>
        <Text //1 - Requested / 2 - Approved / 3 - Validated / 4 - Rejected kishanbhai / 5 - Released / 6 - Recieved   / 7 - Rejected dineshbhai
          style={
            props.item.RequestStatus == 1
              ? styles.LableAmountRequest
              : props.item.RequestStatus == 2
              ? styles.LableAmountApprove
              : props.item.RequestStatus == 3
              ? styles.LableAmountValidated
              : props.item.RequestStatus == 4 || props.item.RequestStatus == 7
              ? styles.LableAmountRejected
              : props.item.RequestStatus == 5
              ? styles.LableAmountReleased
              : styles.LableAmountReceived
          }>
          {props.item.RequestStatusText}
        </Text>
        {props.item.RequestStatus == 4 || props.item.RequestStatus == 7 ? (
          <Text
            style={
              props.item.RequestStatus == 1
                ? styles.LableAmountRequest
                : props.item.RequestStatus == 2
                ? styles.LableAmountApprove
                : props.item.RequestStatus == 3
                ? styles.LableAmountValidated
                : props.item.RequestStatus == 4 || props.item.RequestStatus == 7
                ? styles.LableAmountRejected
                : props.item.RequestStatus == 5
                ? styles.LableAmountReleased
                : styles.LableAmountReceived
            }>
            {'Amt: ' + props.item.RequestedAmount}
          </Text>
        ) : (
          <Text
            style={
              props.item.RequestStatus == 1
                ? styles.LableAmountRequest
                : props.item.RequestStatus == 2
                ? styles.LableAmountApprove
                : props.item.RequestStatus == 3
                ? styles.LableAmountValidated
                : props.item.RequestStatus == 4 || props.item.RequestStatus == 7
                ? styles.LableAmountRejected
                : props.item.RequestStatus == 5
                ? styles.LableAmountReleased
                : styles.LableAmountReceived
            }>
            {props.item.ValidatedAmount
              ? 'Requested Amt: ' +
                props.item.RequestedAmount +
                '\n' +
                'Approved Amt: ' +
                props.item.ValidatedAmount
              : 'Requested Amt: ' +
                props.item.RequestedAmount +
                '\n' +
                'Approved Amt: ' +
                props.item.ApprovedAmount}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default ProjectFundRow;
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
