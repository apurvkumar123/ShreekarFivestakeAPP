import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import commonStyle from '../styles/commonStyle';
import LoginHeader from '../custom/LoginHeader';
import {colors, font, fontSizes} from '../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import {apiName} from '../network/serverConfig';
import Axios from '../network/Axios';
import constant from '../constants/constant';
import Loader from '../custom/Loader';
import ListDialog from '../custom/Dialogs/ListDialog';
import DropdownField from '../custom/DropdownField';
import {LineChart} from 'react-native-chart-kit';
import {dateFormat} from '../constants/commonStrings';
import moment from 'moment';
const Reports = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isMethodDropBoxVisible, setIsMethodDropBoxVisible] = useState(false);
  const [reportData, setReportData] = useState('');
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState('');
  const yearList = () => {
    const currentYear = new Date().getFullYear();
    const previousYears = [];
    for (let i = 0; i < 5; i++) {
      const item = {label: currentYear - i, value: i + 1};
      previousYears.push(item);
    }
    return previousYears;
  };
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const chartConfig = {
    backgroundGradientFrom: colors.whiteColor,
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: colors.whiteColor,
    backgroundGradientToOpacity: 0.1,
    color: (opacity = 1) => `rgba(137, 148, 153, ${opacity})`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
  };
  const data = {
    labels:
      chartData.length > 0 ? chartData.map(item => item.yearMonth) : ['Jan'],
    datasets: [
      {
        data:
          chartData.length > 0 ? chartData.map(item => item.totalAmount) : [0],
        color: (opacity = 1) => colors.payment_green, // optional
        strokeWidth: 1, // optional
      },
    ],
    // legend: ['Rainy Days'], // optional
  };

  useEffect(() => {
    requestGetData();
  }, []);

  useEffect(() => {
    requestChartData();
  }, [selectedYear]);

  async function requestGetData() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('reportsummary', data);
    return Axios.requestData('POST', apiName.reportsummary, data)
      .then(res => {
        if (res.status == 200) {
          console.log('reportsummary', res.data.result);
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
        console.log('reportsummary', err);
      });
  }

  async function requestChartData() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID, year: selectedYear};
    console.log('graphReport_req', data);
    return Axios.requestData('POST', apiName.graphReport, data)
      .then(res => {
        if (res.status == 200) {
          console.log('graphReport_res', res.data.result.credit);
          if (res.data.result.length == 0) {
            setIsScreenLoading(false);
            showFlashMessage('Info', getStringMessage('lbl_no_records'), true);
          } else {
            calculateTotalAmount(res.data.result.credit);
            setChartData(getTotalAmountByMonth(res.data.result.credit));
            setIsScreenLoading(false);
          }
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('graphReport_err', err);
      });
  }
  const calculateTotalAmount = data => {
    let totalAmount = 0;
    for (const entry of data) {
      totalAmount += parseFloat(entry.amount);
    }
    setTotalRevenue(totalAmount);
  };
  const getTotalAmountByMonth = data => {
    const monthlyTotals = {};

    data.forEach(item => {
      const createdAt = moment(item.created_at).format(
        dateFormat.DISPLAY_MONTH_SHORT,
      );

      if (!monthlyTotals[createdAt]) {
        monthlyTotals[createdAt] = 0;
      }

      monthlyTotals[createdAt] += parseInt(item.amount);
    });

    const monthlyTotalArray = Object.keys(monthlyTotals).map(yearMonth => ({
      yearMonth,
      totalAmount: monthlyTotals[yearMonth],
    }));
    console.log('monthlyTotals: ', monthlyTotalArray);
    return monthlyTotalArray;
  };

  function LoadDailog() {
    return (
      <>
        <ListDialog
          onCloseEvent={() => {
            setIsMethodDropBoxVisible(false);
          }}
          buttonText={getStringMessage('btn_close')}
          isVisible={isMethodDropBoxVisible}
          title={getStringMessage('title_select_year')}
          list={yearList}
          onItemClick={item => {
            setSelectedYear(item.label);
            setIsMethodDropBoxVisible(false);
          }}
        />
        <Loader isVisible={isScreenLoading} />
      </>
    );
  }

  function boxContainer(title, value, isfull) {
    return (
      <View
        style={[
          !isfull ? styles.paymentBoxContainer : styles.paymentBoxContainerFull,
          commonStyle.shadowProp,
        ]}>
        <Text style={styles.txtTitleReceived}>{title}</Text>
        <Text style={styles.txtReceived}>{value}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {LoadDailog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <LoginHeader route={''} isIconDisplay={true} />
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.topContainer}>
            <View style={{flex: 1}}>
              {boxContainer(
                getStringMessage('lbl_donation_rec_this_month'),
                reportData.currentMonthDonation,
                false,
              )}
              {boxContainer(
                getStringMessage('lbl_new_reg_this_month'),
                reportData.currentMonthMember,
                false,
              )}
            </View>
            <View style={{flex: 1}}>
              {boxContainer(
                getStringMessage('lbl_membership_fees_due_month'),
                reportData.currentMonthDues,
                false,
              )}
              {boxContainer(
                getStringMessage('lbl_total_member') + '\n',
                reportData.totalMembers,
                false,
              )}
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <DropdownField
              inputTitle={getStringMessage('lbl_year')}
              value={'' + selectedYear}
              onClick={() => {
                console.log('paymentMethod click');
                setIsMethodDropBoxVisible(true);
              }}
            />
            {chartData != '' ? (
              <View style={{flex: 1}}>
                {boxContainer(
                  getStringMessage('lbl_total_revenue'),
                  totalRevenue,
                  true,
                )}
                <LineChart
                  style={{marginLeft: -5, marginTop: hp(1)}}
                  data={data}
                  width={wp(95)}
                  height={hp(25)}
                  verticalLabelRotation={0}
                  chartConfig={chartConfig}
                  bezier
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
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
  topContainer: {
    backgroundColor: colors.appBGColor,
    flexDirection: 'row',
    marginBottom: hp(2),
  },
  bottomContainer: {
    backgroundColor: colors.whiteColor,
    flex: 1,
    paddingHorizontal: wp(3),
  },
  paymentBoxContainer: {
    backgroundColor: colors.whiteColor,
    marginHorizontal: wp(3),
    padding: hp(1),
    borderRadius: 12,
    marginVertical: hp(1),
  },
  paymentBoxContainerFull: {
    backgroundColor: colors.whiteColor,
    padding: hp(1),
    borderRadius: 12,
    marginVertical: hp(1),
  },
  txtTitleReceived: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
    marginVertical: hp(0.5),
  },
  txtReceived: {
    fontFamily: font.Bold,
    fontSize: fontSizes.pt_20,
    color: colors.payment_green,
    marginVertical: hp(0.5),
  },
});

export default Reports;
