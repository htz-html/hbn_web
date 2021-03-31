<template>
  <main>
    <van-tabs
      v-model="catalog.index"
      swipeable
      :swipe-threshold="4"
      color="#4d6"
      @change="tabChange"
      sticky
      :offset-top="46"
    >
      <van-tab
        v-for="(item, index) in catalog.data"
        :title="item.Name"
        :key="item.Name + '+' + index"
      >
        <van-list
          v-model="listLoading"
          :finished="listFinished"
          :immediate-check="false"
          finished-text="没有更多了"
          v-if="!noData"
          @load="getServiceList(0)"
          :offset="200"
        >
          <transition-group name="fade" tag="ul" class="service-list">
            <service-card
              v-for="(item, index) in serviceList"
              :key="item.Id + '-' + index"
              :item="item"
            ></service-card>
          </transition-group>
        </van-list>
        <no-data :noData="noData" style="padding-top:56px"></no-data>
      </van-tab>
    </van-tabs>

    <div class="flex-center catalog-btn" @click="catalog.popup = true">
      <van-icon name="bars" />
    </div>
    <vueToTop
      class="flex-center"
      :type="11"
      :bottom="100"
      :top="1"
      color="#000"
    ></vueToTop>
    <van-popup v-model="catalog.popup" position="right" class="catalog-popup">
      <h3 @click="clearCompany">服务类别</h3>
      <ul>
        <li
          v-for="(item, index) in catalog.data"
          :key="item.Name + '-' + index"
          :class="{ active: index === catalog.index }"
          @click="buttonChange(index)"
        >
          {{ item.Name }}
        </li>
      </ul>
    </van-popup>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import serviceCard from "components/card/ServiceCard.vue";

import { $insertArray } from "js/tools.js";
import { Popup, Icon, List, Tabs, Tab, Toast } from "vant";
import Vue from "vue";
Vue.use(Popup)
  .use(List)
  .use(Icon)
  .use(Tabs)
  .use(Tab);

import vueToTop from "vue-totop";
Vue.use(vueToTop);

export default {
  mixins: [mixin],
  name: "service",
  components: {
    serviceCard
  },
  data() {
    return {
      catalog: {
        data: [],
        index: 0,
        popup: false
      },
      curpage: 0,
      serviceList: [],
      listLoading: false,
      listFinished: false,
      noData: false
    };
  },
  computed: {
    catalogValue() {
      let { data, index } = this.catalog;
      let obj = { BinaryId: 0, Name: "" };
      if (data.length > 0) {
        let { BinaryId, Name } = data[index];
        // eslint-disable-next-line vue/no-async-in-computed-properties
        this.$router.replace({ query: { type: BinaryId } }).catch(() => {});
        document.title = "服务列表-" + Name;
        obj = { BinaryId, Name };
      }
      return obj;
    }
  },
  watch: {
    "$route.query": function(to) {
      if (to.reload === 2) {
        this.pickerInit();
      }
    }
  },

  methods: {
    init() {
      this.listFinished = false;
      this.serviceList = [];
      this.curpage = 0;
      this.getServiceCatalog();
    },
    getServiceCatalog() {
      this.$api
        .getServiceCatalog({
          companyid: this.CompanyId
        })
        .then(res => {
          this.catalog.data = [{ Name: "全部", BinaryId: 0 }, ...res.data];
          this.pickerInit();
        });
    },
    pickerInit() {
      let { query } = this.$route;
      let { catalog } = this;
      let catalogIndex = catalog.data.findIndex(
        i => i.BinaryId === +query.type
      );
      catalog.index = catalogIndex === -1 ? 0 : catalogIndex;
      this.tabChange(catalog.index);
    },
    buttonChange(index) {
      this.catalog.index = index;
      this.catalog.popup = false;
    },
    tabChange() {
      this.curpage = 0;
      this.serviceList = [];
      window.scrollTo(0, 0);
      this.listFinished = false;
      this.noData = false;
      this.getServiceList(1);
    },
    getServiceList(type) {
      this.listLoading = true;
      this.curpage++;
      this.$shareApi("service", {
        companyid: this.CompanyId,
        type: this.catalogValue.BinaryId
      });

      this.$api
        .getServiceList({
          companyid: this.CompanyId,
          type: this.catalogValue.BinaryId,
          curpage: this.curpage,
          pagesize: 4
        })
        .then(res => {
          let _this = this;
          if (type) {
            this.serviceList = [];
          }
          $insertArray({
            _this,
            data: res.data,
            targetArray: this.serviceList,
            totalPage: res.extdata.totalpage
          }).catch(() => {});
        });
    },
    clearCompany() {
      window.localStorage.removeItem("CompanyId");
      window.localStorage.removeItem("token");
      this.$api.logout().then(() => {
        Toast("清除公司");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.van-list {
  // min-height: 100vh;
  box-sizing: border-box;
}

.service-list {
  padding-top: 10px;
  overflow: auto;
}
.v-top,
.catalog-btn {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  color: #000;
}
.catalog-btn {
  position: fixed;
  right: 30px;
  bottom: 150px;
  i {
    font-size: 24px;
  }
}
.catalog-popup {
  height: 100%;
  width: 270px; // 80*3+3*2*4
  h3 {
    text-align: center;
    margin: 20px;
  }
  ul {
    margin: 0 6px;
    font-size: 14px;
    li {
      width: 80px;
      box-sizing: border-box;
      text-align: center;
      margin: 4px 3px;
      display: inline-block;
      line-height: 16px;
      font-size: 15px;
      padding: 8px 0;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #333;
      background: #eee;
      &.active {
        background: rgb(213, 244, 233);
        color: rgb(43, 168, 111);
        border-color: rgb(213, 244, 233);
      }
    }
  }
}
</style>
