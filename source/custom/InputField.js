import {Image, Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import {font, fontSizes, colors} from '../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';

import React, {Component} from 'react';
import {string, func, bool, number} from 'prop-types';
import {imagePath} from '../utility/imagePath';

export default class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {placeholder: props.value.length == 0};
  }
  static propTypes = {
    isEditable: bool, //Textinput is editable or not
    inputTitleVisible: bool, //Textinput is editable or not
    inputTitle: string.isRequired, //Placeholder string
    rightText: string,
    textColor: string, //TextInput color
    value: string, //
    updateMasterState: func.isRequired, //Passvalue to superclass
    secure: bool, //Secure text entry like password
    maxLength: number, //Textinput character length
    isImage: bool, //SHow icon right side
  };

  //Set default value to props
  static defaultProps = {
    secure: false,
    maxLength: 500,
    isImage: false,
    value: '',
    isEditable: true,
    inputTitleVisible: true,
  };

  _onChangeText = updatedValue => {
    this.props.updateMasterState(updatedValue);
    this.setState({placeholder: updatedValue.length == 0});
  };

  render() {
    const {
      email,
      pass,
      number,
      phone,
      search,
      date,
      inputTitleVisible,
      inputTitle,
      rightText,
      value,
      secure,
      multiline,
      returnKey,
      maxLength,
      isImage,
      isEditable,
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
          !isEditable && styles.inputDisabled, // Apply disabled styles if not editable
        ]}>
        {inputTitleVisible && (
          <Text style={styles.hintLable}>{inputTitle}</Text>
        )}
        <View style={styles.inputBoxContainer}>
          {isImage && (
            <Image
              style={styles.tabIcon}
              source={
                phone
                  ? imagePath.ic_email_hint
                  : pass
                  ? imagePath.ic_password_hint
                  : search
                  ? imagePath.ic_Search
                  : date
                  ? imagePath.ic_calendar
                  : null
              }
            />
          )}
          {secure ? (
            <TextInput
              secureTextEntry={secure}
              password={secure}
              maxLength={maxLength}
              placeholder={inputTitle}
              placeholderTextColor={colors.lightGrayColor}
              keyboardType={inputType}
              autoCapitalize={
                inputType == 'email-address' ? 'none' : 'sentences'
              }
              onChangeText={this._onChangeText}
              defaultValue={value}
              style={rightText ? styles.inputLableFlex : styles.inputLable}
              editable={isEditable}
              multiline={multiline}
              returnKeyType={returnKey}
            />
          ) : (
            <TextInput
              secureTextEntry={secure}
              password={secure}
              placeholderTextColor={colors.lightGrayColor}
              maxLength={maxLength}
              placeholder={inputTitle}
              keyboardType={inputType}
              autoCapitalize={
                inputType == 'email-address' ? 'none' : 'sentences'
              }
              onChangeText={this._onChangeText}
              defaultValue={value}
              style={
                rightText
                  ? styles.inputLableFlex
                  : multiline
                  ? styles.inputLableMultiline
                  : styles.inputLable
              }
              editable={isEditable}
              multiline={multiline}
              returnKeyType={returnKey}
            />
          )}
          {rightText && <Text style={styles.rightTextLable}>{rightText}</Text>}
        </View>
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
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    height: hp(2),
    width: wp(3),
    resizeMode: 'contain',
  },
  hintLable: {
    fontFamily: font.Medium,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginBottom: hp(1),
  },
  rightTextLable: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_14,
    color: colors.btnColor,
  },
  inputLableFlex: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_14,
    color: colors.grayColor,
    marginHorizontal: 5,
    flex: 1,
  },
  inputLableMultiline: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_14,
    color: colors.grayColor,
    marginHorizontal: 5,
    minHeight: hp(15),
    width: '90%',
    textAlignVertical: 'top',
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
