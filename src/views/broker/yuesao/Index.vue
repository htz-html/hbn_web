<template>
  <main class="ysbroker">
    <div class="scroll">
      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="#4d6">
          <van-swipe-item v-for="item in banner" :key="item">
            <van-image :src="item" width="100%">
              <van-loading
                slot="loading"
                type="circular"
                size="30px"
              ></van-loading>
            </van-image>
          </van-swipe-item>
        </van-swipe>
      </div>
      <h2>母婴顾问</h2>
      <ul>
        <ys-broker-card
          v-for="item in list"
          :key="item.LoginName"
          :item="item"
        ></ys-broker-card>
      </ul>
      <img :src="img" alt />
    </div>
    <div class="btn-group">
      <a class="flex-center" :href="`tel:400-858-2233`">电话咨询</a>
      <van-button
        @click="
          $router.push({
            name: 'yuesao'
          })
        "
        >查看月嫂</van-button
      >
      <van-button @click="onRightBtn">在线留言</van-button>
    </div>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`来自母婴顾问页的留言`"
    ></msg-book>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import ysBrokerCard from "components/card/YsBrokerCard.vue";
import { Toast, Swipe, SwipeItem, Loading, Image } from "vant";
import Vue from "vue";
import msgBook from "components/popup/MsgBook.vue";

Vue.use(Swipe)
  .use(SwipeItem)
  .use(Loading)
  .use(Image);
export default {
  name: "baoker",
  mixins: [mixin],
  components: {
    ysBrokerCard,
    msgBook
  },
  data() {
    return {
      list: [],
      noData: false,
      loading: true,
      banner: [
        require("@/assets/ysbrokerBanner1.jpg"),
        require("@/assets/ysbrokerBanner2.jpg")
      ],
      img: require("@/assets/yeusaodetail.jpg"),
      guestBookShow: false,
      guestBookArgs: null
    };
  },
  methods: {
    init() {
      this.$shareApi("broker", { companyid: this.CompanyId });
      this.list = [];
      this.noData = false;
      this.loading = true;
      this.getBrokerList();
    },
    getBrokerList() {
      this.$api
        .getYsBrokerList({
          companyid: this.CompanyId,
          pagesize: 100,
          curpage: 1
        })
        .then(
          res => {
            if (res.errorcode === 1) {
              Toast.fail(res.errormsg);
              this.noData = false;
            } else {
              this.list = res.data;
              // $insertArray({
              //   _this,
              //   data: res.data,
              //   targetArray: this.list,
              //   totalPage: res.extdata.totalpage
              // }).catch(() => {});
            }
          },
          () => {
            this.noData = false;
          }
        );
    },
    onRightBtn() {
      this.guestBookArgs = {
        demandvalues: 2,
        datatypevalues: 1,
        companyid: this.CompanyId
      };
      this.guestBookShow = true;
    }
  }
};
</script>
<style lang="scss" scoped>
main {
  overflow-y: hidden;
}
.scroll {
  height: calc(100vh - 46px - 55px);
  overflow-y: auto;
  padding-bottom: 55px;
  > ul {
    margin: 0 10px;
  }
  > h2 {
    padding-left: 0.5em;
    margin: 0.5em;
    border-left: 5px solid #e80;
  }
  > img {
    width: 100%;
  }
}
.btn-group {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  padding: 5px 10px;
  height: 55px;
  border-top: 2px solid #eee;
  button,
  a {
    flex: 1;
    display: inline-block;
    line-height: 26px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border: 0;
    outline: 0;
    background: #944dd8;
    color: #fff;
    border-radius: 0;
    padding: 0 15px;
    &:first-child {
      border-top-left-radius: 18px;
      border-bottom-left-radius: 18px;
      background: linear-gradient(90deg, #a173de, #aa57f7);
    }

    &:last-child {
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
      background: linear-gradient(90deg, #913ae0, #7c00f0);
    }
  }
}
</style>
