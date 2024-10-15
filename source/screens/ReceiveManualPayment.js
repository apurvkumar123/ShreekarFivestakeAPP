import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../custom/Header';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyle from '../styles/commonStyle';
import {useNavigation} from '@react-navigation/native';
import tabStyles from '../styles/tabStyle';
import {TouchableOpacity} from 'react-native';
import {colors} from '../utility/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import ListDialog from '../custom/Dialogs/ListDialog';
import DropdownField from '../custom/DropdownField';
import {ScrollView} from 'react-native';
import Loader from '../custom/Loader';
import {apiName} from '../network/serverConfig';
import Axios from '../network/Axios';
import constant from '../constants/constant';
import InputField from '../custom/InputField';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import {dateFormat} from '../constants/commonStrings';
import moment from 'moment';

let getMemberType = 0;
const ReceiveManualPayment = ({route}) => {
  const navigation = useNavigation();
  const [isCreditPayment, setIsCreditPayment] = useState(true);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isPurposeDropBoxVisible, setIsPurposeDropBoxVisible] = useState(false);
  const [isMethodDropBoxVisible, setIsMethodDropBoxVisible] = useState(false);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [dropType, setDropType] = useState(1);

  const [paymentPurpose, setPaymentPurpose] = useState('');
  const [paymentPurposeID, setPaymentPurposeID] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [member, setMember] = useState('');
  const [memberID, setMemberID] = useState('');
  const [commonlist, setCommonlist] = useState([]);
  const [description, setDescription] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [project, setProject] = useState('');
  const [projectID, setProjectID] = useState('');
  const [paymentDues, setPaymentDues] = useState('');
  const [paymentDuesID, setPaymentDuesID] = useState('');
  const [amount, setAmount] = useState('');
  const paymentMethodlist = [
    {label: getStringMessage('lbl_cash_method'), value: 1},
    {label: getStringMessage('lbl_cheque_method'), value: 2},
    {label: getStringMessage('lbl_paypal_method'), value: 3},
    {label: getStringMessage('lbl_cc_Method'), value: 4},
  ];
  const creditPurposelist = [
    {label: getStringMessage('lbl_MemberDues'), value: 1},
    {label: getStringMessage('lbl_Donation'), value: 2},
    {label: getStringMessage('lbl_Registrationfees'), value: 3},
    {label: getStringMessage('lbl_Outstanding_amount'), value: 4},
  ];
  const debitPurposelist = [
    {label: getStringMessage('lbl_PaymenttoMember'), value: 5},
    {label: getStringMessage('lbl_Other'), value: 6},
  ];
  useEffect(() => {
    var transactionType = route.params.transactionType;
    if(transactionType!=undefined){
      // console.log("transactionType",transactionType);
      onTabChange(transactionType);
    }
  }, []);
  function onTabChange(isProject) {
    setIsCreditPayment(isProject);
    resetForm();
  }
  function resetForm() {
    setPaymentPurpose('');
    setPaymentPurposeID('');
    setPaymentMethod('');
    setMember('');
    setMemberID('');
    setDescription('');
    setProject('');
    setProjectID('');
    setPaymentDuesID('');
    setPaymentDues('');
    setAmount('');
  }

  async function requestGetMember() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID, type: getMemberType};
    console.log('REQ_getMemberUser', data);
    return Axios.requestData('POST', apiName.getMemberUserList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getMemberUser', res.data.result);
          if (res.data.result.length == 0) {
            setIsScreenLoading(false);
            showFlashMessage('Info', getStringMessage('lbl_no_records'), true);
          } else {
            let LArray = [];
            res.data.result.map(item => {
              var obj = {
                label: item.firstname + ' ' + item.lastname,
                value: item.id,
                outStandAmt: item.outstanding_amount,
              };
              LArray.push(obj);
            });
            setCommonlist(LArray);
            setTimeout(() => {
              setIsScreenLoading(false);
              setDisplayListDialog(true);
            }, 300);
          }
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getMemberUser_err', err);
      });
  }
  async function requestGetProject() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID};
    console.log('REQ_getProject', data);
    return Axios.requestData('POST', apiName.getProjectEventList, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getProject', res.data.result);

          let LArray = [];
          res.data.result.map(item => {
            var obj = {
              label:
                item.type == 1
                  ? item.title + ' (Project)'
                  : item.title + ' (Event)',
              value: item.id,
            };
            LArray.push(obj);
          });
          setCommonlist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayListDialog(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getProject_err', err);
      });
  }
  async function requestGetDues() {
    var data = {organizationid: constant.orgID, member_id: memberID};
    console.log('REQ_getMemberDues', data);
    setIsScreenLoading(true);
    return Axios.requestData('POST', apiName.getTotalDuesOfMember, data)
      .then(res => {
        if (res.status == 200) {
          console.log('RES_getMemberDues', res.data.result);

          let LArray = [];
          res.data.result.map(item => {
            var obj = {
              label:
                'Dues of ' +
                moment(item.created_at).format(dateFormat.DISPLAY_MONTH) +
                ' Month (' +
                constant.CURRENCY_SYMBOL +
                item.amount +
                ')',
              value: item.transationid,
              amount: item.amount,
            };
            LArray.push(obj);
          });
          setCommonlist(LArray);
          setTimeout(() => {
            setIsScreenLoading(false);
            setDisplayListDialog(true);
          }, 300);
        } else {
          setIsScreenLoading(false);
        }
      })
      .catch(err => {
        setIsScreenLoading(false);
        console.log('RES_getMemberDues_err', err);
      });
  }

  function randerDialog() {
    return (
      <>
        <Loader isVisible={isScreenLoading} />
        <ListDialog
          onCloseEvent={() => {
            setIsPurposeDropBoxVisible(false);
          }}
          buttonText={getStringMessage('btn_close')}
          isVisible={isPurposeDropBoxVisible}
          title={getStringMessage('lbl_select_pPurpose')}
          list={isCreditPayment ? creditPurposelist : debitPurposelist}
          onItemClick={item => {
            setPaymentPurpose(item.label);
            setPaymentPurposeID(item.value);
            setIsPurposeDropBoxVisible(false);
            console.log('item.value', item.value);
            if (item.value == 1) {
              getMemberType = constant.DUES_MEMBER;
            } else if (item.value == 4) {
              getMemberType = constant.OUTSTANDING_AMT_MEMBER;
            } else if (item.value == 2 || item.value == 5) {
              getMemberType = constant.ALL_MEMBER;
            } else if (item.value == 3) {
              getMemberType = constant.REG_MEMBER;
            }
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={dropType == 3 ? false : true}
          buttonText={'Close'}
          isVisible={isDisplayListdialog}
          title={headerTitle}
          list={commonlist}
          onItemClick={item => {
            console.log('item--', item);
            if (dropType == 1) {
              setMemberID(item.value);
              setMember(item.label);
              if (paymentPurposeID == 4) {
                setAmount(item.outStandAmt);
              }
            } else if (dropType == 2) {
              setProjectID(item.value);
              setProject(item.label);
            } else {
              setPaymentDuesID(item.value);
              setPaymentDues(item.label);
              setAmount(item.amount);
            }
            setDisplayListDialog(false);
          }}
        />
        <ListDialog
          onCloseEvent={() => {
            setIsMethodDropBoxVisible(false);
          }}
          buttonText={getStringMessage('btn_close')}
          isVisible={isMethodDropBoxVisible}
          title={getStringMessage('lbl_subscription_details_title')}
          list={paymentMethodlist}
          onItemClick={item => {
            setPaymentMethod(item.label);
            setIsMethodDropBoxVisible(false);
          }}
        />
      </>
    );
  }
  function validation() {
    if (paymentPurposeID <= 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_payment_purpose'),
        true,
      );
    } else if (paymentPurposeID != 6 && memberID <= 0) {
      showFlashMessage('Required', getStringMessage('msg_select_member'), true);
    } else if (paymentPurposeID == 1 && paymentDuesID.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_payment_dues'),
        true,
      );
    } else if (amount.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_amount'), true);
    } else if (paymentMethod.trim().length == 0) {
      showFlashMessage(
        'Required',
        getStringMessage('msg_select_payment_method'),
        true,
      );
    } else if (paymentPurposeID == 4 && description.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_remark'), true);
    } else if (paymentPurposeID == 6 && description.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_remark'), true);
    } else {
      setIsLoading(true);

      requestAddPayment();
    }
  }
  async function requestAddPayment() {
    var data = {
      payment_type: isCreditPayment ? 1 : 2,
      payment_purpose:
        paymentPurposeID == 5
          ? 1
          : paymentPurposeID == 6
          ? 2
          : paymentPurposeID,
      org_id: constant.orgID,
      member_id: memberID,
      amount: amount,
      payment_method: paymentMethod,
      remarks: description,
      paymentid: paymentPurposeID == 1 ? paymentDuesID : '',
      project_id: projectID,
    };
    console.log('REQ_AddPayment', data);
    return Axios.requestData('POST', apiName.makePayment, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_AddPayment', res.data);
          if (res.data.status == 0) {
            showFlashMessage('Info', res.data.message, true);
          } else {
            showFlashMessage('Success!', res.data.message, false);
            navigation.goBack();
          }
        } else {
          showFlashMessage('Info', res.message, true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        showFlashMessage('Info', getStringMessage('msg_something_wrong'), true);
        console.log('err', err);
      });
  }
  return (
    <SafeAreaView style={commonStyle.commonBackgroundStyle}>
      {randerDialog()}
      <View style={styles.safeAreaBaseViewContainer}>
        <View style={{}}>
          <Header
            route={route.params.transactionType ? getStringMessage('btn_ReceivePayment') : getStringMessage('btn_TransferPayment')}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
          {/* <View style={tabStyles.mainTabContainer}>
            <TouchableOpacity
              onPress={() => {
                onTabChange(true);
              }}
              style={
                isCreditPayment
                  ? tabStyles.tabContainerSelected
                  : tabStyles.tabContainer
              }>
              <Text style={tabStyles.tabTitle}>
                {getStringMessage('lbl_PaymentReceived')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onTabChange(false);
              }}
              style={
                !isCreditPayment
                  ? tabStyles.tabContainerSelected
                  : tabStyles.tabContainer
              }>
              <Text style={tabStyles.tabTitle}>
                {getStringMessage('lbl_ExpensesPayment')}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={styles.topContainer}>
          <ScrollView style={{paddingHorizontal: wp(2)}}>
            <DropdownField
              inputTitle={getStringMessage('lbl_Payment_purpose')}
              value={paymentPurpose}
              onClick={() => {
                console.log('paymentPurpose click');
                setIsPurposeDropBoxVisible(true);
              }}
            />
            {paymentPurposeID > 0 && paymentPurposeID != 6 ? (
              <DropdownField
                inputTitle={getStringMessage('lbl_member')}
                value={member}
                onClick={() => {
                  setCommonlist([]);
                  setDropType(1);
                  setHeaderTitle(getStringMessage('title_select_member'));
                  requestGetMember();
                }}
              />
            ) : null}
            {paymentPurposeID == 1 && memberID > 0 ? (
              <DropdownField
                inputTitle={getStringMessage('lbl_payment_dues')}
                value={paymentDues}
                onClick={() => {
                  setCommonlist([]);
                  setDropType(3);
                  setHeaderTitle(getStringMessage('lbl_Select_payment_deus'));
                  requestGetDues();
                }}
              />
            ) : null}
            {paymentPurposeID == 2 && memberID > 0 ? (
              <DropdownField
                inputTitle={getStringMessage('lbl_project_optional')}
                value={project}
                onClick={() => {
                  setCommonlist([]);
                  setDropType(2);
                  setHeaderTitle(getStringMessage('lbl_Select_Project_Event'));
                  requestGetProject();
                }}
              />
            ) : null}

            <InputField
              inputTitleVisible={true}
              isEditable={true}
              number
              isImage={false}
              inputTitle={getStringMessage('lbl_Amount')}
              updateMasterState={value => setAmount(value)}
              value={amount}
            />

            <DropdownField
              inputTitle={getStringMessage('lbl_Payment_Method')}
              value={paymentMethod}
              onClick={() => {
                console.log('paymentMethod click');
                setIsMethodDropBoxVisible(true);
              }}
            />

            <InputField
              multiline
              inputTitleVisible={true}
              isEditable={true}
              isImage={false}
              inputTitle={getStringMessage('lbl_REMARK')}
              updateMasterState={value => setDescription(value)}
              value={description}
            />
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_save')}
              onClick={() => validation()}
              isloading={isLoading}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReceiveManualPayment;

const styles = StyleSheet.create({
  safeAreaBaseViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  topContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    paddingVertical: hp(3),
  },
});