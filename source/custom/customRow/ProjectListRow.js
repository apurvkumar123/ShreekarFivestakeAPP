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
const TouchableOpacity = withPreventDoubleClick();
const ProjectListRow = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onClick();
      }}
      style={styles.container}>
      <Image style={styles.orgLogo} source={{uri: props.item.imageurl}} />
      <View style={styles.middleContainer}>
        <Text style={styles.subLable}>
          {moment(props.item.startdate).format(dateFormat.DISPLAY) +
            ' - ' +
            moment(props.item.enddate).format(dateFormat.DISPLAY)}
        </Text>
        <Text style={styles.Lable}>{props.item.title}</Text>
        <Text style={styles.subLable} numberOfLines={3}>
          {props.item.description}
        </Text>
      </View>

      {props.isRightArrow && (
        <Image style={styles.arrowIcon} source={imagePath.ic_right_arrow} />
      )}
    </TouchableOpacity>
  );
};

export default ProjectListRow;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.textInputBorderColor,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: hp(2),
  },
  Lable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_16,
    color: colors.blackColor,
    marginTop: hp(1),
  },
  subLable: {
    fontFamily: font.Regular,
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
  middleContainer: {flex: 1, paddingHorizontal: wp(2)},
});
