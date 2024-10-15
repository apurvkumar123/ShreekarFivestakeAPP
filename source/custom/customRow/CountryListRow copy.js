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
const TouchableOpacity = withPreventDoubleClick();
const CountryListRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        {props.textColor ? (
          <Text
            style={[
              props.isBigText ? styles.Lable16 : styles.Lable,
              {color: props.textColor},
            ]}>
            {props.value}
          </Text>
        ) : (
          <Text style={props.isBigText ? styles.Lable16 : styles.Lable}>
            {props.value}
          </Text>
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
    </TouchableOpacity>
  );
};

export default CountryListRow;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.textInputBorderColor,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: hp(2),
  },
  Lable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    flex: 1,
  },
  Lable16: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_16,
    color: colors.blackColor,
    flex: 1,
  },
  subLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
    opacity: 0.6,
    marginHorizontal: wp(3),
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
});
