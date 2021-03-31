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
        v-for="item in catalog.data"
        :title="item.Name"
        :key="item.Title"
      >
        <loading-wrap
          :loading="loading"
          content="正在获取经纪人列表..."
        ></loading-wrap>
        <transition-group name="fade" tag="ul" class="broker-list">
          <broker-card
            v-for="item in list"
            :key="item.LoginName"
            :item="item"
          ></broker-card>
        </transition-group>
      </van-tab>
    </van-tabs>

    <no-data :noData="noData"></no-data>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import brokerCard from "components/card/BrokerCard.vue";
import { $insertArray } from "js/tools.js";
import { Toast, Tab, Tabs } from "vant";
import Vue from "vue";
Vue.use(Tab).use(Tabs);
export default {
  name: "baoker",
  mixins: [mixin],
  components: {
    brokerCard
  },
  data() {
    return {
      catalog: {
        data: [],
        index: 0
      },
      list: [],
      noData: false,
      loading: true
    };
  },
  computed: {
    catalogValue() {
      let { data, index } = this.catalog;
      if (data.length > 0) {
        let { Tag, Name } = data[index];
        return { Tag, Name };
      } else {
        return { Tag: 0, Name: "" };
      }
    }
  },
  methods: {
    init() {
      this.list = [];
      this.noData = false;
      this.loading = true;
      this.getBrokerCatalog();
    },
    getBrokerCatalog() {
      this.$api
        .getBrokerCatalog({
          companyid: this.CompanyId
        })
        .then(res => {
          let data = res.data.map(obj => {
            return {
              Name: obj.Title,
              Tag: obj.Tag.toLowerCase() + "_" + obj.BinaryId
            };
          });
          this.catalog.data = [{ Name: "全部", Tag: "all_0" }, ...data];
          this.pickerInit();
        });
    },
    pickerInit() {
      let { tag } = this.$route.query;
      let catalogIndex = this.catalog.data.findIndex(i => i.Tag === tag);
      this.catalog.index = catalogIndex === -1 ? 0 : catalogIndex;
      this.tabChange();
    },
    tabChange() {
      let query;
      query = this.catalog.index ? { tag: this.catalogValue.Tag } : {};
      this.$router
        .push({
          query
        })
        .catch(() => {});
      this.list = [];
      window.scrollTo(0, 0);
      this.noData = false;
      this.getBrokerList(1);
    },
    getBrokerList() {
      let [Tag, BinaryId] = this.catalogValue.Tag.split("_");
      this.loading = true;
      let data = {
        companyid: this.CompanyId,
        Tag,
        BinaryId
      };
      this.$shareApi("broker", data);
      this.$api
        .getBrokerList({
          pagesize: 100,
          curpage: 1,
          ...data
        })
        .then(
          res => {
            if (res.errorcode === 1) {
              Toast.fail(res.errormsg);
              this.noData = false;
            } else {
              let _this = this;
              $insertArray({
                _this,
                data: res.data,
                targetArray: this.list,
                totalPage: res.extdata.totalpage
              }).catch(() => {});
            }
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
.broker-list {
  padding-bottom: 10px;
  margin: 10px;
}
</style>
