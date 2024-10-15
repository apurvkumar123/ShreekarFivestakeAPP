export default class DataManager {
  static myInstance = null;
  currencySymbol = '';
  deviceToken = '';
  followingCount = 0;
  BadgeCount = 0;
  notificationPayload = null;
  messageList = [];
  isFromQuitState = false;
  isBackground = false;

  /**
   * @returns {DataManager}
   */
  static getInstance() {
    if (DataManager.myInstance == null) {
      DataManager.myInstance = new DataManager();
    }
    return this.myInstance;
  }

  //MessageList

  setMessageListData = value => {
    this.messageList = value;
  };

  getMessageListData() {
    return this.messageList;
  }

  getMessage = msgKey => {
    // let arrData = DataManager.getInstance().getMessageListData()

    this.messageList.filter(data => {
      if (data.msgKey === msgKey) {
        return data.msgValue;
      }
    });
  };
}
