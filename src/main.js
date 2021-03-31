import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "js/wxConfig.js";
import "js/px2rem.js";
import "css/common.scss";
import "js/api.js";
import axios from "js/axios.js";
import wx from "weixin-js-sdk";

import { ImagePreview, Toast } from "vant";

import skeleton from "components/other/Skeleton.vue";
import noData from "components/other/NoData.vue";
import keyValue from "components/other/KeyAndValue.vue";
import loadingWrap from "components/other/LoadingWrap.vue";

Vue.component("keyValue", keyValue);
Vue.component("Skeleton", skeleton);
Vue.component("noData", noData);
Vue.component("loadingWrap", loadingWrap);

Vue.prototype.$deepCopy = v => JSON.parse(JSON.stringify(v));
Vue.prototype.$singleImgPreview = img => {
  if (window.navigator.userAgent.toLowerCase().indexOf("micromessenger") >= 0) {
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    });
  } else {
    ImagePreview({
      images: [img],
      showIndex: false,
      closeOnPopnoData: true,
      minZoom: 1,
      maxZoom: 10
    });
  }
};
Vue.prototype.$multipleImgPreview = (urls, index) => {
  if (window.navigator.userAgent.toLowerCase().indexOf("micromessenger") >= 0) {
    wx.previewImage({
      current: urls[index],
      urls
    });
  } else {
    ImagePreview({
      images: urls,
      showIndex: false,
      startPosition: index,
      closeOnPopnoData: true,
      minZoom: 1,
      maxZoom: 10
    });
  }
};

Vue.prototype.$icepalace = () => {
  Toast({
    message: "该功能暂未开放",
    position: "bottom",
    duration: 1000
  });
};
Vue.config.productionTip = false;

Vue.prototype.xxx = e => {
  console.log(e);
};

Vue.prototype.$afterLogin = () => {};

if (window.navigator.userAgent.toLowerCase().indexOf("micromessenger") >= 0) {
  var requesturl = location.href.split("#")[0];
  axios
    .$post("/api/weixin/jsapi/hbnls", {
      sysclassid: 163,
      requesturl
    })
    .then(
      res => {
        wx.config(res.data);
        wx.ready(() => {
          init();
        });
      },
      () => {
        init();
      }
    );
} else {
  init();
}

function init() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
