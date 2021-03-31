<template>
  <main>
    <template v-if="imgList.length > 0">
      <div class="scroll">
        <div class="img-wrap">
          <img
            v-for="img in imgList"
            :key="img"
            :src="img"
            @load="imgLoading = true"
          />
        </div>
        <template v-if="imgLoading">
          <div class="service-description" v-if="description || body">
            <tempalte v-if="description">
              <h3>服务说明</h3>
              <p>{{ description }}</p>
            </tempalte>
            <tempalte v-if="body">
              <h3>产品说明</h3>
              <p v-html="body"></p>
            </tempalte>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="loading flex-center">
        <van-loading slot="loading" type="circular" size="50px"></van-loading>
      </div>
    </template>
    <div class="btn-group" v-if="imgList.length > 0">
      <a class="flex-center" :href="`tel:${tel}`">电话咨询</a>
      <van-button
        @click="onMiddleBtn"
        v-if="buttonInfo.name && buttonInfo.router"
        >{{ buttonInfo.name }}</van-button
      >
      <van-button @click="onRightBtn">在线留言</van-button>
    </div>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`服务：${name}`"
    ></msg-book>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import msgBook from "components/popup/MsgBook.vue";
import { Button, Loading } from "vant";
import Vue from "vue";
Vue.use(Button).use(Loading);
import { jump } from "js/tools";

export default {
  mixins: [mixin],
  name: "servicedetail",
  data() {
    return {
      hbnserviceid: null,
      imgList: [],
      buttonInfo: {},
      guestBookShow: false,
      guestBookArgs: null,
      body: null,
      description: null,
      imgLoading: true,
      name: null
    };
  },
  components: {
    msgBook
  },
  methods: {
    init() {
      this.hbnserviceid = this.$route.query.hbnserviceid;
      this.getServiceDetail_GuestBook();
    },
    getServiceDetail_GuestBook() {
      this.$api
        .getServiceDetail_GuestBook({
          hbnserviceid: this.hbnserviceid,
          companyid: this.CompanyId
        })
        .then(res => {
          document.title = res.data.name;
          this.name = res.data.name;
          this.description = res.data.Description;
          this.body = res.data.Body;
          this.tel = res.data.tel;
          this.imgList = res.data.imgList;
          this.buttonInfo = res.data.dumpinfo;
          this.guestBookArgs = {
            demandvalues: res.data.demandValues,
            companyid: this.CompanyId
          };
          this.$wxshare(res.data.sharedata);
        });
    },
    onMiddleBtn() {
      jump.call(this, this.buttonInfo.router);
    },
    onRightBtn() {
      this.guestBookShow = true;
    }
  }
};
</script>
<style lang="scss" scoped>
main {
  overflow-y: hidden;
}
.loading {
  height: calc(100vh - 101px);
  width: 100vw;
}
.scroll {
  height: calc(100vh - 46px - 55px);
  overflow-y: auto;
  padding-bottom: 55px;
}
.img-wrap {
  img {
    width: 100vw;
  }
}
.service-description {
  border: 1px #18b777 solid;
  margin: 10px;
  padding: 0 10px 10px 10px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.6;
  h3 {
    display: inline-block;
    margin: 20px 0 10px;
    color: #fff;
    background: #18b777;
    padding: 5px 10px;
    border-radius: 5px;
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
    background: $green;
    color: #fff;
    border-radius: 0;
    padding: 0 15px;
    &:first-child {
      background: linear-gradient(90deg, #7dea8f, #51d167);
      border-top-left-radius: 18px;
      border-bottom-left-radius: 18px;
    }
    &:last-child {
      background: linear-gradient(90deg, #25b73e, #28b740);
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
    }
  }
}
</style>
