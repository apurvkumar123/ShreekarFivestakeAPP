import React from 'react';
import {Image, Modal, StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import {colors, font, fontSizes} from '../utility/theme';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import LoginHeader from './LoginHeader';
const TouchableOpacity = withPreventDoubleClick();
const GogglePlaces = ({
  isVisible,
  onDialogCloseClick,
  onDialogAddressClick,
}) => {
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{justifyContent: 'center'}}>
            <LoginHeader route={'Search Address'} />
            <TouchableOpacity
              onPress={() => {
                onDialogCloseClick();
              }}
              style={styles.closeIconContainer}>
              <Image style={styles.closeIcon} source={imagePath.ic_Close} />
            </TouchableOpacity>
          </View>

          <View style={styles.viewContainer}>
            <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  fontFamily: font.Semi_Bold,
                  fontSize: fontSizes.pt_16,
                  color: colors.grayColor,
                  marginHorizontal: 5,
                  width: '90%',
                },
                textInputContainer: {
                  borderColor: colors.textInputBorderColor,
                  borderWidth: 1,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              }}
              placeholder="Search"
              onPress={(data, details = null) => {
                console.log('place =', JSON.stringify(details));
                onDialogAddressClick(details);
              }}
              fetchDetails={true}
              onFail={error => console.error('error=', error)}
              query={{
                key: 'AIzaSyALwe2o9-dUwlUytkpt0T9k79beeZ_LhQQ',
                language: 'en',
              }}
            />

            {/* <ButtonBlue
              btnColor={colors.btnColor}
              btnText={'Submit'}
              onClick={() => validation()}
              isloading={isLoading}
            /> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GogglePlaces;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: colors.appBGColor,
    width: wp(90),
    borderRadius: 6,
    overflow: 'hidden',
  },
  viewContainer: {
    padding: wp(3),
    backgroundColor: colors.whiteColor,
    height: hp(50),
  },
  closeIcon: {
    height: hp(4),
    width: wp(7),
    resizeMode: 'contain',
    margin: 10,
  },
  closeIconContainer: {
    position: 'absolute',
    right: wp(2),
  },
});
