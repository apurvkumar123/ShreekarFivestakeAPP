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
import {getStringMessage} from '../../utility/Utility';
import strings from '../../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
const CountryListRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={{
        borderBottomColor: colors.textInputBorderColor,
        borderBottomWidth: 1,
        paddingVertical: hp(1.5),
      }}>
      <View style={styles.container}>
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: props.isComment == undefined ? 'center' : 'baseline',
          }}>
          {props.istick && (
            <Image
              style={styles.editIcon}
              source={
                props.isSelected
                  ? imagePath.ic_checkbox
                  : imagePath.ic_unchecked
              }
            />
          )}
          {props.textColor ? (
            <Text
              style={[
                props.isBigText ? styles.Lable16 : styles.Lable,
                {color: props.textColor},
              ]}>
              {props.value}
            </Text>
          ) : (
            <View style={{flex: 1}}>
              {props.date && (
                <Text style={styles.LableAmountDate}>{props.date}</Text>
              )}
              <Text style={props.isBigText ? styles.Lable16 : styles.Lable}>
                {props.value}
              </Text>
              {props.isEmail == true ? (
                <Text style={styles.subLable}>{props.email}</Text>
              ) : null}

              {props.isComment != undefined ? (
                <View>
                  <Text
                    style={{
                      marginVertical: hp(0.5),
                      color: colors.redColor,
                      fontSize: fontSizes.pt_10,
                    }}>
                    {getStringMessage('lbl_balance_cant_change')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      color: colors.blackColor,
                    }}>
                    {props.comment}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {props.subValue && (
            <Text style={styles.subLable}>{props.subValue}</Text>
          )}
          {props.subValueRed && (
            <Text style={styles.subLableRed}>{props.subValueRed}</Text>
          )}
        </View>

        {props.isRightArrow && (
          <Image style={styles.arrowIcon} source={imagePath.ic_right_arrow} />
        )}

        {props.isEdit && (
          <TouchableOpacity
            onPress={() => {
              props.onClickEdit();
            }}>
            <Image style={styles.editIcon} source={imagePath.ic_update} />
          </TouchableOpacity>
        )}
        {props.isDelete && (
          <TouchableOpacity
            onPress={() => {
              props.onClickDelete();
            }}>
            <Image style={styles.editIcon} source={imagePath.ic_delete} />
          </TouchableOpacity>
        )}
      </View>
      {props.isbtnVisible && (
        <View style={{flex: 1, marginTop: wp(2)}}>
          <TouchableOpacity
            onPress={() => {
              props.teamButtonAction();
            }}>
            <Text style={styles.termsAndConditionTextStyle}>
              {strings.btn_add_team}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CountryListRow;

const styles = StyleSheet.create({
  termsAndConditionTextStyle: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_12,
    color: colors.link_btn,
  },
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  Lable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  Lable16: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_16,
    color: colors.blackColor,
    flex: 1,
  },
  subLable: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
    marginTop: wp(1),
  },
  subLableRed: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.redColor,
    marginHorizontal: wp(3),
  },
  arrowIcon: {
    height: hp(2),
    width: wp(3),
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  editIcon: {
    height: hp(2),
    width: wp(5),
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  LableAmountDate: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
  },
});
