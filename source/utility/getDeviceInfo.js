import {NativeModules, Platform} from 'react-native';
import {deviceInfo} from '../constants/commonStrings';
import constant from '../constants/constant';
let DeviceInfo = null;
export default class getDeviceInfo {
  static async getDeviceDetails() {
    if (Platform.OS == 'ios') {
      DeviceInfo = NativeModules.ReactNativeDeviceInfoModule;
      if (DeviceInfo != null) {
        DeviceInfo.DeviceInfoProcess(deviceInfo.BRAND).then(res => {
          constant.deviceName = res;
        });
        DeviceInfo.DeviceInfoProcess(deviceInfo.MODEL).then(res => {
          constant.deviceModel = res;
        });
        DeviceInfo.DeviceInfoProcess(deviceInfo.VERSION).then(res => {
          constant.deviceVersion = res;
        });
        DeviceInfo.DeviceInfoProcess(deviceInfo.CODE).then(res => {
          constant.deviceCode = res;
        });
        DeviceInfo.DeviceInfoProcess(deviceInfo.PACKAGE).then(res => {
          constant.devicePackage = res;
        });
      }
    } else {
      DeviceInfo = NativeModules.DeviceInfoModule;
      if (DeviceInfo != null) {
        DeviceInfo.getDeviceInfo(deviceInfo.BRAND).then(res => {
          // console.log('====DeviceInfo BRAND', res);
          constant.deviceName = res;
        });
        DeviceInfo.getDeviceInfo(deviceInfo.MODEL).then(res => {
          // console.log('====DeviceInfo MODEL', res);
          constant.deviceModel = res;
        });
        DeviceInfo.getDeviceInfo(deviceInfo.VERSION).then(res => {
                    console.log('====DeviceInfo VERSION', res);

          constant.deviceVersion = res;
        });
        DeviceInfo.getDeviceInfo(deviceInfo.CODE).then(res => {
          constant.deviceCode = res;
        });
        DeviceInfo.getDeviceInfo(deviceInfo.PACKAGE).then(res => {
          constant.devicePackage = res;
        });
      }
    }
  }
}
