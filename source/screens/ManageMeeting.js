import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../custom/Header';
import {getStringMessage} from '../utility/Utility';
import {useNavigation} from '@react-navigation/native';
import FlottingButton from '../custom/Buttons/FlottingButton';
import {colors} from '../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import Loader from '../custom/Loader';
import {apiName} from '../network/serverConfig';
import constant from '../constants/constant';
import Axios from '../network/Axios';
import BottomSheetAddMeetings from '../custom/Dialogs/BottomSheetAddMeetings';

const ManageMeeting = () => {
  const navigation = useNavigation();
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [isVisibleBottom, setIsVisibleBottom] = useState(false);

  function randerDialog() {
    return (
      <View>
        <BottomSheetAddMeetings isVisible={isVisibleBottom} 
         onDialogCloseClick={isSuccess => {
          setIsVisibleBottom(false);
          if (isSuccess) {
            // importData();
            console.log('Add Meeting');
          }
        }}/>
        <Loader isVisible={isScreenLoading} />
      </View>
    );
  }

  async function requestGetMeetingsData() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('REQ_getMeetings', data);
    return Axios.requestData('POST', apiName.meeting, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getMeetings', res.data.result);
          setMeetings(res.data.result);
          setIsScreenLoading(false);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getMeetings_err', err);
      });
  }

  useEffect(() => {
    requestGetMeetingsData();
  }, []);

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {randerDialog()}
      <View style={styles.safeareaBaseviewContainer}>
        <Header
          route={getStringMessage('lbl_meetings_title')}
          isIconDisplay={true}
          nav={navigation}
          isBackShow={true}
        />

        <View style={styles.bottomContainer}>
          {/* {loadListing(adminUserData)} */}
          <FlottingButton
            isTabView={false}
            btnColor={colors.btnColor}
            onClick={() => {setIsVisibleBottom(!isVisibleBottom)}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ManageMeeting;

const styles = StyleSheet.create({
  safeareaviewContainer: {
    flex: 1,
  },
  safeareaBaseviewContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
});
