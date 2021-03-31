<template>
  <main class="baomu">
    <van-grid :column-num="3" class="sticky" v-show="!pickerDataLoding">
      <van-grid-item @click="area3.picker = true" class="van-ellipsis">
        <span class="picker-title">
          {{ area3.index ? area3Value.Name : "地区" }}
          <van-icon name="arrow-down" />
        </span>
      </van-grid-item>
      <van-grid-item @click="bmtype.picker = true" class="van-ellipsis">
        <span class="picker-title">
          {{ bmtype.index ? bmtypeValue.Name : "类型" }}
          <van-icon name="arrow-down" />
        </span>
      </van-grid-item>
      <van-grid-item @click="province.picker = true" class="van-ellipsis">
        <span class="picker-title">
          {{ province.bmprovince ? provinceValue.Name : "籍贯" }}
          <van-icon name="arrow-down" />
        </span>
      </van-grid-item>
    </van-grid>
    <van-list
      v-model="listLoading"
      :finished="listFinished"
      finished-text="没有更多了"
      @load="getList(0)"
      :offset="300"
      v-if="!noData"
      :immediate-check="false"
    >
      <transition-group name="fade" tag="ul" class="bm-list">
        <bm-card
          v-for="(item, index) in list"
          button="msg"
          :item="item"
          :key="item.Id + '-' + index"
          @leaveMsg="leaveMsg"
        ></bm-card>
      </transition-group>
      <button
        v-if="!isbindmobile && curpage >= 3"
        slot="loading"
        class="list-login-btn"
        @click="getList(0)"
      >
        <span style="color:#4d6">登陆</span>
        后查看更多信息
      </button>
    </van-list>
    <no-data :noData="noData" style="padding-top:56px"></no-data>
    <van-popup v-model="area3.picker" position="bottom">
      <van-picker
        ref="area3"
        show-toolbar
        title="地区"
        :columns="area3.data.map(i => i.Name)"
        :default-index="area3.index"
        @cancel="area3.picker = false"
        @confirm="area3Confirm"
      />
    </van-popup>
    <van-popup v-model="bmtype.picker" position="bottom">
      <van-picker
        ref="bmtype"
        show-toolbar
        title="类型"
        :columns="bmtype.data.map(i => i.Name)"
        :default-index="bmtype.index"
        @cancel="bmtype.picker = false"
        @confirm="bmtypeConfirm"
      />
    </van-popup>
    <van-popup v-model="province.picker" position="bottom">
      <van-picker
        ref="province"
        show-toolbar
        title="籍贯"
        :columns="provinceColumns"
        @cancel="province.picker = false"
        @change="provinceChange"
        @confirm="provinceConfirm"
      />
    </van-popup>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="guestBookDes"
    ></msg-book>
  </main>
</template>

<script>
import Vue from "vue";
import mixin from "js/mixin.js";
import msgBook from "components/popup/MsgBook.vue";
import bmCard from "components/card/BmCard.vue";
import { mapMutations } from "vuex";
import { $insertArray } from "js/tools.js";
import { Grid, GridItem, Icon, Popup, List, Picker, Button } from "vant";
import vueToTop from "vue-totop";
Vue.use(vueToTop);

Vue.use(Grid)
  .use(Button)
  .use(GridItem)
  .use(Icon)
  .use(Popup)
  .use(List)
  .use(Picker);

export default {
  name: "baomu",
  mixins: [mixin],
  components: {
    bmCard,
    msgBook
  },
  data() {
    return {
      bmtype: {
        data: [],
        picker: false,
        index: null
      },
      area3: {
        data: [],
        picker: false,
        index: null
      },
      province: {
        picker: false,
        data: [],
        bmprovince: 0,
        bmcity: 0
      },
      pickerDataLoding: true,
      listLoading: false,
      listFinished: false,
      list: [],
      curpage: 0,
      totalPage: 1,
      noData: false,
      guestBookShow: false,
      guestBookArgs: null,
      isbindmobile: false,
      guestBookDes: null
    };
  },
  computed: {
    provinceColumns() {
      let { data, bmprovince, bmcity } = this.province;
      if (data.length === 0) {
        return;
      }
      let arr = [
        {
          values: data.map(i => i.Name),
          defaultIndex: bmprovince
        },
        {
          values: data[bmprovince].Children.map(i => i.Name),
          defaultIndex: bmcity
        }
      ];
      return arr;
    },
    bmtypeValue() {
      let { data, index } = this.bmtype;
      let obj = { BinaryId: 0, Name: "" };
      if (data.length > 0) {
        let { BinaryId, Name } = data[index];
        this.$router.push({ query: { bmtypeid: BinaryId } }).catch(() => {});
        document.title = "精选保姆 · " + Name;
        obj = { BinaryId, Name };
      }
      return obj;
    },
    area3Value() {
      let { data, index } = this.area3;
      let obj = { Id: 0, Name: "" };
      if (data.length > 0) {
        let { Id, Name } = data[index];
        obj = { Id, Name };
      }
      return obj;
    },
    provinceValue() {
      let { data, bmprovince } = this.province;
      let obj = { Id: 0, Name: "" };
      if (data.length > 0) {
        let { Id, Name } = data[bmprovince];
        obj = { Id, Name };
      }
      return obj;
    },
    cityValue() {
      let { data, bmcity, bmprovince } = this.province;
      let obj = { Id: 0, Name: "" };

      if (data.length > 0) {
        let { Id, Name } = data[bmprovince].Children[bmcity];
        obj = { Id, Name };
      }
      return obj;
    }
  },
  activated() {
    document.title = "精选保姆 · " + this.bmtypeValue.Name;
    if (this.$route.query.reload) {
      this.pickerInit();
    }
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    init() {
      this.listFinished = false;
      this.list = [];
      this.curpage = 0;
      this.getPickerData();
    },
    getPickerData() {
      this.pickerDataLoding = true;
      let { $api, area3, bmtype, province } = this;
      let companyId = this.CompanyId;
      let obj = { Id: 0, BinaryId: 0, Name: "全部" };
      Promise.all([
        $api.getDistrict({ companyId }),
        $api.getBmtype({ companyId }),
        $api.getProvince({ showcity: true })
      ]).then(res => {
        area3.data = [obj, ...res[0].data];
        bmtype.data = [obj, ...res[1].data];
        province.data = [Object.assign(obj, { Children: [] }), ...res[2].data];
        province.data.forEach(i => {
          i.Children.unshift({ Id: 0, Name: "全部" });
        });
        this.pickerInit();
      });
    },
    pickerInit() {
      let { query } = this.$route;
      let { bmtype, area3, province } = this;
      //初始化bmtype
      let bmtypeIndex = bmtype.data.findIndex(
        i => i.BinaryId === +query.bmtypeid
      );
      bmtype.index = bmtypeIndex === -1 ? 0 : bmtypeIndex;
      let area3Index = area3.data.findIndex(i => i.Id === +query.area3);
      area3.index = area3Index === -1 ? 0 : area3Index;

      let bmprovinceIndex = province.data.findIndex(
        i => i.Id === +query.bmprovince
      );

      if (bmprovinceIndex !== -1) {
        province.bmprovince = bmprovinceIndex;
        let bmcityIndex = province.data[bmprovinceIndex].Children.findIndex(
          i => i.Id === +query.bmcity
        );
        province.city = bmcityIndex === -1 ? 0 : bmcityIndex;
      }
      this.pickerDataLoding = false;
      this.listInit();
    },
    listInit() {
      this.curpage = 0;
      this.list = [];
      this.listFinished = false;
      this.noData = false;
      this.getList(1);
    },
    getList(type) {
      if (!this.isbindmobile && this.curpage >= 3) {
        this.showLoginBox(this.afterLogin);
        return;
      }
      this.listLoading = true;

      this.curpage++;
      let data = {
        companyid: this.CompanyId,
        area3: this.area3Value.Id,
        bmtypeid: this.bmtypeValue.BinaryId,
        bmprovince: this.provinceValue.Id,
        bmcity: this.cityValue.Id
      };
      this.$shareApi("baomu", data);
      this.$api
        .getBmList({ curpage: this.curpage, pagesize: 15, ...data })
        .then(res => {
          let _this = this;
          if (type) {
            this.list = [];
          }
          this.isbindmobile = res.extdata.isbindmobile;
          $insertArray({
            _this,
            data: res.data,
            targetArray: this.list,
            totalPage: res.extdata.totalpage
          }).catch(() => {});
        });
    },
    provinceChange(picker) {
      this.province.bmprovince = picker.getIndexes()[0];
    },
    provinceConfirm(values, index) {
      let { province } = this;
      province.picker = false;
      province.bmprovince = index[0];
      province.bmcity = index[1];
      this.listInit();
    },
    area3Confirm(values, index) {
      this.area3.picker = false;
      if (this.area3.index === index) {
        return;
      }
      this.area3.index = index;
      this.listInit();
    },
    bmtypeConfirm(values, index) {
      this.bmtype.picker = false;
      if (this.bmtype.index === index) {
        return;
      }
      this.bmtype.index = index;
      this.listInit();
    },
    leaveMsg(args, des) {
      this.guestBookDes = des;
      this.guestBookArgs = args;
      this.guestBookShow = true;
    },
    afterLogin() {
      this.isbindmobile = true;
      this.getList(0);
    }
  }
};
</script>

<style lang="scss">
.baomu {
  .van-grid-item__content {
    padding: 10px;
    .van-grid-item__text {
      font-size: 14px !important;
    }
  }
  .van-list {
    padding-top: 36px;
  }

  .bm-list {
    color: #999;
    margin: 5px;
  }
}
.list-login-btn {
  background: transparent;
  border: 0;
  outline: 0;
}
</style>
