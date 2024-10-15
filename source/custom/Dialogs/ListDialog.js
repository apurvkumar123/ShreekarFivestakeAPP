import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ButtonBlue from '../Buttons/ButtonBlue';
import InputField from '../InputField';
import LoginHeader from '../LoginHeader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utility/ResponsiveScreen';
import {colors, font, fontSizes} from '../../utility/theme';
import withPreventDoubleClick from '../../utility/withPreventDoubleClick';
import CountryListRow from '../customRow/CountryListRow';
const TouchableOpacity = withPreventDoubleClick();
const ListDialog = props => {
  const [masterData, setMasterData] = useState([]);
  const [fliterData, setFilterData] = useState([]);
  const [search, setSearch] = useState([]);
  useEffect(() => {
    setMasterData(props.list);
    setFilterData(props.list);
  }, [props.list]);

  const searchText = text => {
    if (text) {
      const newData = masterData.filter(item => {
        const itemData = item.label
          ? item.label.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        // console.log("Search====> " + textData);
        return itemData.indexOf(textData) > -1;
      });
      setSearch(text);
      setFilterData(newData);
    } else {
      setSearch(text);
      setFilterData(masterData);
    }
  };
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={props.isVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}>
      <View style={styles.mainContainer}>
        <View
          style={styles.keycontainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            {/* <View style={styles.container}> */}
            <View style={{justifyContent: 'center'}}>
              <LoginHeader route={props.title} />
            </View>

            <View
              style={
                props.isSearch ? styles.viewContainer : styles.viewContainerTiny
              }>
              {props.isSearch && (
                <InputField
                  search
                  inputTitleVisible={false}
                  isEditable={true}
                  isImage={true}
                  inputTitle={'Search'}
                  updateMasterState={value => searchText(value)}
                  value={search}
                />
              )}
              <FlatList
                style={{
                  backgroundColor: 'white',
                }}
                data={fliterData}
                renderItem={({item, index}) => (
                  <CountryListRow
                    value={item.label}
                    subValue={item.qty == 0 ? '0' : item.qty}
                    isRightArrow={true}
                    onClick={() => {
                      console.log('123123 ', item.value);
                      props.onItemClick(item);
                      setFilterData([]);
                      setMasterData([]);
                      setSearch([]);
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <ButtonBlue
                btnColor={colors.btnColor}
                btnText={props.buttonText}
                onClick={() => props.onCloseEvent()}
              />
            </View>
            {/* </View> */}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ListDialog;

const styles = StyleSheet.create({
  keycontainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: colors.appBGColor,
    width: wp(90),
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  viewContainer: {
    padding: wp(3),
    backgroundColor: colors.whiteColor,
    height: hp(80),
  },
  viewContainerTiny: {
    padding: wp(3),
    backgroundColor: colors.whiteColor,
    maxHeight: hp(80),
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
  hintLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
});
