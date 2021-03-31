import axios from "js/axios.js";
import Vue from "vue";
import wx from "weixin-js-sdk";
// Vue.use(wx)
let $wxshare = obj => {
  if (!obj) {
    wx.ready(function() {
      wx.hideOptionMenu();
    });
    return;
  }
  wx.ready(function() {
    wx.showAllNonBaseMenuItem();
    let data = {
      title: obj.title || "好邦伲", // 分享标题
      link: obj.link || window.location.href, // 分享链接
      desc: obj.desc || "",
      imgUrl: obj.imgUrl || "https://www.haobangni.com/hbnls/wx_share.png"
    };
    wx.onMenuShareTimeline(data);
    wx.onMenuShareAppMessage(
      Object.assign(data, {
        dataUrl: ""
      })
    );
    wx.updateAppMessageShareData(data);
    wx.updateTimelineShareData(data);
  });
};
Vue.prototype.$wxshare = $wxshare;
Vue.prototype.$shareApi = (route, data) => {
  axios.$get("sites/sharedata/" + route, data).then(
    res => {
      $wxshare(res.data);
    },
    res => {
      console.log(res.data.errormsg);
    }
  );
};
