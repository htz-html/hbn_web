<template>
  <header>
    <nav :class="$route.meta.headerClass" class="flex-center">
      <div class="header-left" @click="goback" v-show="showLeft">
        <van-icon name="arrow-left"></van-icon>
        <span v-text="history ? '返回' : '首页'"></span>
      </div>
      <div class="header-title" @click="$router.push({ name: 'home' })">
        <span>好邦伲-保姆大本营</span>
      </div>
      <div class="header-right" @click="onClickRight" v-if="showRight">
        <van-icon name="location-o"></van-icon>
        <span>{{ CompanyName }}</span>
      </div>
    </nav>
    <van-popup
      v-model="popupShow"
      position="right"
      style="height:100vh;width:100vw;"
    >
      <h1 class="pop-title">请选择服务地区</h1>
      <ul>
        <li v-for="company in CompanyList" :key="company.Name">
          <van-button
            plain
            hairline
            type="primary"
            @click="onChoiceCompany(company)"
            >{{ company.Name }}</van-button
          >
        </li>
      </ul>
    </van-popup>
  </header>
</template>

<script>
import { Button, Icon, Popup } from "vant";
import Vue from "vue";
Vue.use(Icon)
  .use(Button)
  .use(Icon)
  .use(Popup);
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      popupShow: false,
      showLeft: false,
      showRight: false,
      CompanyList: null,
      hideRight: [
        "readypay",
        "bmdetail",
        "ysdetail",
        "brokerdetail",
        "servicedetail",
        "serviceguestbook",
        "contractpay",
        "nCov"
      ]
    };
  },
  watch: {
    "$route.name": function() {
      this.showLeft = this.$route.name !== "home";
      this.showRight = this.hideRight.indexOf(this.$route.name) === -1;
    }
  },
  beforeCreate() {
    this.$api.getCompany().then(res => {
      this.CompanyList = res.data.chain;
      let companyId = this.$store.state.CompanyId;
      if (companyId > 0) {
        //先捕获local里的companyId
        let company = this.CompanyList.find(
          obj => obj.CompanyId === +companyId
        );
        this.$store.state.CompanyName = company.Name;
        // this.onChoiceCompany(company);
      } else {
        //local里没有companyId
        // let { env, expired, token } = this.$store.state;
        // let isExpired = token && new Date(expired) - new Date() > 0; //不过期
        // if (env === "wechat" && !isExpired) {
        //   return;
        // } else {
        this.popupShow = true;
        // }
      }
    });
  },
  computed: {
    ...mapGetters(["CompanyId", "CompanyName", "history", "doubleJump"])
  },
  methods: {
    ...mapMutations(["setCompany"]),
    onClickRight() {
      this.popupShow = true;
    },
    onChoiceCompany(company) {
      let data = {
        CompanyName: company.Name || "",
        CompanyId: company.CompanyId
      };
      this.setCompany(data);
      this.popupShow = false;
    },
    goback() {
      if (this.doubleJump) {
        this.$router.go(-2);
      } else {
        if (this.history) {
          this.$router.go(-1);
        } else {
          this.$router.push("/");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  z-index: 1;

  width: 100%;

  background: $green;

  &.ys {
    background: $purple;
  }

  i,
  span {
    display: inline-block;

    color: #fff;

    font-size: 16px !important;
    line-height: 46px !important;

    vertical-align: top;
  }

  .header-left,
  .header-right {
    position: absolute;
    top: 0;

    height: 46px;
  }

  .header-left {
    left: 10px;
  }

  .header-right {
    right: 10px;
  }
}

h1.pop-title {
  margin-top: 48px;
  margin-bottom: 20px;

  color: #888;

  font-size: 18px;

  text-align: center;
}

ul {
  margin: 0 0.25rem;

  li {
    display: inline-block;

    width: 6rem;
    margin: 4px 0.25rem;
  }

  > li > button {
    width: 100%;
  }
}
</style>
