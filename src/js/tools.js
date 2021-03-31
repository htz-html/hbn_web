export function NewGuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  var uuid = s.join("");
  return uuid;
}
export function jump(url) {
  if (url.indexOf("https") === 0) {
    window.location.href = url;
  } else {
    this.$router.push({
      path: "/" + url,
      query: {
        reload: true
      }
    });
  }
}
export function $insertArray({ _this, data, targetArray, time, totalPage }) {
  return new Promise((resolve, rejecet) => {
    _this.loading = false;
    if (data.length > 0) {
      _this.noData = false;
      setTimeout(function() {
        let i = 0;
        let int = setInterval(() => {
          targetArray.push(data[i]);
          i++;
          if (i === data.length) {
            _this.noData = targetArray.length === 0;
            //防止连续加载
            _this.listFinished = _this.curpage >= totalPage;
            _this.listLoading = false;
            resolve();
            clearInterval(int);
          }
        }, time || 100);
      }, 100);
    } else {
      _this.listLoading = false;
      _this.listFinished = true;
      _this.noData = targetArray.length === 0;
      rejecet();
    }
  });
}

export function bridge() {
  // body
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?82cb2deccc3a9bba0c52585b0bf3e557";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();

  window._agl = window._agl || [];
  (function() {
    _agl.push(["production", "_f7L2XwGXjyszb4d1e2oxPybgD"]);
    (function() {
      var agl = document.createElement("script");
      agl.type = "text/javascript";
      agl.async = true;
      agl.src =
        "https://fxgate.baidu.com/angelia/fcagl.js?production=_f7L2XwGXjyszb4d1e2oxPybgD";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(agl, s);
    })();
  })();
}
import router from "../router";

export const wxLogin = () => {
  const API =
    "https://api.haobangni.com/auth/unified/weixin?sysclassid=163&redirectpage=";
  const { query, path } = router.currentRoute;
  const { origin, pathname } = window.location;
  const random = Math.random().toString();
  const url = urlBindQuery(`${origin}${pathname}?r=${random}#${path}`, {
    ...query
  });
  const callbackurl = encodeURIComponent(url);
  window.location.href = API + callbackurl;
};
export const urlBindQuery = (url, obj) => {
  const query = Object.keys(obj)
    .map(k => `${k}=${obj[k]}`)
    .join("&");
  return url + "?" + query;
};
