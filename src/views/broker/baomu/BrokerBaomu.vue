<template>
  <section>
    <loading-wrap :loading="loading"></loading-wrap>
    <transition-group name="list" tag="ul" class="list-container">
      <bm-card
        v-for="item in bmData"
        button="msg"
        :item="item"
        :key="item.Id"
        @leaveMsg="leaveMsg"
      ></bm-card>
    </transition-group>
    <no-data :noData="noData"></no-data>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`经纪人姓名：${brokername}，ID：${brokerid}，` + guestBookDes"
    ></msg-book>
  </section>
</template>

<script>
import bmCard from "components/card/BmCard.vue";
import mixin from "js/mixin";
import msgBook from "components/popup/MsgBook.vue";
import { $insertArray } from "js/tools.js";

export default {
  components: {
    bmCard,
    msgBook
  },
  mixins: [mixin],
  data() {
    return {
      brokerid: null,
      bmData: [],
      postData: null,
      loading: true,
      noData: false,
      guestBookArgs: {},
      guestBookShow: false,
      guestBookDes: null
    };
  },
  props: {
    brokername: {
      type: String
    }
  },
  methods: {
    init() {
      this.brokerid = this.$route.query.brokerid;
      this.postData = {
        pagesize: 50,
        companyid: this.CompanyId,
        brokerid: this.brokerid
      };
      this.getBmList();
    },
    leaveMsg(args, des) {
      this.guestBookDes = des;
      this.guestBookArgs = args;
      this.guestBookShow = true;
    },
    getBmList() {
      this.$api.getBmList(this.postData).then(
        res => {
          let _this = this;
          $insertArray({
            _this,
            data: res.data,
            targetArray: this.bmData,
            totalPage: res.extdata.totalpage
          }).catch(() => {});
        },
        () => {
          this.noData = false;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.list-container {
  margin: 5px;

  color: #999;
}
</style>
