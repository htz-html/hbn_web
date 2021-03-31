<template>
  <div id="app">
    <Header id="header"></Header>
    <keep-alive>
      <router-view
        ref="main"
        id="main"
        :class="{ 'footer-hide': !footShow }"
        v-if="$route.meta.keepAlive"
      />
    </keep-alive>
    <router-view
      ref="main"
      id="main"
      :class="{ 'footer-hide': !footShow }"
      v-if="!$route.meta.keepAlive"
    />

    <Footer id="footer" v-show="footShow" ref="footer"></Footer>
    <login-box></login-box>
  </div>
</template>
<script>
import Header from "components/layout/Header.vue";
import Footer from "components/layout/Footer.vue";
import loginBox from "components/popup/LoginBox.vue";
import { wxLogin } from "@/js/tools";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      CompanyList: [],
      guestBookData: {},
      footShowArray: ["home", "baomu", "yuesao", "broker", "service", "my"]
    };
  },

  components: {
    Header,
    Footer,
    loginBox
  },
  computed: {
    footShow() {
      let bool = this.footShowArray.indexOf(this.$route.name) > -1;
      if (bool) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$refs.footer.active = this.$route.name;
      }
      return bool;
    }
  },
  created() {
    this.wxLogin();
    this.IosKeybord();
  },
  methods: {
    ...mapActions(["checkId"]),
    wxLogin() {
      if (document.location.href.split("?")[0].split("#")[1] === "/authlogin") {
        return;
      }
      if (this.$store.state.env === "wechat") {
        this.checkId({ needBind: false }).then(
          res => {
            console.log(res);
          },
          () => {
            wxLogin();
          }
        );
      }
    },
    IosKeybord() {
      var isiOS = !!navigator.userAgent.match(/iPhone|mac|iPod|iPad|ios/i);
      if (isiOS) {
        // 判断是否是ios端
        let flag = false;
        let pageBackNormFunc;
        document.body.addEventListener("focusin", () => {
          // 软键盘弹起事件
          flag = true;
          pageBackNormFunc && clearTimeout(pageBackNormFunc);
        });
        document.body.addEventListener("focusout", () => {
          // 软键盘关闭事件
          if (flag) {
            pageBackNormFunc = setTimeout(function() {
              // // 当键盘收起的时候让页面回到原始位置
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }, 200);
          }
          flag = false;
        });
      }
    }
  }
};
</script>
<style lang="scss">
@import "//at.alicdn.com/t/font_1267129_2fzz34tbnhl.css";

#app {
  width: 100%;

  -webkit-overflow-scrolling: touch;

  #header {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;

    width: 100%;
  }

  #main {
    width: 100%;
    margin-top: 46px;
    margin-bottom: 50px;

    background: #f5f5f5;

    &.footer-hide {
      margin-bottom: 0;
    }
  }

  #footer {
    width: 100%;
  }
}
</style>
