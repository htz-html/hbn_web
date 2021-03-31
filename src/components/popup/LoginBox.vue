<template>
  <van-popup
    v-model="$store.state.onLogin"
    position="bottom"
    round
    ref="login"
    @click-overlay="$store.state.onLogin = false"
  >
    <div class="login-container">
      <h6>*请先绑定手机</h6>
      <div>
        <van-field
          :border="false"
          clearable
          placeholder="请输入手机号"
          v-model="mobile"
        ></van-field>
      </div>
      <div class="imgcode-wrap">
        <van-field
          :border="false"
          clearable
          placeholder="请输入图形验证码"
          v-model="vcode"
        ></van-field>
        <img :src="imgCodeSrc" alt @click="getImgCode" />
      </div>
      <div class="smscode-wrap">
        <van-field
          :border="false"
          clearable
          placeholder="请输入短信验证码"
          v-model="smscode"
        ></van-field>
        <van-button
          slot="button"
          @click="getSms"
          :disabled="isCount"
          :class="{ disabled: isCount }"
        >
          <span>{{ isCount ? "重新发送" : "获取验证码" }}</span>
          <van-count-down
            v-show="isCount"
            ref="countDown"
            millisecond
            :time="60000"
            :auto-start="false"
            format="(ss秒)"
            @finish="finished"
          />
        </van-button>
      </div>
      <div>
        <van-button class="login-button" @click="loginByMobile">
          <span v-if="!loading">登陆</span>
          <van-loading
            slot="loading"
            size="24px"
            v-else
            type="spinner"
            color="#fff"
            >正在登陆中...</van-loading
          >
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Button, Loading, Field, Popup, CountDown, Toast } from "vant";
import Vue from "vue";
Vue.use(Button)
  .use(Popup)
  .use(Loading)
  .use(Field)
  .use(CountDown);
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      mobile: "",
      vcode: "",
      smscode: "",
      imgCodeSrc: "",
      imgCodeCD: false,
      buttonMsg: "获取验证码",
      isCount: false,
      loading: false
    };
  },
  computed: {
    ...mapGetters(["ClientId"])
  },
  watch: {
    "$store.state.onLogin": function(to) {
      if (to) {
        this.getImgCode();
        this.mobile = "";
        this.vcode = "";
        this.smscode = "";
      }
    }
  },
  created() {
    this.getImgCode();
  },
  methods: {
    ...mapMutations(["login", "hideLoginBox"]),
    getImgCode() {
      if (this.imgCodeCD) {
        return;
      }
      this.imgCodeCD = true;
      this.imgCodeSrc = `https://api.haobangni.com/auth/unified/vcode?hbnclientid=${
        this.ClientId
      }&random=${Math.random()}`;
      setTimeout(() => {
        this.imgCodeCD = false;
      }, 500);
    },
    getSms() {
      if (!this.vcode) {
        Toast({
          message: "请输入图形验证码",
          position: "bottom",
          duration: 1000
        });
        return;
      }
      if (!this.mobile) {
        Toast({
          message: "请输入手机号码",
          position: "bottom",
          duration: 1000
        });
        return;
      }
      this.$api
        .getSms({
          vcode: this.vcode,
          hbnclientid: this.ClientId,
          mobile: this.mobile,
          companyid: this.$store.state.CompanyId
        })
        .then(() => {
          this.isCount = true;
          this.$refs.countDown.start();
        });
    },
    loginByMobile() {
      if (!this.smscode) {
        Toast({
          message: "请输入短信验证码",
          position: "bottom",
          duration: 1000
        });
        return;
      }
      this.loading = true;
      this.$api
        .loginByMobile({
          mobile: this.mobile,
          smscode: this.smscode
        })
        .then(
          res => {
            Toast({
              message: res.errormsg,
              position: "bottom",
              duration: 1000
            });
            this.login({
              token: res.data.authorization,
              expired: res.data.expired
            });
            this.loading = false;
            this.hideLoginBox(this);
          },
          () => {
            this.loading = false;
          }
        );
    },
    finished() {
      this.$refs.countDown.reset();
      this.isCount = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.van-loading__text {
  color: #fff;
}

.login-container {
  margin: 10px;

  text-align: center;

  > div {
    padding: 10px 0;

    border-bottom: 1px solid #ccc;

    &:last-child {
      border-bottom: 0;
    }
  }
}

h6 {
  color: #e02424;

  font-size: 12px;
}

.van-field {
  padding: 0 1em;
}

.imgcode-wrap,
.smscode-wrap {
  display: flex;
  align-items: center;

  .van-field {
    flex: 1;

    width: 100%;
  }

  img,
  button {
    width: 150px;
    height: 36px;
  }
}

button {
  box-sizing: border-box;

  color: #fff;
  border: 1px solid #4d6;
  border-radius: 4px;
  outline: 0;
  background: #4d6;

  font-size: 16px;
  line-height: 32px;

  &.disabled {
    opacity: 0.7;
  }
}

.login-button {
  width: 100%;

  border-radius: 16px;
}

.van-count-down,
button > span {
  display: inline-block;

  color: #fff;

  font-size: 16px;
  line-height: 32px;
}
</style>
