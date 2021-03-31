import axios from "js/axios.js";
import Vue from "vue";

let GET = {
  //获取图片验证码
  getImgCode: "/sites/auth/vcode",
  //获取城市
  getCompany: "/sites/cmp/company/chain",
  //首页
  getSwipe: "/sites/common/banner/hbnls",
  getCatalog: "/sites/hbnls/navlink",
  getHotList: "/sites/hbnservice/paging?optionvalues=2",
  //保姆
  getDistrict: "/sites/cmp/company/area3",
  getBmtype: "/sites/agency/enums/bmtype",
  getProvince: "/sites/sys/area/province",
  getBmList: "/sites/agency/bminfo/paging",
  getBmDetail: "/sites/agency/bminfo/details",
  //月嫂
  getYsList: "sites/agency/ysinfo/paging",
  getYsDetail: "sites/agency/ysinfo/details",

  //雇主
  getGzList: "sites/agency/gz/paging",
  //经纪人
  getBrokerCatalog: "/sites/agency/bmbroker/options",
  getBrokerList: "/sites/agency/bmbroker/paging",
  getBrokerDetail: "sites/agency/bmbroker/details",
  getYsBrokerList: "sites/agency/ysbroker/paging",
  getYsBrokerDetail: "sites/agency/ysbroker/details",
  //服务列表
  getServiceList: "/sites/hbnservice/paging",
  getServiceCatalog: "/sites/hbnservice/Catalog",
  getServiceDetail: "/sites/hbnservice/Details",
  getServiceCusInfo: "/sites/common/guestbook/cusinfo",
  getServiceDetail_GuestBook: "sites/hbnservice/guestbookDetails",
  //支付
  readyPayInfo: "sites/pay/ReadyPayInfo",
  checkTradeNo: "sites/pay/querytrade",
  //招聘
  getRecruitList: "sites/hr/paging",
  getJobDetail: "/sites/hr/details",
  //用户
  getUserInfo: "/sites/member/user/logininfo",
  getContract: "sites/pay/getcontractpay",
  checkIden: "sites/hbnls/CheckIdentity",
  //合同
  getContract_emp: "sites/order/contract/RanderContract",
  logout: "/auth/unified/quit"
};
let POST = {
  getSms: "/auth/unified/mobilecode",
  loginByMobile: "/auth/unified/cuslogin",
  //留言卡
  getGuestBook: "/sites/common/guestbook/today",
  postGuestBook: "/sites/common/guestbook/addorupdate",
  //服务列表
  getServiceSku: "sites/hbnservice/LoadItems",
  getServiceSkuTime: "/sites/hbnservice/CalculateTime",
  serviceSkuPrice: "/sites/hbnservice/calculateprice",
  serviceCommit: "/sites/member/user/book",
  //用户
  getOrderList: "/sites/member/user/orders",
  //支付
  readyPay: "sites/pay/ReadyPay",
  //合同
  postContract: "sites/pay/SaveContract",
  //获取用户默认信息
  getUserData: "/sites/member/user/defaultcontact",
  updateUserData: "/sites/member/user/SetUserDefaultcontact",
  //员工工作照
  getUserWorkPic: "/sites/cmp/employee/workpic",
  getUserExp: "sites/cmp/employee/experience",
  //点赞
  praiseAdd: "/sites/agency/praise/add",
  //员工签名
  postContract_emp: "sites/cmp/employee/AddEmpSign",

  get防疫确认函: "sites/cmp/employee/preconfirmation",
  update防疫确认函: "sites/cmp/employee/confirmation",
  certSearch: "sites/school/cert/search",

  get承诺书: "sites/cmp/employee/prePledge",
  update承诺书: "sites/cmp/employee/Pledge"
};
let api = {};

Object.keys(GET).map(key => {
  api[key] = data => axios.$get(GET[key], data);
});
Object.keys(POST).map(key => {
  api[key] = data => axios.$post(POST[key], data);
});

//分享
// Vue.prototype.$check = api.checkIden
Vue.prototype.$api = api;
