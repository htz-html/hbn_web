import axios from "axios";
import { wxLogin } from "@/js/tools";
import { Toast } from "vant";
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? "https://webapi3.haobangni.com/"
    : "https://api.haobangni.com/";
// axios.defaults.baseURL = "https://webapi3.haobangni.com/"
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  "Content-Type": "application/json"
};

axios.interceptors.request.use(
  request => {
    if (localStorage.token) {
      request.headers.authorization = localStorage.token;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);
let timeout;

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (error.hasOwnProperty("response")) {
      if (error.response.status === 401) {
        if (navigator.userAgent.toLowerCase().indexOf("micromessenger") >= 0) {
          //是微信，跳转至微信登陆
          setTimeout(() => {
            wxLogin();
          }, 500);
        } else {
          return Promise.reject(error);
        }
      } else if (error.response.status === 500) {
        //404，500等问题
        Toast.fail("服务器发生了错误,请稍后再试");
      } else {
        Toast.fail("服务器发生了错误。");
      }
    }
  }
);
export default {
  $post(url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, data).then(
        res => {
          if (res.data.errorcode === 1) {
            let toast = Toast.fail(res.data.errormsg);
            reject({
              is401: false,
              res,
              toast
            });
          } else {
            resolve(res.data);
          }
        },
        res => {
          //出现401
          reject({
            is401: true,
            res
          });
        }
      );
    });
  },
  $get(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params
        })
        .then(
          res => {
            if (res.data.errorcode === 1) {
              let toast = Toast.fail(res.data.errormsg);
              reject({
                is401: false,
                res,
                toast
              });
            } else {
              resolve(res.data);
            }
          },
          res => {
            //出现401
            reject({
              is401: true,
              res
            });
          }
        );
    });
  }
};
