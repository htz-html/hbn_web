<template>
  <main>
    <template v-if="imgList.length > 0">
      <div class="scroll">
        <div class="img-wrap">
          <img v-for="img in imgList" :key="img" :src="img" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="loading flex-center">
        <van-loading slot="loading" type="circular" size="50px"></van-loading>
      </div>
    </template>
    <div class="btn-group">
      <a
        class="flex-center"
        :href="`tel:${branchList[0].Tel}`"
        v-if="branchList.length === 1"
        >电话咨询</a
      >
      <van-button @click="showTelsList = true" v-else>电话咨询</van-button>
      <van-button @click="guestBookShow = true">我要应聘</van-button>
    </div>
    <van-popup
      v-model="showTelsList"
      position="bottom"
      round
      class="tels-popup"
    >
      <h3>点击拨打公司电话</h3>
      <ul>
        <li
          v-for="(branch, index) in branchList"
          :key="'branchTel' + branch.Tel + index"
        >
          <a :href="`tel:${branch.Tel}`">
            <key-value
              :label="branch.BranchName"
              :content="branch.Tel"
              labelWidth="5.4em"
            ></key-value>
          </a>
        </li>
      </ul>
    </van-popup>
    <msg-book
      :args="guestBookArgs"
      :des="`应聘：${jobTitle}`"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
    ></msg-book>
  </main>
</template>

<script>
import Vue from "vue";
import mixin from "js/mixin.js";
import msgBook from "components/popup/MsgBook.vue";
import { Popup, Loading, Button } from "vant";
Vue.use(Popup)
  .use(Loading)
  .use(Button);
export default {
  mixins: [mixin],
  name: "job",
  data() {
    return {
      imgList: [],
      guestBookShow: false,
      guestBookArgs: null,
      hbnserviceid: null,
      imgLoading: true,
      showTelsList: false,
      jobTitle: null,
      branchList: []
    };
  },
  components: {
    msgBook
  },
  methods: {
    init() {
      this.hbnserviceid = this.$route.query.id;
      this.getJobDetail();
    },
    getJobDetail() {
      this.$api
        .getJobDetail({
          companyid: this.CompanyId,
          hbnserviceid: this.hbnserviceid
        })
        .then(res => {
          this.imgList = res.data.imgList;
          this.jobTitle = res.data.Name;
          this.branchList = res.data.branchList;
          this.guestBookArgs = {
            demandvalues: res.data.demandValues || 8,
            companyid: this.CompanyId
          };
          this.$wxshare(res.data.sharedata);
        });
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

.tels-popup {
  text-align: center;

  h3 {
    text-align: center;
    margin: 20px;
    font-size: 16px;
    color: #888;
  }
  ul {
    margin-bottom: 30px;
    li {
      margin: 10px;
    }
    button {
      width: 100%;
      border: 1px solid #888;
      background: #fff;
      display: inline-block;
      height: 36px;
      border-radius: 5px;
      font-size: 14px;
    }
    a > p {
      padding: 2px 0;
      border-radius: 5px;
      // background: $green;
      box-sizing: border-box;
      width: 100%;
      display: inline-block;
      border: 1px solid #888;
      line-height: 32px;
    }
  }
}
</style>
