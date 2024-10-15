import {SafeAreaView, StyleSheet, Text, View, Modal} from 'react-native';
import {useSelector} from 'react-redux';
import commonStyle from '../styles/commonStyle';
import LoginHeader from '../custom/LoginHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {colors, font, fontSizes} from '../utility/theme';
import tabStyles from '../styles/tabStyle';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {stack} from '../constants/commonStrings';
import {imagePath} from '../utility/imagePath';
import {Image} from 'react-native';
import moment from 'moment';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {dateFormat} from '../constants/commonStrings';
import withPreventDoubleClick from '../utility/withPreventDoubleClick';
import constant from '../constants/constant';
import {apiName} from '../network/serverConfig';
import Axios from '../network/Axios';
import InputField from '../custom/InputField';
import Loader from '../custom/Loader';
import {FlatList} from 'react-native';
import ProjectListRow from '../custom/customRow/ProjectListRow';
import ReportListRow from '../custom/customRow/ReportListRow';
const TouchableOpacity = withPreventDoubleClick();

const Payments = () => {
  const navigation = useNavigation();
  const [isMPaymentSelected, setIsMPaymentSelected] = useState(true);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showPaymentDetailModal, setShowPaymentDetailsModal] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, 'months').format(dateFormat.POSTING),
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format(dateFormat.POSTING),
  );

  const [apiSDate, setApiSDate] = useState(
    moment(new Date()).subtract(1, 'months').format(dateFormat.POSTING),
  );
  const [apiEDate, setApiEDate] = useState(
    moment(new Date()).format(dateFormat.POSTING),
  );
  const [reportData, setReportData] = useState('');
  const [toDate, setTodate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pastDate, setPastDate] = useState('');
  const [type, setType] = useState(0); //for Date

  useEffect(() => {
    requestGetReportData();
  }, [apiSDate, apiEDate, isMPaymentSelected]);
  function LoadDailog() {
    return <Loader isVisible={isScreenLoading} />;
  }
  function onTabChange(isProject) {
    setIsMPaymentSelected(isProject);
  }
  async function requestGetReportData() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID, startdate: apiSDate, enddate: apiEDate};
    console.log('REQ_getPaymentreport', data);
    return Axios.requestData('POST', apiName.getPaymentreport, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getPaymentreport', res.data.result);
          if (res.data.result.length == 0) {
            setIsScreenLoading(false);
            showFlashMessage('Info', getStringMessage('lbl_no_records'), true);
          } else {
            setReportData(res.data.result);
            setIsScreenLoading(false);
          }
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getPaymentreport_err', err);
      });
  }

  function moveToNext(from) {
    if (from == 1) {
      navigation.navigate(stack.RECEIVE_PAYMENT, {transactionType: true});
    } else {
      navigation.navigate(stack.RECEIVE_PAYMENT, {transactionType: false});
    }
  }
  function paymentHeaderContainer() {
    return (
      <View style={[styles.paymentBoxContainer, commonStyle.shadowProp]}>
        <View style={styles.oneSideContainer}>
          <Text style={styles.txtTitleReceived}>
            {getStringMessage('lbl_manualPayment')}
          </Text>
          <Text style={styles.txtReceived}>
            {getStringMessage('lbl_Received')}
          </Text>
          {reportData != '' && (
            <Text
              style={
                reportData.offlineamount > 0
                  ? styles.txtAmount
                  : styles.txtAmountRed
              }>
              {constant.CURRENCY_SYMBOL + reportData.offlineamount}
            </Text>
          )}
        </View>
        <View style={styles.oneSideContainer}>
          <Text style={styles.txtTitleReceived}>
            {getStringMessage('lbl_online_payment')}
          </Text>
          <Text style={styles.txtReceived}>
            {getStringMessage('lbl_Received')}
          </Text>
          {reportData != '' && (
            <Text
              style={
                reportData.onlineamount > 0
                  ? styles.txtAmount
                  : styles.txtAmountRed
              }>
              {constant.CURRENCY_SYMBOL + reportData.onlineamount}
            </Text>
          )}
        </View>
      </View>
    );
  }
  /**
   * onDatePickerClicked
   */

  function showPaymentDetails(item) {
    setSelectedObject(item);
    setTimeout(() => {
      setShowPaymentDetailsModal(true);
    }, 500);
  }

  function onDatePickerClicked(from) {
    if (from == 2 && startDate == '') {
      showFlashMessage(
        'Info',
        getStringMessage('msg_select_start_date_first'),
        true,
      );
    } else {
      setDatePickerVisibility(true);
      setType(from);
    }
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async date => {
    if (type == 1) {
      if (currentDate >= date) {
        setStartDate(moment(date).format(dateFormat.POSTING));
        setPastDate(date);
      } else {
        showFlashMessage(
          'Info',
          getStringMessage('msg_formGreaterThanTo'),
          true,
        );
      }
    } else if (type == 2) {
      console.log('date333 ', date);
      if (date < startDate) {
        console.log('date4444 ', date);
        showFlashMessage(
          'Info',
          getStringMessage('msg_geaterThanCurrDate'),
          true,
        );
      } else {
        setTodate(date);
        setEndDate(moment(date).format(dateFormat.POSTING));
      }
    }

    hideDatePicker();
  };

  function renderPaymentDetailsModal() {
    return (
      <Modal
        animationType="slide" // You can use 'fade' or 'none' as well
        transparent={true}
        visible={showPaymentDetailModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                backgroundColor: colors.btnColor,
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
                padding: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: colors.whiteColor, fontFamily: font.Bold}}>
                {getStringMessage('header_transaction_summary')}
              </Text>
            </View>
            <View style={{marginVertical: hp(2)}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    marginTop: hp(1),
                  }}>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Semi_Bold,
                      fontSize: fontSizes.pt_14,
                      width: wp(40),
                    }}>
                    {getStringMessage('lbl_entry_type')}
                  </Text>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      flex: 1,
                    }}>
                    {selectedObject?.entrytype}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    marginVertical: hp(1),
                  }}>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Semi_Bold,
                      fontSize: fontSizes.pt_14,
                      width: wp(40),
                    }}>
                    {getStringMessage('lbl_name')}
                  </Text>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      flex: 1,
                    }}>
                    {`${selectedObject?.firstname} ${selectedObject?.lastname}`}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    marginVertical: hp(1),
                  }}>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Semi_Bold,
                      fontSize: fontSizes.pt_14,
                      width: wp(40),
                    }}>
                    {getStringMessage('lbl_amount_camel')}
                  </Text>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      flex: 1,
                    }}>
                    {`${constant.CURRENCY_SYMBOL}${selectedObject?.amount}`}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    marginVertical: hp(1),
                  }}>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Semi_Bold,
                      fontSize: fontSizes.pt_14,
                      width: wp(40),
                    }}>
                    {getStringMessage('lbl_payment_purpose_camel')}
                  </Text>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      flex: 1,
                    }}>
                    {selectedObject?.transactiontype}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    marginTop: hp(1),
                  }}>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Semi_Bold,
                      fontSize: fontSizes.pt_14,
                      width: wp(40),
                    }}>
                    {getStringMessage('str_payment_method')}
                  </Text>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      flex: 1,
                    }}>
                    {selectedObject?.paymentmethod}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    marginTop: hp(1),
                  }}>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Semi_Bold,
                      fontSize: fontSizes.pt_14,
                      width: wp(40),
                    }}>
                    {getStringMessage('lbl_remark_camel')}
                  </Text>
                  <Text
                    style={{
                      color: colors.blackColor,
                      fontFamily: font.Regular,
                      fontSize: fontSizes.pt_14,
                      flex: 1,
                    }}>
                    {selectedObject?.remarks}
                  </Text>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <ButtonBlue
                    btnColor={colors.btnColor}
                    btnText={'     Close     '}
                    onClick={() => setShowPaymentDetailsModal(false)}
                  />
                </View>
              </View>
            </View>
            {/* <Button title="Close Modal" onPress={toggleModal} /> */}
          </View>
        </View>
      </Modal>
    );
  }

  function DateFilter() {
    return (
      <View style={[styles.paymentBoxContainer, commonStyle.shadowProp]}>
        <TouchableOpacity
          style={{flex: 1, marginHorizontal: wp(3)}}
          onPress={() => {
            onDatePickerClicked(1);
          }}>
          <InputField
            date
            inputTitleVisible={true}
            isEditable={false}
            inputTitle={getStringMessage('lbl_start_date_hint')}
            isImage={true}
            inputIconHint={imagePath.ic_calendar}
            updateMasterState={value => setStartDate(value)}
            value={startDate}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{flex: 1, marginHorizontal: wp(3)}}
          onPress={() => {
            onDatePickerClicked(2);
          }}>
          <InputField
            date
            inputTitleVisible={true}
            isEditable={false}
            inputTitle={getStringMessage('lbl_end_date_hint')}
            isImage={true}
            inputIconHint={imagePath.ic_calendar}
            updateMasterState={value => setEndDate(value)}
            value={endDate}
          />
        </TouchableOpacity>
      </View>
    );
  }
  function renderDateFilter() {
    return (
      <>
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            marginBottom: hp(1),
          }}>
          <Image style={styles.tabIcon} source={imagePath.ic_calendar} />
          <Text style={styles.txtReceived}>
            {moment(apiSDate).format(dateFormat.DISPLAY) +
              ' - ' +
              moment(apiEDate).format(dateFormat.DISPLAY)}
          </Text>
          <TouchableOpacity
            style={{paddingHorizontal: wp(2)}}
            onPress={() => {
              if (showDateFilter) {
                setApiSDate(startDate);
                setApiEDate(endDate);
              }
              setShowDateFilter(!showDateFilter);
            }}>
            <Text style={styles.txtChange}>
              {!showDateFilter
                ? getStringMessage('btn_change')
                : getStringMessage('btn_apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  function loadListing(data) {
    return (
      <>
        {data != null && data.length != 0 ? (
          <FlatList
            style={{
              backgroundColor: 'white',
            }}
            data={data}
            renderItem={({item, index}) => (
              <ReportListRow
                item={item}
                value={item.label}
                isRightArrow={true}
                onClick={() => {
                  console.log('123123 ', item);
                  showPaymentDetails(item);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={commonStyle.NoListTextStyleMedium}>
            {getStringMessage('lbl_no_records')}
          </Text>
        )}
      </>
    );
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {LoadDailog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <LoginHeader route={''} isIconDisplay={true} />
        {renderPaymentDetailsModal()}
        <View style={styles.topContainer}>
          {renderDateFilter()}
          {showDateFilter ? DateFilter() : paymentHeaderContainer()}

          <View style={tabStyles.mainTabContainer}>
            <TouchableOpacity
              onPress={() => {
                onTabChange(true);
              }}
              style={
                isMPaymentSelected
                  ? tabStyles.tabContainerSelected
                  : tabStyles.tabContainer
              }>
              <Text style={tabStyles.tabTitle}>
                {getStringMessage('lbl_manualPayment')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onTabChange(false);
              }}
              style={
                !isMPaymentSelected
                  ? tabStyles.tabContainerSelected
                  : tabStyles.tabContainer
              }>
              <Text style={tabStyles.tabTitle}>
                {getStringMessage('lbl_online_payment')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.middleContainer}>
          {loadListing(
            isMPaymentSelected ? reportData.offlinedata : reportData.onlinedata,
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={{flex: 1, marginHorizontal: wp(3)}}>
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_ReceivePayment')}
              onClick={() => moveToNext(1)}
            />
          </View>
          <View style={{flex: 1, marginHorizontal: wp(3)}}>
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_TransferPayment')}
              onClick={() => moveToNext(2)}
            />
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={type == 1 ? 0 : pastDate}
          maximumDate={type == 1 ? toDate : currentDate}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    height: hp(2),
    width: wp(3),
    resizeMode: 'contain',
    marginHorizontal: wp(2),
  },
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  topContainer: {
    backgroundColor: colors.appBGColor,
  },
  middleContainer: {
    flex: 0.7,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 0.3,
    backgroundColor: colors.appBGColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtTitleReceived: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginVertical: hp(0.5),
  },
  txtReceived: {
    fontFamily: font.Regular,
    fontSize: fontSizes.pt_12,
    color: colors.blackColor,
  },
  txtAmount: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_30,
    color: colors.payment_green,
    marginVertical: hp(1),
  },
  txtAmountRed: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_30,
    color: colors.redColor,
    marginVertical: hp(1),
  },
  oneSideContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  paymentBoxContainer: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    marginHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 12,
    marginVertical: hp(1),
  },
  txtChange: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_12,
    color: colors.link_btn,
    borderBottomColor: colors.link_btn,
    borderBottomWidth: hp(0.2),
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    // padding: 20,
    borderRadius: 10,
    elevation: 5, // Android shadow
    width: wp(90),
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
export default Payments;
