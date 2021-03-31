import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import axios from "js/axios";
import { NewGuid } from "js/tools.js";
import { wxLogin } from "./js/tools";

let ClientId = window.localStorage.getItem("ClientId");
if (!ClientId) {
  ClientId = NewGuid();
  window.localStorage.setItem("ClientId", ClientId);
}

let userAgent = navigator.userAgent.toLowerCase();
let env;
if (userAgent.indexOf("micromessenger") >= 0) {
  env = "wechat"; //weixin
} else if (userAgent.indexOf("alipay") >= 0) {
  env = "alipay"; //
} else {
  env = "html";
}

let query_arr = window.location.href
  .toLowerCase()
  .split("?") //[www,weixinfenxiang,hbnls]
  .pop()
  .split("&");
//['saleid=1','salecode=1']

let obj = {};
query_arr.forEach(i => {
  let a = i.split("=");
  obj[a[0]] = a[1];
});

!!obj.companyid && window.localStorage.setItem("CompanyId", obj.companyid);
!!obj.salerid && window.localStorage.setItem("salerid", obj.salerid);
!!obj.salercode && window.localStorage.setItem("salercode", obj.salercode);
!!obj.salerempid && window.localStorage.setItem("salerempid", obj.salerempid);

export default new Vuex.Store({
  state: {
    ClientId,
    CompanyName: window.localStorage.getItem("CompanyName") || -1,
    CompanyId: window.localStorage.getItem("CompanyId") || -1,
    history: [],
    onLogin: false,
    token: window.localStorage.getItem("token") || "",
    headimgurl: window.localStorage.getItem("headimgurl"),
    expired: window.localStorage.getItem("expired") || "",
    env,
    doubleJump: false,
    salerid: window.localStorage.getItem("salerid") || null,
    salercode: window.localStorage.getItem("salercode") || null,
    salerempid: window.localStorage.getItem("salerempid") || null
  },
  getters: {
    CompanyName: state => state.CompanyName,
    CompanyId: state => state.CompanyId,
    history: state => state.history,
    ClientId: state => state.ClientId,
    token: state => state.token,
    headimgurl: state => state.headimgurl,
    doubleJump: state => state.doubleJump,
    onLogin: state => state.onLogin,
    env: state => state.env
  },
  mutations: {
    setCompany(state, { CompanyName, CompanyId }) {
      state.CompanyName = CompanyName;
      state.CompanyId = CompanyId;
      window.localStorage.setItem("CompanyName", CompanyName);
      window.localStorage.setItem("CompanyId", CompanyId);
    },
    setHistory(state, history) {
      state.history = history;
    },
    showLoginBox(state, callback) {
      state.onLogin = true;
      Vue.prototype.$afterLogin = callback;
    },
    hideLoginBox(state, _this) {
      state.onLogin = false;
      if (_this) {
        _this.$afterLogin();
      }
      Vue.prototype.$afterLogin = () => {};
    },
    login(state, { token, expired, headimgurl }) {
      state.token = token;
      state.expired = expired;
      state.headimgurl = headimgurl;
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("expired", expired);
      window.localStorage.setItem("headimgurl", headimgurl || "");
    },
    setDoubleJumpMark(state) {
      state.doubleJump = true;
    }
  },
  actions: {
    checkId({ state }, { needBind }) {
      return new Promise((resolve, reject) => {
        axios.$get("sites/hbnls/CheckIdentity").then(res => {
          if (!res.data.islogin) {
            //没有登陆
            if (state.env === "wechat") {
              //微信环境
              wxLogin();
            } else {
              //非微信环境
              reject();
            }
          } else {
            if (!needBind) {
              //不需要绑定手机
              resolve();
            } else {
              //需要绑定手机
              if (!res.data.isbindmobile) {
                //已登陆未绑定手机
                reject();
              } else {
                //已登陆并绑定了手机
                resolve();
              }
            }
          }
        });
      });
    }
  }
});
