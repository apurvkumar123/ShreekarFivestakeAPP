import React, {useEffect, useState} from 'react';
import {FlatList, Modal, StyleSheet, View} from 'react-native';
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
import strings from '../../utility/screenStrings';
const TouchableOpacity = withPreventDoubleClick();
const MultiListDialog = props => {
  const [masterData, setMasterData] = useState([]);
  const [fliterData, setFilterData] = useState([]);
  const [search, setSearch] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    setMasterData(props.list);
    setFilterData(props.list);
  }, [props.list]);

  const searchText = text => {
    if (text) {
      console.log('search', text);
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
      console.log('searche', text);
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
        <View style={styles.container}>
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
                  isRightArrow={true}
                  istick={true}
                  isSelected={item.isSelected}
                  onClick={() => {
                    var id = item.value;
                    console.log('123123 ', id);
                    // props.onItemClick(item);
                    const updatedList = fliterData.map(item => {
                      if (item.value == id) {
                        console.log('iii-', item.Id);
                        console.log('iii-', id);
                        return {...item, isSelected: !item.isSelected};
                      } else {
                        return item;
                      }
                    });
                    const updatedMList = masterData.map(item => {
                      if (item.value == id) {
                        console.log('iii-', item.Id);
                        console.log('iii-', id);
                        return {...item, isSelected: !item.isSelected};
                      } else {
                        return item;
                      }
                    });
                    console.log('123123 ', updatedList);
                    setFilterData(updatedList);
                    setMasterData(updatedMList);
                    // setSearch([]);
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={props.buttonText}
                  onClick={() => props.onCloseEvent()}
                />
              </View>
              <View style={{flex: 1, marginLeft: 10}}>
                <ButtonBlue
                  btnColor={colors.btnColor}
                  btnText={strings.btn_save}
                  onClick={() => {
                    const trueVal = masterData.filter(item => item.isSelected);
                    console.log('trueVal=', trueVal);
                    props.onItemClick(trueVal);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MultiListDialog;

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
    height: hp(80),
  },
  viewContainerTiny: {
    padding: wp(3),
    backgroundColor: colors.whiteColor,
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
