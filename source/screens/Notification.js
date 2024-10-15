import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import commonStyle from '../styles/commonStyle';
import LoginHeader from '../custom/LoginHeader';

import React from 'react';

const Notification = () => {
  function LoadDailog() {}
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {LoadDailog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <LoginHeader route={''} isIconDisplay={true} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
export default Notification;
