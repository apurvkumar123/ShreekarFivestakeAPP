export const serverPath = 'https://shreekar.fivestake.co.in/api/'; //production
// export const serverPath = 'https://shreekardemo.fivestake.co.in/api/'; // demo

export const apiName = {
  checkVersionAPI: 'appSettings/checkappversion',
  getCity: 'appSettings/getCityList',
  GetMaterialCat: 'appSettings/getMaterialCategoryList',
  getComapanyData: 'appSettings/getCompanyList',
  getRoleData: 'appSettings/getRoleList',
  getProjectAllTeamUser: 'appSettings/getProjectTeamUserList',
  getWarehouse: 'appSettings/getWareHouseList',
  getMaterialCat: 'appSettings/getMaterialCategoryList',
  getTransferCategory: 'appSettings/getMaterialCategoryList_for_Transfer',
  getMaterialNameList: 'appSettings/getMaterialNameList',
  getTransferMaterialNameList: 'appSettings/getMaterialNameList_for_Transfer',
  getDropProjectList: 'appSettings/getProejectList',

  login: 'User/UserLogin',

  AdminUserList: 'User/UserList',
  AddAdminUser: 'User/addUser',
  EditAdminUser: 'User/editUser',
  SaveUserSetting: 'User/userDefaultSetting',

  CompanyList: 'Company/CompanyList',
  AddCompany: 'Company/addCompany',
  EditCompany: 'Company/editCompany',
  DeleteCompany: 'Company/deleteCompany',

  WarehouseList: 'WareHouse/WareHouseList',
  AddWarehouse: 'WareHouse/addWareHouse',
  EditWarehouse: 'WareHouse/editWareHouse',
  DeleteWarehouse: 'WareHouse/deleteWareHouse',

  MaterialCategoryList: 'MaterialCategory/MaterialCategoryList',
  AddMaterialCat: 'MaterialCategory/addMaterialCategory',
  EditMaterialCat: 'MaterialCategory/editMaterialCategory',
  DeleteMaterialCat: 'MaterialCategory/deleteMaterialCategory',

  MaterialList: 'Material/MaterialList',
  AddMaterial: 'Material/addMaterial',
  EditMaterial: 'Material/editMaterial',
  DeleteMaterial: 'Material/deleteMaterial',
  getTransferStatusButton: 'Material/showingTransferStatusButton',

  getDriversList: 'Driver/DriverList',
  AddDriver: 'Driver/addDriver',
  EditDriver: 'Driver/editDriver',
  DeleteDriver: 'Driver/DeleteDriver',

  getLabourList: 'Labour/LabourList',
  AddLabour: 'Labour/addLabour',
  EditLabour: 'Labour/editLabour',
  DeleteLabour: 'Labour/DeleteLabour',

  getProjectList: 'Project/ProjectList',
  AddProject: 'Project/addProject',
  EditProject: 'Project/editProject',
  DeleteProject: 'Project/deleteProject',
  AddProjectTeam: 'Project/addProjectTeamUser',
  addMaterialEntry: 'Material/addMaterialEntry',
  editMaterialEntry: 'Material/editMaterialEntry',
  deleteMaterialEntry: 'Material/deleteMaterialEntry',
  addMaterialTransferEntry: 'Material/addMaterialTransfer',
  UpdateMaterialTransferStatus: 'Material/updateMaterialTransferStatus',

  MaterialFromwarehouse: 'Material/MaterialList_From_WareHouse',
  MaterialSubList: 'Material/MaterialList_of_details',
  GetMaterialTransferList: 'Material/MaterialTransferList',

  getMessages: 'getMessages',
  register: 'registrationorg',
  UserDetails: 'getuserinfo',
  forgotPassword: 'resetpassword',
  changePassword: 'changepassword',
  getState: 'getStates',
  getCountry: 'getCountries',
  getOrgSubscriptionPlans: 'organizationplan',
  paymentEndPoint: 'ccpayment',
  updateOrgLogo: 'updateorglogo',
  editProfile: 'updateprofile',
  logoutUser: 'logout',
  projectEventlist: 'projectlist',
  DeleteAdminUser: 'deleteuser',
  getMemberUserList: 'memberlist',
  AddMemberUser: 'addmember',
  UpdateMemberUser: 'updatemember',
  InActiveMember: 'updatememberstatus',
  getRegistrationfees: 'registrationfees',
  getOrgDues: 'dues',
  Deletefees: 'deletefees',
  Deletedues: 'deletedues',
  Addregistrationfees: 'addupdateregistrationfees',
  AddOrganizationDues: 'addupdatedues',
  sendInvitationMember: 'sendinvitation',
  GetDueMember: 'orgduemember',
  CancelSubscription: 'cancelSubscription',
  getProjectEventList: 'getProjectEventList',
  getTotalDuesOfMember: 'totalDuesOfMember',
  makePayment: 'makepayment',
  sendMessage: 'sendMessage',
  getPaymentreport: 'paymentreport',
  reportsummary: 'reportsummary',
  graphReport: 'graphReport',
  addOrgBalance: 'addOrgBalance',
  addbalance: 'addbalance',
  allorgaccount: 'allorgaccount',
  meeting: 'meeting',

  // Project fund

  getProjectFund: 'ProjectFund/ProjectFundListForSiteIncharge', // for site Incharge
  getProjectFundKisanBhai: 'ProjectFund/ProjectFundListForfirstStepAdmin', // for Kisan bhai Super Admin
  getProjectFundDineshBhai: 'ProjectFund/ProjectFundListForsecondStepAdmin', // for DInesh bhai Main Admin
  getProjectFundAccountPerson: 'ProjectFund/ProjectFundListForThirdStepAccount', // for Account Person
  addProjectFund: 'ProjectFund/addProjectFund',
  editProjectFund: 'ProjectFund/editProjectFund',
  deleteProjectFund: 'ProjectFund/deleteProjectFund',
  getProjectFUndDetails: 'ProjectFund/ProjectFundDetailsById',
  getProjectFundStatus: 'ProjectFund/ProjectFundStatusList',
  actionProjectFund: 'ProjectFund/ProjectFundApproved_Rejected', // for kishanbhai
  actionDineshProjectFund: 'ProjectFund/ProjectFundValidated_Rejected', // for Dineshbhai
  actionAccountProjectFund: 'ProjectFund/ProjectFundValidated_Released', // for Dineshbhai

  //Expense Category
  ExpenseCategoryList: 'ExpenseCategory/ExpenseCategoryList',
  AddExpenseCat: 'ExpenseCategory/addExpenseCategory',
  EditExpenseCat: 'ExpenseCategory/editExpenseCategory',
  DeleteExpenseCat: 'ExpenseCategory/deleteExpenseCategory',

  //Expense Module
  getExpenseCategoryList: 'appSettings/getExpenseCategoryList',
  ExpenseList: 'ExpenseCategory/ExpenseList',
  AddExpense: 'ExpenseCategory/addExpense',
  EditExpense: 'ExpenseCategory/editExpense',
  DeleteExpense: 'ExpenseCategory/deleteExpense',
  DashboardBalance: 'ExpenseCategory/DashboardExpenseList',
};
