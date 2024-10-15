import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {colors} from './source/utility/theme';
import Splash from './source/screens/Splash';
import Login from './source/screens/Login';
import Register from './source/screens/Register';
import LoginSuccess from './source/screens/LoginSuccess';
import SubscriptionList from './source/screens/SubscriptionList';
import SubscriptionDetails from './source/screens/SubscriptionDetails';
import WebViewScreen from './source/screens/WebViewScreen';
import Dashboard from './source/screens/Dashboard';
import AddOrgDetails from './source/screens/AddOrgDetails';
import EditProfile from './source/screens/EditProfile';
import EditProfileUser from './source/screens/EditProfileUser';
import AddProject from './source/screens/project/AddProject';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {stack} from './source/constants/commonStrings';
import FlashMessage from 'react-native-flash-message';
import {useEffect} from 'react';
import getDeviceInfo from './source/utility/getDeviceInfo';
import {SESSION_NAME, getPrefData} from './source/utility/session';
import constant from './source/constants/constant';
import AdminUsers from './source/screens/adminUser/AdminUsers';
import AddAdminUsers from './source/screens/adminUser/AddAdminUsers';
import MemberUsers from './source/screens/MemberUsers';
import AddMemberUser from './source/screens/AddMemberUser';
import RegistrationFees from './source/screens/RegistrationFees';
import OrganizationDues from './source/screens/OrganizationDues';
import MySubscriptionScreen from './source/screens/MySubscriptionScreen';
import ViewMoreDues from './source/screens/ViewMoreDues';
import OrganizationSettings from './source/screens/OrganizationSettings';
import PaymentMethod from './source/screens/PaymentMethod';
import ReceiveManualPayment from './source/screens/ReceiveManualPayment';
import MessageWindow from './source/screens/MessageWindow';
import CMSPage from './source/screens/CMSPage';
import ManageMeeting from './source/screens/ManageMeeting';
import NavDrawer from './source/screens/NavDrawer';
import Warehouses from './source/screens/warehouse/Warehouses';
import AddWarehouse from './source/screens/warehouse/AddWarehouse';
import MaterialName from './source/screens/materialName/MaterialName';
import AddMaterialName from './source/screens/materialName/AddMaterialName';
import DriversList from './source/screens/driver/DriversList';
import AddDriver from './source/screens/driver/AddDriver';
import LabourList from './source/screens/labour/LabourList';
import AddLabour from './source/screens/labour/AddLabour';
import ProjectList from './source/screens/project/ProjectList';
import AddTeam from './source/screens/AddTeam';
import AddMaterialsfromwarehouse from './source/screens/materialsEntry/AddMaterialsfromwarehouse';
import MaterialFromWarehouses from './source/screens/materialsEntry/MaterialFromWarehouses';
import MaterialTransfer from './source/screens/materialTransfer/MaterialTransfer';
import AddMaterialTransfer from './source/screens/materialTransfer/AddMaterialTransfer';
import Settings from './source/screens/Settings';
import ProjectFundList from './source/screens/projectFund/ProjectFundList';
import AddProjectFund from './source/screens/projectFund/AddProjectFund';
import AddProjectFundKishanBhai from './source/screens/projectFund/AddProjectFundKishanBhai';
import AddProjectFundDineshBhai from './source/screens/projectFund/AddProjectFundDineshBhai';
import AddProjectFundAccountPerson from './source/screens/projectFund/AddProjectFundAccountPerson';
import MaterialCategories from './source/screens/materialCategory/MaterialCategories';
import AddMaterialCat from './source/screens/materialCategory/AddMaterialCat';
import AddCompany from './source/screens/company/AddCompany';
import Companies from './source/screens/company/Companies';
import MaterialSubList from './source/screens/materialsEntry/MaterialSubList';
import ExpenseCategory from './source/screens/expenseCategory/ExpenseCategory';
import AddExpenseCategory from './source/screens/expenseCategory/AddExpenseCategory';
import ExpenseList from './source/screens/expense/ExpenseList';
import AddExpense from './source/screens/expense/AddExpense';
import AddProjectFundSuperAdmin from './source/screens/projectFund/AddProjectFundSuperAdmin';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRoute] = useState(stack.ROOT);
  useEffect(() => {
    getDeviceInfo.getDeviceDetails();
    getPrefData(SESSION_NAME.ACCESS_TOKEN, (resType, response) => {
      if (response != null) {
        console.log('res_token: ', response);
        constant.ACCESS_TOKEN = 'Bearer ' + response;
      }
    });
  }, []);
  return (
    // <View style={{flex: 1, backgroundColor: colors.whiteColor}}>
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: colors.whiteColor}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name={stack.ROOT} component={Splash} />
          <Stack.Screen name={stack.LOGIN} component={Login} />
          <Stack.Screen name={stack.REGISTER} component={Register} />
          <Stack.Screen name={stack.LOGIN_SUCCESS} component={LoginSuccess} />
          <Stack.Screen
            name={stack.SUBSCRIPTION_LIST}
            component={SubscriptionList}
          />
          <Stack.Screen
            name={stack.SUBSCRIPTION_DETAILS}
            component={SubscriptionDetails}
          />

          <Stack.Screen name={stack.WEB_VIEW} component={WebViewScreen} />
          <Stack.Screen name={stack.DASHBOARD} component={Dashboard} />
          <Stack.Screen name={stack.NAV_DRAWER} component={NavDrawer} />
          <Stack.Screen name={stack.PAYMENT_METHOD} component={PaymentMethod} />
          <Stack.Screen name={stack.EDIT_PROFILE} component={EditProfile} />
          <Stack.Screen name={stack.CMS_PAGE} component={CMSPage} />
          <Stack.Screen name={stack.ADD_TEAM} component={AddTeam} />
          <Stack.Screen
            name={stack.ADD_MATERIAL_TRANSFER}
            component={AddMaterialTransfer}
          />
          <Stack.Screen
            name={stack.ADD_MATERIAL_FROM_WAREHOUSE}
            component={AddMaterialsfromwarehouse}
          />
          <Stack.Screen
            name={stack.MATERIAL_SUB_LIST}
            component={MaterialSubList}
          />
          <Stack.Screen
            name={stack.RECEIVE_PAYMENT}
            component={ReceiveManualPayment}
          />
          <Stack.Screen
            name={stack.ORG_SETTINGS}
            component={OrganizationSettings}
          />
          <Stack.Screen
            name={stack.EDIT_PROFILE_USER}
            component={EditProfileUser}
          />
          <Stack.Screen name={stack.ADD_PROJECT} component={AddProject} />
          <Stack.Screen name={stack.ADMIN_USER} component={AdminUsers} />
          <Stack.Screen name={stack.COMPANIES} component={Companies} />
          <Stack.Screen name={stack.WAREHOUSE} component={Warehouses} />
          <Stack.Screen name={stack.DRIVER_LIST} component={DriversList} />
          <Stack.Screen name={stack.ADD_DRIVER} component={AddDriver} />
          <Stack.Screen name={stack.LABOUR_LIST} component={LabourList} />
          <Stack.Screen name={stack.ADD_LABOUR} component={AddLabour} />
          <Stack.Screen name={stack.PROJECT_LIST} component={ProjectList} />
          <Stack.Screen
            name={stack.MATERIAL_TRANSFER}
            component={MaterialTransfer}
          />
          <Stack.Screen
            name={stack.MATERIAL_WAREHOUSE}
            component={MaterialFromWarehouses}
          />
          <Stack.Screen name={stack.PROJECT_FUND} component={ProjectFundList} />
          <Stack.Screen
            name={stack.ADD_PROJECT_FUND}
            component={AddProjectFund}
          />
          <Stack.Screen
            name={stack.ADD_PROJECT_FUND_KISHAN}
            component={AddProjectFundKishanBhai}
          />
          <Stack.Screen
            name={stack.ADD_PROJECT_FUND_DINESH}
            component={AddProjectFundDineshBhai}
          />
          <Stack.Screen
            name={stack.ADD_PROJECT_FUND_ACCOUNT}
            component={AddProjectFundAccountPerson}
          />

          <Stack.Screen
            name={stack.ADD_PROJECT_SUPER_ADMIN}
            component={AddProjectFundSuperAdmin}
          />

          <Stack.Screen name={stack.ADD_WAREHOUSE} component={AddWarehouse} />
          <Stack.Screen
            name={stack.MATERIAL_CATEGORY}
            component={MaterialCategories}
          />
          <Stack.Screen
            name={stack.ADD_MATERIAL_CAT}
            component={AddMaterialCat}
          />
          <Stack.Screen
            name={stack.EXPENSE_CATEGORY}
            component={ExpenseCategory}
          />
          <Stack.Screen
            name={stack.ADD_EXPENSE_CATEGORY}
            component={AddExpenseCategory}
          />

          <Stack.Screen name={stack.EXPENSE_LIST} component={ExpenseList} />
          <Stack.Screen name={stack.ADD_EXPENSE} component={AddExpense} />

          <Stack.Screen name={stack.MEMBER_USER} component={MemberUsers} />
          <Stack.Screen name={stack.MATERIAL_NAME} component={MaterialName} />
          <Stack.Screen
            name={stack.ADD_MATERIAL_NAME}
            component={AddMaterialName}
          />
          <Stack.Screen
            name={stack.MY_SUBSCRIPTION_SCREEN}
            component={MySubscriptionScreen}
          />
          <Stack.Screen name={stack.VIEW_MORE_DUES} component={ViewMoreDues} />

          <Stack.Screen
            name={stack.REGISTRATION_FEE}
            component={RegistrationFees}
          />
          <Stack.Screen
            name={stack.ORGANIZATION_DUES}
            component={OrganizationDues}
          />
          <Stack.Screen name={stack.ADD_ADMIN_USER} component={AddAdminUsers} />
          <Stack.Screen name={stack.ADD_COMPANY} component={AddCompany} />
          <Stack.Screen
            name={stack.ADD_MEMBER_USER}
            component={AddMemberUser}
          />
          <Stack.Screen
            name={stack.ADD_ORGANIZATION}
            component={AddOrgDetails}
          />
          <Stack.Screen name={stack.MESSAGE_WINDOW} component={MessageWindow} />
          <Stack.Screen name={stack.MANAGE_MEETING} component={ManageMeeting} />
          <Stack.Screen name={stack.SETTINGS} component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage position="bottom" />
    </GestureHandlerRootView>
    // </View>
  );
};

export default App;
