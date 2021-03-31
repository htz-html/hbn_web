<template>
  <main>
    <van-tabs
      v-model="type"
      animated
      swipeable
      :swipe-threshold="5"
      color="#4d6"
      @change="tabChange"
      sticky
      :offset-top="46"
    >
      <van-tab v-for="index in tabData" :title="index" :key="index">
        <van-list
          v-model="listLoading"
          :finished="listFinished"
          finished-text="没有更多了"
          :immediate-check="false"
          v-if="!noData"
          @load="getOrderList(0)"
          :offset="300"
        >
          <transition-group
            name="fade"
            tag="ul"
            class="order-list"
            :class="{ empty: orderList.length === 0 }"
          >
            <order-card
              v-for="(order, index) in orderList"
              :key="order.Id + '-' + index"
              :order="order"
              :status="type"
            ></order-card>
          </transition-group>
        </van-list>
        <no-data :noData="noData" style="padding-top:56px"></no-data>
      </van-tab>
    </van-tabs>
  </main>
</template>

<script>
import orderCard from "components/card/OrderCard.vue";
import { $insertArray } from "js/tools.js";
import mixin from "js/mixin.js";
import { mapMutations, mapActions } from "vuex";
import { Tabs, Tab, List } from "vant";
import Vue from "vue";
Vue.use(Tabs)
  .use(Tab)
  .use(List);
export default {
  mixins: [mixin],
  components: {
    orderCard
  },
  name: "orderlist",
  data() {
    return {
      type: null,
      curpage: 0,
      tabData: ["全部", "未支付", "已支付", "已完成", "客服下单"],
      orderList: [],
      listLoading: false,
      listFinished: false,
      noData: false
    };
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),
    init() {
      this.type = this.$route.query.type;
      document.title = "订单列表";
      this.login();
      this.$wxshare();
    },
    login() {
      this.checkId({ needBind: false }).then(
        () => {
          this.getOrderList(1);
        },
        () => {
          this.showLoginBox(this.login);
        }
      );
    },
    getOrderList(type) {
      this.listLoading = true;
      this.curpage++;
      this.$api
        .getOrderList({
          args: {
            pagesize: 5,
            curpage: this.curpage,
            paytype: this.type
          }
        })
        .then(
          res => {
            let _this = this;
            if (type) {
              this.orderList = [];
            }
            $insertArray({
              _this,
              data: res.data,
              targetArray: this.orderList,
              totalPage: res.extdata.totalpage
            }).catch(() => {});
          },
          ({ is401 }) => {
            if (is401) {
              this.showLoginBox(this.init);
            }
          }
        );
    },
    tabChange(index) {
      this.type = index;

      this.$router.replace({ query: { type: index } });
      this.curpage = 0;
      this.orderList = [];
      this.listFinished = false;
      this.noData = false;
      this.getOrderList();
    }
  }
};
</script>

<style lang="scss" scoped>
.order-list {
  margin: 10px;
}
.van-list {
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
