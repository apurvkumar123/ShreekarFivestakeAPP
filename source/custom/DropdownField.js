import {Image, Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import {font, fontSizes, colors} from '../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';

import React, {Component} from 'react';
import {string, func, bool, number} from 'prop-types';
import {imagePath} from '../utility/imagePath';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';

const TouchableOpacity = withPreventDoubleClick();
export default class DropdownField extends Component {
  constructor(props) {
    super(props);
    this.state = {placeholder: props.value.length == 0};
  }
  static propTypes = {
    inputTitle: string.isRequired, //Placeholder string
    textColor: string, //TextInput color
    value: string, //
    updateMasterState: func.isRequired, //Passvalue to superclass
    secure: bool, //Secure text entry like password
    maxLength: number, //Textinput character length
    isImage: bool, //SHow icon right side
    isDisable: bool, //SHow icon right side
    isTitleShow: bool,
  };

  //Set default value to props
  static defaultProps = {
    secure: false,
    maxLength: 50,
    isImage: false,
    value: '',
    isDisable: false,
    isTitleShow: true,
  };

  _onChangeText = updatedValue => {
    this.props.updateMasterState(updatedValue);
    this.setState({placeholder: updatedValue.length == 0});
  };

  render() {
    const {
      email,
      number,
      phone,
      inputTitle,
      value,
      secure,
      maxLength,
      isDisable,
      isTitleShow,
    } = this.props;

    const inputType = email
      ? 'email-address'
      : number
      ? 'numeric'
      : phone
      ? 'phone-pad'
      : 'default';
    return (
      <View
        style={[
          styles.inputContainer,
          isDisable && styles.inputDisabled, // Apply disabled styles if not editable
        ]}>
        {isTitleShow && <Text style={styles.hintLable}>{inputTitle}</Text>}
        <TouchableOpacity
          disabled={isDisable}
          onPress={() => {
            this.props.onClick();
          }}
          style={styles.inputBoxContainer}>
          <TextInput
            secureTextEntry={secure}
            password={secure}
            maxLength={maxLength}
            placeholder={inputTitle}
            placeholderTextColor={colors.lightGrayColor}
            keyboardType={inputType}
            autoCapitalize={inputType == 'email-address' ? 'none' : 'sentences'}
            onChangeText={this._onChangeText}
            defaultValue={value}
            style={styles.inputLable}
            editable={false}
          />
          {isDisable == false && (
            <Image style={styles.tabIcon} source={imagePath.ic_Dropdown} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputContainer: {
    marginTop: hp(2),
  },
  inputBoxContainer: {
    borderColor: colors.blackColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    opacity: 1,
  },
  inputBoxContainerDisable: {
    borderColor: colors.blackColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    opacity: 0.6,
  },
  tabIcon: {
    height: hp(2),
    width: wp(3),
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  hintLable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
  inputLable: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_14,
    color: colors.grayColor,
    marginHorizontal: 5,
    width: '90%',
  },
  inputDisabled: {
    opacity: 0.5,
  },
});
