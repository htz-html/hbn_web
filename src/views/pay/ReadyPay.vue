<template>
  <main>
    <div class="order-info">
      <h3>订单详情</h3>
      <div class="mask flex-center" v-if="loading">
        <van-loading
          slot="loading"
          type="spinner"
          color="#4d6"
          size="24px"
          vertical
          >正在获取订单信息...</van-loading
        >
      </div>
      <template v-else>
        <ul>
          <li v-for="item in kvdata" :key="item.Key">
            <key-value :label="item.Key" :content="item.Value"></key-value>
          </li>
          <li v-if="sign">
            <key-value label="合同详情">
              <span
                slot="content"
                class="contract-btn"
                @click="$singleImgPreview(contractImageUrl)"
                >点击查看合同详情及条款</span
              >
            </key-value>
          </li>
        </ul>
        <h1 class="money" style="color:#4a6" v-if="ispay">
          已付款：￥{{ haspay }}
        </h1>
        <h1 class="money" v-else>￥{{ mustpay }}</h1>
      </template>
    </div>

    <div class="signature" v-if="sign">
      <template v-if="!ispay">
        <h4>请在此区域签名</h4>
        <vueSignature
          :disabled="ispay"
          ref="signature"
          :sigOption="option"
          :w="'100%'"
          :h="'160px'"
          :defaultUrl="signature"
        ></vueSignature>
        <button @click="reSign" class="reSign">重新签名</button>
      </template>
      <template v-else>
        <h3>合同签字</h3>
        <van-image :src="signature" width="100%" height="160px">
          <van-loading slot="loading" type="circular" size="20px" />
        </van-image>
      </template>
    </div>

    <div class="chioce-payment" v-if="!ispay">
      <h3>选择支付方式</h3>
      <ul>
        <li
          v-for="item in payment"
          :key="item.name"
          @click="chiocePayment(item.icon)"
        >
          <div class="left">
            <van-icon :name="item.icon" :color="item.color" />
            <span>{{ item.name }}</span>
          </div>
          <div class="right">
            <van-icon
              name="checked"
              color="#4d6"
              v-if="payIndex === item.icon"
            />
            <van-icon name="circle" v-else />
          </div>
        </li>
      </ul>
      <van-checkbox
        v-if="sign"
        v-model="checked"
        shape="square"
        class="pay-check"
        checked-color="#4d6"
        >我已确认合同信息，支付表示接受服务条款。</van-checkbox
      >
      <div class="check-btn">
        <van-button @click="onPay" :disabled="!!this.loading || this.loading2"
          >确认支付</van-button
        >
      </div>
    </div>
    <van-dialog v-model="showDialog" class="yindao">
      <img :src="yindaoImg" alt />
    </van-dialog>
    <div class="pay-loading" v-show="loading2">
      <i class="iconfont iconloading2"></i>
      <span>支付中...</span>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Button, Loading, Dialog, Icon, Toast, checkbox, Image } from "vant";
import VueSignature from "vue-signature";
Vue.use(VueSignature);
import Vue from "vue";
Vue.use(Button)
  .use(Dialog)
  .use(Icon)
  .use(Image)
  .use(checkbox)
  .use(Loading);
export default {
  name: "readypay",
  data() {
    return {
      payIndex: 0,
      kvdata: [],
      mustpay: null,
      haspay: null,
      loading: 2,
      loading2: false,
      res: null,
      miniProgram: 0,
      showDialog: false,
      yindaoImg: require("@/assets/yindao.png"),
      routerHash: {},
      signature: "",
      sign: false,
      contractImageUrl: "",
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "transparent"
      },
      checked: false,
      ispay: true
    };
  },
  computed: {
    ...mapGetters(["env"]),
    payment() {
      let ali = {
        name: "支付宝",
        icon: "alipay",
        color: "#00a3ee"
      };
      let wechat = {
        name: "微信支付",
        icon: "wechat",
        color: "#1AAD19"
      };
      let result = [];
      switch (this.env) {
        case "wechat":
          result = [wechat];
          break;
        case "alipay":
          result = [ali];
          break;
        case "html":
          result = [ali, wechat];
      }
      return result;
    }
  },

  created() {
    this.init();
  },
  methods: {
    ...mapActions(["checkId"]),
    init() {
      this.isminiProgram();
      this.payIndex = this.env === "html" ? "alipay" : this.env;
      this.checkTradeNo();
    },
    checkTradeNo() {
      let { fun, trade_no } = this.$route.query;
      let hash = {
        serviceorder: { name: "orderlist", query: { type: 2 } },
        empcreditpay: { name: "my" },
        contract: { name: "my" }
      };
      if (trade_no) {
        this.$api.checkTradeNo({ trade_no }).then(res => {
          if (!res.data.ispay) {
            this.readyPayInfo();
          } else {
            Toast.success({ message: "支付成功" });
            setTimeout(() => {
              if (fun === "pxorder") {
                if (this.$route.query.returnUrl) {
                  window.location.href = this.$route.query.returnUrl;
                } else {
                  this.router.push({ name: "my" });
                }
                return;
              }
              this.$router.push(hash[fun]);
            }, 1000);
          }
        });
      } else {
        this.readyPayInfo();
      }
    },
    readyPayInfo() {
      let payment;
      if (this.env === "wechat") {
        payment = "weixin";
      } else if (this.env === "alipay") {
        payment = "alipay";
      } else {
        console.log("log: readyPayInfo -> payment", payment);
      }
      let h5 = this.env === "html" ? 1 : 0;
      this.$api
        .readyPayInfo({
          ...this.$route.query,
          payment,
          h5,
          isminipg: this.miniProgram
        })
        .then(
          res => {
            if (res.data.auth) {
              let callbackurl = encodeURIComponent(
                `${window.location.href}&random=${Math.random()}`
              );
              window.location.href = res.data.auth + callbackurl;
            } else {
              this.ispay = res.data.ispay;
              this.kvdata = res.data.kvdata;
              this.mustpay = res.data.mustpay;
              this.haspay = res.data.haspay;
              this.signature = res.data.signature;
              this.contractImageUrl = res.data.contractImg;
              this.loading--;
              this.sign = res.data.sign;
              this.$wxshare(res.extdata.sharedata);
            }
          },
          ({ toast }) => {
            let a = toast.message;
            let second = 3;
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = a + `倒计时 ${second} 秒`;
              } else {
                toast.clear();
                clearInterval(timer);
              }
            }, 1000);
          }
        );
    },
    chiocePayment(index) {
      if (this.env !== "html") {
        if (this.env !== index) {
          this.showDialog = true;
          return;
        }
      } else {
        this.payIndex = index;
      }
    },
    onPay() {
      if (this.loading || this.loading2) {
        return;
      }
      if (this.sign) {
        if (!this.checked) {
          Toast("请勾选“同意接受服务条款”");
          return;
        }
        if (this.$refs.signature.isEmpty()) {
          Toast("请先进行签名");
          return;
        } else {
          this.signature = this.$refs.signature.save();
        }
      }
      this.loading2 = true;
      let payment = this.payIndex;
      if (payment === "wechat") {
        payment = "weixin";
      }
      let h5 = this.env === "html" ? 1 : 0;
      this.$api
        .readyPay({
          args: {
            payment,
            h5,
            isminipg: this.miniProgram,
            ...this.$route.query,
            signature: this.signature
          }
        })
        .then(
          res => {
            let href = "https://www.haobangni.com/hbnls/#/readypay?";
            let query = this.$route.query;
            query.trade_no = res.data.trade_no;
            let qs = Object.keys(query)
              .map(key => {
                return `${key}=${query[key]}`;
              })
              .join("&");
            let callbackurl = encodeURIComponent(href + qs);
            window.location.href = `https://www.haobangni.com/pay/pay.html?trade_no=${res.data.trade_no}&callbackurl=${callbackurl}`;
            this.loading2 = false;
          },
          () => {
            this.loading2 = false;
          }
        )
        .catch(() => {
          this.loading2 = false;
        });
    },
    reSign() {
      this.$refs.signature.clear();
    },
    isminiProgram() {
      if (this.env === "wechat") {
        // window.__wxjs_environment === 'miniprogram' 为true 则表示在微信小程序的环境
        if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            () => {
              this.miniProgram =
                window.__wxjs_environment === "miniprogram" ? 1 : 0;
            },
            false
          );
          this.loading--;
        } else {
          this.miniProgram =
            window.__wxjs_environment === "miniprogram" ? 1 : 0;
          this.loading--;
        }
      } else {
        this.loading--;
      }
    }
  }
};
</script>
<style lang="scss">
.van-checkbox.pay-check {
  text-align: center;
  justify-content: center;
  background: #fff;
  height: 51px;
  .van-icon {
    outline: 1px solid #000;
  }
  .van-checkbox__label {
    font-weight: 1000;
    font-size: 12px;
    border-bottom: 1px solid #000;
  }
}
</style>

<style lang="scss" scoped>
.signature {
  background: #eee;
  position: relative;
  h4 {
    position: absolute;
    color: $orange;
    font-size: 12px;
    left: 10px;
    top: 10px;
    padding: 0;
  }
  .reSign {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: transparent;
    border: 0;
    outline: 0;
    padding: 0;
    color: red;
  }
}
.yindao {
  padding: 10px;
  img {
    width: 100%;
  }
}
.pay-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 0 7px;
  i {
    font-weight: 500;
    font-size: 40px !important;
    animation: loading 1s infinite;
  }
  span {
    padding: 10px 0;
    font-size: 14px;
    font-weight: 700;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dialog {
  padding: 20px 20px 0;
  font-size: 18px;
  li {
    line-height: 28px;
  }
}
.mask {
  background: #fff;
  height: 200px;
}
.order-info {
  ul {
    padding: 20px;
    background: #fff;
    font-size: 16px;
    li {
      color: #888;
    }
  }
  .money {
    color: #e22;
    background: #fff;
    padding: 0 20px 10px;
    text-align: right;
  }
}
h3 {
  font-size: 16px;
  padding: 10px 1em;
  color: #333;
  font-weight: 500;
}
.chioce-payment {
  li {
    display: flex;
    background: #fff;
    justify-content: space-between;
    align-items: center;
    color: #000;
    border-bottom: 1px solid #f5f5f5;
    padding: 5px 0;
    .left {
      background: #fff;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 18px;
      }
      i {
        font-size: 32px;
      }
    }
    .right {
      font-size: 24px;
    }
    span,
    i {
      display: inline-block;
      vertical-align: middle;
      line-height: 40px;
    }
    i {
      margin: 0 20px;
    }
  }
  .check-btn {
    margin: 20px;
    button {
      width: 100%;
      border: 0;
      background: $green;
      outline: 0;
      display: inline-block;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      border-radius: 5px;
      color: #fff;
      transform: color 0.1s;
      &.disabled {
        opacity: 0.5;
      }
    }
  }
}
.contract-btn {
  color: #07f;
}
</style>
