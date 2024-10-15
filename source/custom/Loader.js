import React, {useEffect, useState} from 'react';
import {Animated, Easing, Modal, StyleSheet, View} from 'react-native';
import {colors, font, fontSizes} from '../utility/theme';

import withPreventDoubleClick from '../utility/withPreventDoubleClick';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
const TouchableOpacity = withPreventDoubleClick();
const Loader = ({isVisible}) => {
  const [rotateValueHolder, setRotateValueHolder] = useState(
    new Animated.Value(0),
  );

  function startImageRotateFunction() {
    Animated.loop(
      Animated.timing(rotateValueHolder, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();
  }

  useEffect(() => {
    startImageRotateFunction();
  });

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.container}>
        <Animated.Image
          source={imagePath.ic_loading}
          style={{
            height: 34,
            width: 34,
            transform: [
              {
                rotate: rotateValueHolder.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
          resizeMode={'contain'}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff50',
    justifyContent: 'center',
    alignItems: 'center',

    // backgroundColor:'#419E7490'
  },
  modalView: {
    backgroundColor: colors.whiteColor,
    width: '90%',
    height: hp(25),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkBoxContainerStyle: {
    flexDirection: 'row',

    marginBottom: hp(3),
    padding: hp(1),
  },
  iAgreeTextStyle: {
    marginStart: wp(2.58),
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  termsAndConditionTextStyle: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    textDecorationLine: 'underline',
  },
});

export default Loader;
