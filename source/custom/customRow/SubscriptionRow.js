import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {imagePath} from '../../utility/imagePath';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import {colors, font, fontSizes} from '../../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import ButtonBlue from '../Buttons/ButtonBlue';
import {getStringMessage} from '../../utility/Utility';
const TouchableOpacity = withPreventDoubleClick();
const SubscriptionRow = props => {
  return (
    <TouchableOpacity
      // onPress={() => props.onClick()}
      style={[styles.card, styles.shadowProp]}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <Text style={styles.Lable}>
          {'$ ' + props.value.amount + '/' + props.value.title}
        </Text>
        <Text style={styles.Lable}>{props.value.description}</Text>
      </View>

      <ButtonBlue
        btnColor={colors.btnColor}
        btnText={getStringMessage('btn_getStarted')}
        onClick={() => props.onClick()}
      />
    </TouchableOpacity>
  );
};

export default SubscriptionRow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.whiteColor,
    borderRadius: 6,
    padding: 10,
    margin: 10,
    height: hp(25),
    width: wp(60),
  },
  shadowProp: {
    shadowColor: colors.blackColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  Lable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    textAlign: 'center',
  },
});
