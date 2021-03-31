<template>
  <section>
    <loading-wrap :loading="loading"></loading-wrap>
    <transition-group name="list" tag="ul" class="list-container">
      <gz-card
        v-for="(item, index) in gzData"
        button="msg"
        :item="item"
        :key="item.Id + '-' + index"
        @leaveMsg="leaveMsg"
      ></gz-card>
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
import gzCard from "components/card/GzCard.vue";
import msgBook from "components/popup/MsgBook.vue";
import { $insertArray } from "js/tools.js";
import mixin from "js/mixin";
export default {
  components: {
    gzCard,
    msgBook
  },
  props: {
    brokername: {
      type: String
    }
  },
  mixins: [mixin],
  data() {
    return {
      brokerid: null,
      gzData: [],
      postData: null,
      loading: true,
      noData: false,
      guestBookArgs: {},
      guestBookShow: false,
      guestBookDes: null
    };
  },
  methods: {
    init() {
      this.brokerid = this.$route.query.brokerid;
      this.postData = {
        pagesize: 50,
        companyid: this.CompanyId,
        brokerid: this.brokerid
      };
      this.getGzList();
    },
    leaveMsg(args, des) {
      this.guestBookArgs = args;
      this.guestBookDes = des;
      this.guestBookShow = true;
    },
    getGzList() {
      this.$api.getGzList(this.postData).then(
        res => {
          let _this = this;
          $insertArray({
            _this,
            data: res.data,
            targetArray: this.gzData,
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
