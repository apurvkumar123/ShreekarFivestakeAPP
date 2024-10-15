import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {stack} from '../constants/commonStrings';
import Home from './Home';
import {useState} from 'react';
import strings from '../utility/screenStrings';
import CountryListRow from '../custom/customRow/CountryListRow';
import {colors, font, fontSizes} from '../utility/theme';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../utility/ResponsiveScreen';
import {imagePath} from '../utility/imagePath';
import Dashboard from './Dashboard';
import {logout} from '../utility/Utility';
import constant from '../constants/constant';

const NavDrawer = () => {
  const navigation = useNavigation();
  console.log('role==', constant.ROLE_ID);
  const Drawer = createDrawerNavigator();
  const profileOptions =
    // constant.USER_ID == constant.DINESHBHAI_ID && constant.ROLE_ID == 1 //super Admin
    //   ? [
    //       {id: 1, name: strings.lbl_menu_user},
    //       {id: 2, name: strings.lbl_menu_company},
    //       {id: 3, name: strings.lbl_menu_warehouse},
    //       {id: 4, name: strings.lbl_menu_materialCat},
    //       {id: 5, name: strings.lbl_menu_materialName},
    //       {id: 14, name: strings.lbl_menu_expense_category},
    //       {id: 6, name: strings.lbl_menu_driver},
    //       {id: 7, name: strings.lbl_menu_labour},
    //       {id: 8, name: strings.lbl_menu_project},
    //       {id: 9, name: strings.lbl_menu_Material_entry},
    //       {id: 10, name: strings.lbl_menu_MaterialList_transfer},
    //       {
    //         id: 13,
    //         name: strings.lbl_projectfund_header,
    //       },
    //       {id: 15, name: strings.lbl_menu_Expense},
    //       {id: 11, name: strings.lbl_settings_header},
    //       {id: 12, name: strings.lbl_menu_logout},
    //     ]
    //   : constant.USER_ID == constant.KISHANBHAI_ID && constant.ROLE_ID == 1 //super Admin
    //   ? [
    //       {id: 1, name: strings.lbl_menu_user},
    //       {id: 2, name: strings.lbl_menu_company},
    //       {id: 3, name: strings.lbl_menu_warehouse},
    //       {id: 4, name: strings.lbl_menu_materialCat},
    //       {id: 5, name: strings.lbl_menu_materialName},
    //       {id: 14, name: strings.lbl_menu_expense_category},
    //       {id: 6, name: strings.lbl_menu_driver},
    //       {id: 7, name: strings.lbl_menu_labour},
    //       {id: 8, name: strings.lbl_menu_project},
    //       {id: 9, name: strings.lbl_menu_Material_entry},
    //       {id: 10, name: strings.lbl_menu_MaterialList_transfer},
    //       {
    //         id: 13,
    //         name: strings.lbl_projectfund_header,
    //       },
    //       {id: 15, name: strings.lbl_menu_Expense},
    //       {id: 11, name: strings.lbl_settings_header},
    //       {id: 12, name: strings.lbl_menu_logout},
    //     ]
    //   :
    constant.ROLE_ID == 1 //super Admin
      ? [
          {
            id: 13,
            name: strings.lbl_projectfund_header,
          },
          {id: 15, name: strings.lbl_menu_Expense},
          {id: 9, name: strings.lbl_menu_Material_entry},
          {id: 10, name: strings.lbl_menu_MaterialList_transfer},
          {id: 3, name: strings.lbl_menu_warehouse},
          {id: 6, name: strings.lbl_menu_driver},
          {id: 7, name: strings.lbl_menu_labour},
          {id: 4, name: strings.lbl_menu_materialCat},
          {id: 5, name: strings.lbl_menu_materialName},
          {id: 14, name: strings.lbl_menu_expense_category},

          {id: 1, name: strings.lbl_menu_user},
          {id: 2, name: strings.lbl_menu_company},
          {id: 8, name: strings.lbl_menu_project},
          {id: 11, name: strings.lbl_settings_header},
          {id: 12, name: strings.lbl_menu_logout},
        ]
      : constant.ROLE_ID == 3 //site Incharge
      ? [
          {id: 13, name: strings.lbl_projectfund_header},
          {id: 15, name: strings.lbl_menu_Expense},
          {id: 9, name: strings.lbl_menu_Material_entry},
          {id: 10, name: strings.lbl_menu_MaterialList_transfer},
          {id: 11, name: strings.lbl_settings_header},
          {id: 12, name: strings.lbl_menu_logout},
        ]
      : constant.ROLE_ID == 6 //Account Person
      ? [
          {id: 13, name: strings.lbl_projectfund_header},
          {id: 15, name: strings.lbl_menu_Expense},
          {id: 12, name: strings.lbl_menu_logout},
        ]
      : [
          {id: 9, name: strings.lbl_menu_Material_entry},
          {id: 10, name: strings.lbl_menu_MaterialList_transfer},
          {id: 11, name: strings.lbl_settings_header},
          {id: 12, name: strings.lbl_menu_logout},
        ];

  const MenuDrawer = () => (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.whiteColor}}>
        <View style={{backgroundColor: ''}}>
          <Image style={styles.logoIcon} source={imagePath.ic_app_icon} />
        </View>
        <View
          style={{
            width: '85%',
            marginHorizontal: widthPercentageToDP(2),
          }}>
          {menuList}
        </View>
      </SafeAreaView>
    </View>
  );
  const menuList = profileOptions.map(data => {
    return (
      <CountryListRow
        value={data.name}
        isRightArrow={false}
        onClick={() => {
          console.log('123123 ', data.name);
          if (data.id == 1) {
            navigation.navigate({name: stack.ADMIN_USER});
          } else if (data.id == 2) {
            navigation.navigate({name: stack.COMPANIES});
          } else if (data.id == 3) {
            navigation.navigate({name: stack.WAREHOUSE});
          } else if (data.id == 4) {
            navigation.navigate({name: stack.MATERIAL_CATEGORY});
          } else if (data.id == 5) {
            navigation.navigate({name: stack.MATERIAL_NAME});
          } else if (data.id == 6) {
            navigation.navigate({name: stack.DRIVER_LIST});
          } else if (data.id == 7) {
            navigation.navigate({name: stack.LABOUR_LIST});
          } else if (data.id == 8) {
            navigation.navigate({name: stack.PROJECT_LIST});
          } else if (data.id == 9) {
            navigation.navigate({name: stack.MATERIAL_WAREHOUSE});
          } else if (data.id == 10) {
            navigation.navigate({name: stack.MATERIAL_TRANSFER});
          } else if (data.id == 11) {
            navigation.navigate({name: stack.SETTINGS});
          } else if (data.id == 13) {
            navigation.navigate({name: stack.PROJECT_FUND});
          } else if (data.id == 14) {
            navigation.navigate({name: stack.EXPENSE_CATEGORY});
          } else if (data.id == 15) {
            navigation.navigate({name: stack.EXPENSE_LIST});
          } else {
            console.log('123123 ', data.name);
            logout(navigation);
          }
        }}
      />
    );
  });
  return (
    <Drawer.Navigator drawerContent={MenuDrawer}>
      <Drawer.Screen
        name={stack.DASHBOARD}
        component={Dashboard}
        options={({navigation}) => ({
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.blackColor,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontFamily: font.Medium,
            fontSize: fontSizes.pt_16,
            color: colors.whiteColor,
            textAlign: 'center',
          },
          // headerLeft: () => (
          //   <Ionicons
          //     name={'md-menu'}
          //     size={24}
          //     style={{marginLeft: 10}}
          //     onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          //   />
          // ),
        })}
      />
      {/* options={{headerShown: true}}
       /> */}
      <Drawer.Screen
        name={stack.HOME}
        component={Home}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default NavDrawer;

const styles = StyleSheet.create({
  logoIcon: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(30),
    resizeMode: 'contain',
    marginBottom: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(4),
    marginRight: heightPercentageToDP(2),
    alignSelf: 'center',
  },
  tabIcon: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(8),
    resizeMode: 'contain',
    position: 'absolute',
    right: widthPercentageToDP(3),
  },
});
