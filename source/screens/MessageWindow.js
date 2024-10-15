import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import constant from '../constants/constant';
import ButtonBlue from '../custom/Buttons/ButtonBlue';
import ListDialog from '../custom/Dialogs/ListDialog';
import DropdownField from '../custom/DropdownField';
import Header from '../custom/Header';
import InputField from '../custom/InputField';
import Loader from '../custom/Loader';
import Axios from '../network/Axios';
import {apiName} from '../network/serverConfig';
import commonStyle from '../styles/commonStyle';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utility/ResponsiveScreen';
import {getStringMessage, showFlashMessage} from '../utility/Utility';
import {imagePath} from '../utility/imagePath';
import {SESSION_NAME, getPrefData} from '../utility/session';
import {colors, font, fontSizes} from '../utility/theme';

const MessageWindow = () => {
  const navigation = useNavigation();

  const [member, setMember] = useState('');
  const [memberID, setMemberID] = useState('');
  const [orgName, setOrgName] = useState('');
  const [description, setDescription] = useState('');

  const [commonlist, setCommonlist] = useState([]);
  const [isDisplayListdialog, setDisplayListDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isAllMember, setIsAllMember] = useState(false);
  useEffect(() => {
    importData();
  }, []);
  function importData() {
    getPrefData(SESSION_NAME.USER_INFO, (resType, response) => {
      if (response != null) {
        console.log('response ed: ', response);
        if (response.organization) {
          setOrgName(response.organization.organizationname);
        }
      }
    });
  }
  async function requestGetMember() {
    setIsScreenLoading(true);
    var data = {org_id: constant.orgID, type: constant.ALL_MEMBER};
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
  function randerDialog() {
    return (
      <>
        <Loader isVisible={isScreenLoading} />

        <ListDialog
          onCloseEvent={() => {
            setDisplayListDialog(false);
          }}
          isSearch={true}
          buttonText={'Close'}
          isVisible={isDisplayListdialog}
          title={getStringMessage('title_select_member')}
          list={commonlist}
          onItemClick={item => {
            console.log('item--', item);
            setMemberID(item.value);
            setMember(item.label);
            setDisplayListDialog(false);
          }}
        />
      </>
    );
  }
  function validation() {
    if (!isAllMember && memberID <= 0) {
      showFlashMessage('Required', getStringMessage('msg_select_member'), true);
    } else if (description.trim().length == 0) {
      showFlashMessage('Required', getStringMessage('msg_enter_messge'), true);
    } else {
      setIsLoading(true);
      requestSendMessage();
    }
  }
  async function requestSendMessage() {
    var data = {
      org_id: constant.orgID,
      member_id: isAllMember ? '' : memberID,
      type: isAllMember ? 0 : 1, //0 = all member, 1 = individual member
      sender: 1, //0 = Member, 1 = Organization
      comment: description,
    };
    console.log('REQ_sendMessage', data);
    return Axios.requestData('POST', apiName.sendMessage, data)
      .then(res => {
        setIsLoading(false);
        if (res.status == 200) {
          console.log('RES_sendMessage', res.data);
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
            route={getStringMessage('lbl_member_member')}
            isIconDisplay={true}
            nav={navigation}
            isBackShow={true}
          />
        </View>
        <View style={styles.topContainer}>
          <ScrollView style={{paddingHorizontal: wp(2)}}>
            <InputField
              inputTitleVisible={true}
              isEditable={false}
              isImage={false}
              inputTitle={getStringMessage('lbl_hint_orgname')}
              updateMasterState={value => setOrgName(value)}
              value={orgName}
            />
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: hp(2),
                alignItems: 'center',
              }}
              onPress={() => {
                setIsAllMember(!isAllMember);
              }}>
              <Image
                style={styles.orgcheckicon}
                source={
                  isAllMember ? imagePath.ic_checkbox : imagePath.ic_unchecked
                }
              />
              <Text style={styles.hintLable}>
                {getStringMessage('lbl_sendToAll')}
              </Text>
            </TouchableOpacity>
            {!isAllMember && (
              <DropdownField
                inputTitle={getStringMessage('lbl_member')}
                value={member}
                onClick={() => {
                  setCommonlist([]);
                  requestGetMember();
                }}
              />
            )}
            <InputField
              multiline
              inputTitleVisible={true}
              isEditable={true}
              isImage={false}
              inputTitle={getStringMessage('lbl_message')}
              updateMasterState={value => setDescription(value)}
              value={description}
            />
            <ButtonBlue
              btnColor={colors.btnColor}
              btnText={getStringMessage('btn_send')}
              onClick={() => validation()}
              isloading={isLoading}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessageWindow;

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
  orgcheckicon: {
    height: hp(2.5),
    width: wp(5),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginEnd: wp(3),
  },
  hintLable: {
    fontFamily: font.Semi_Bold,
    fontSize: fontSizes.pt_14,
    color: colors.blackColor,
  },
});
