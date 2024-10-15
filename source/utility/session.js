import AsyncStorage from '@react-native-async-storage/async-storage';

export const RESPONSE_TYPE = {SUCCESS: 1, ERROR: 0, EXCEPTION: -1};

export const SESSION_NAME = {
  CHECK_VERSION: 'checkVersion',
  // MESSAGE_UPDATE_DATE: 'messageUpdateDate',
  DEVICE_TOKEN: 'deviceToken',
  USER_INFO: 'userInfo',
  ACCESS_TOKEN: 'accessToken',
  REGISTER_FEE_OBJ: 'registerFee',
  SUBSCRIPTION_FEE_OBJ: 'subscriptionFee',
  // ISLOGIN : 'isLogin',
  // ISCHECK : 'isCheck',
  // SERVICE_TYPE :'serviceType',
  // HAS_LOCATION_PERMISSIONS :'hasLocationPermissions',
  // CURRENT_LATITUDE : 'currentLatitude',
  // CURRENT_LONGITUDE : 'currentLong',
  // CURRENT_ADDRESS : 'currentAddress',
  // SELECTED_DATA : 'selectedData',
  // isEditData : 'isEditData',
  // ABOUT_US : 'ABOUT_US',
  // CONTACT_US : 'CONTACT_US',
  // TERM_CONDITION : 'TERMS_CONDITION',
  // LOCATION_ID : 'LOCATION_ID',
  // IS_FIRST_TIME_PERMISSION : 'IS_FIRST_TIME_PERMISSION',
};

export const getPrefData = (sessionName, cb) => {
  try {
    AsyncStorage.getItem(sessionName, (error, value) => {
      if (error) {
        cb(RESPONSE_TYPE.ERROR, error);
      } else {
        cb(RESPONSE_TYPE.SUCCESS, JSON.parse(value));
      }
    });
  } catch (exception) {
    cb(RESPONSE_TYPE.EXCEPTION, e);
  }
};

export const setPrefData = (sessionName, sessionData, cb) => {
  try {
    AsyncStorage.setItem(sessionName, JSON.stringify(sessionData), error => {
      if (error) {
        cb(RESPONSE_TYPE.ERROR, error);
      } else {
        cb(RESPONSE_TYPE.SUCCESS, sessionData);
      }
    });
  } catch (e) {
    cb(RESPONSE_TYPE.EXCEPTION, e);
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};
export async function removeAllData() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (exception) {
    return false;
  }
}
