import React from 'react';

import {View, Pressable, Dimensions, StyleSheet} from 'react-native';
import NavigationIcon from './NavigationIcon';
import {imagePath} from '../utility/imagePath';
import {stack} from '../constants/commonStrings';
import {colors} from '../utility/theme';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../utility/ResponsiveScreen';

const {width} = Dimensions.get('window');

const TabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        let icon = '';
        if (state.index === index) {
          icon =
            route.name == stack.HOME
              ? imagePath.ic_home_focus
              : route.name == stack.PROJECTS
              ? imagePath.ic_project_focus
              : route.name == stack.PAYMENTS
              ? imagePath.ic_payment_focus
              : route.name == stack.REPORTS
              ? imagePath.ic_reports_focus
              : imagePath.ic_profile_focus;
        } else {
          icon =
            route.name == stack.HOME
              ? imagePath.ic_home
              : route.name == stack.PROJECTS
              ? imagePath.ic_project
              : route.name == stack.PAYMENTS
              ? imagePath.ic_payment
              : route.name == stack.REPORTS
              ? imagePath.ic_reports
              : imagePath.ic_profile;
        }
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={index} style={[styles.mainItemContainer]}>
            <Pressable
              onPress={onPress}
              style={{
                opacity: isFocused ? 1 : 0.6,
              }}>
              <View style={styles.tabContainer}>
                <NavigationIcon
                  routeIcon={icon}
                  route={label}
                  isFocused={isFocused}
                />
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.tabBGColor,
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(2),
  },
});

export default TabBar;
