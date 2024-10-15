import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {apiName} from '../network/serverConfig';
import {useState, useEffect} from 'react';
import Axios from '../network/Axios';
import commonStyle from '../styles/commonStyle';
import Loader from '../custom/Loader';
import Header from '../custom/Header';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../utility/theme';
import {stack} from '../constants/commonStrings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import SubscriptionRow from '../custom/customRow/SubscriptionRow';
import {getStringMessage, logout} from '../utility/Utility';
const SubscriptionList = () => {
  const navigation = useNavigation();
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [commonlist, setCommonlist] = useState([]);

  useEffect(() => {
    requestGetPlans();
  }, []);

  async function requestGetPlans() {
    setIsScreenLoading(true);
    console.log('REQ_GetPlans');
    return Axios.request('POST', apiName.getOrgSubscriptionPlans)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_GetPlans', res.data.result);
          setIsScreenLoading(false);
          setCommonlist(res.data.result);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        logout(navigation);
        console.log('RES_GetPlans_err', err);
      });
  }
  function randerDialog() {}
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <Loader isVisible={isScreenLoading} />
        <Header
          route={getStringMessage('lbl_subscription_list_title')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={false}
        />
        <View style={[styles.topContainer]}>
          <FlatList
            horizontal
            data={commonlist}
            renderItem={({item, index}) => (
              <SubscriptionRow
                value={item}
                isRightArrow={true}
                onClick={() => {
                  console.log('123123 ', item);
                  navigation.navigate(stack.SUBSCRIPTION_DETAILS, {
                    SubscriptionDetail: item,
                  });
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionList;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    paddingVertical: hp(3),
    marginTop: hp(15),
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
