import {Platform} from 'react-native';

export default {
  messageListArray: [],
  userData: {},
  googlePlaceApiKey: 'AIzaSyAGois22B3Ne2-tRCMfEYYbqlqcwEpc4QQ',
  ACCESS_TOKEN: '',
  filledData: null,
  previousSelectedDate: '',
  latitude: '',
  longitude: '',
  address: '',
  postalCode: '',
  orgID: 0,
  deviceToken: '',
  timeZone: '+5:30',
  deviceType: Platform.OS == 'android' ? 1 : 2,
  deviceName: '',
  deviceModel: '',
  deviceVersion: '',
  appVersion: '',
  deviceCode: '',
  devicePackage: '',
  NO_UPDATES: 0,
  ISUPDATE_AVAILABLE: 1,
  COMPUSLSORY_UPDATE: 2,
  UNDER_MAINTANENCE: 3,
  APP_APPROVED: 1,
  phone_number_limit: 10,
  User_ORGANIZATION: 'user',
  USER_SUBSCRIBED: 1,
  USER_UNSUBSCRIBED: 0,
  USER_TYPE: 'user',
  CAMERA_OPTION: 1,
  GALLERY_OPTION: 2,
  KEY_BTN_NEXT: 'next',
  KEY_BTN_DONE: 'done',
  CURRENCY_SYMBOL: '$',
  contact_url: '',
  ALL_MEMBER: 0,
  DUES_MEMBER: 1,
  REG_MEMBER: 2,
  OUTSTANDING_AMT_MEMBER: 3,
  CHECK_VERSION_RESPONSE: null,
  Register_data: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    mobilenumber: '',
    orgname: '',
    aboutorg: '',
    address1: '',
    address2: '',
    address3: '',
    lat: '',
    long: '',
    country: '',
    state: '',
    city: '',
    placeobject: '',
    deviceType: '',
    deviceToken: '',
    devicename: '',
    devicemodel: '',
    zelle_email: '',
    zelle_number: '',
  },

  USER_ID: 0,
  CLIENT_ID: 0,
  LANGUAGE_ID: 1,
  COMPANY_ID: 1,
  COMPANY_NAME: '',
  ROLE_ID: 0, //1s = Master Admin , 7 = Warehouse Person, 3 = Site Incharge , 6 = Account Person
  FROM_PROJECT: 'FromProject',
  TO_PROJECT: 'ToProject',

  KISHANBHAI_ID: 2,
  DINESHBHAI_ID: 1,
};
