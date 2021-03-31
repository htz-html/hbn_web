<template>
  <main class="guzhu">
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
      <van-grid-item @click="bmSalary.picker = true" class="van-ellipsis">
        <span class="picker-title">
          {{ bmSalary.index ? bmStarValue.Name : "薪资范围" }}
          <van-icon name="arrow-down" />
        </span>
      </van-grid-item>
    </van-grid>
    <!-- 卡片 -->
    <van-list
      v-model="listLoading"
      :finished="listFinished"
      finished-text="没有更多了"
      v-if="!noData"
      @load="getList"
      :offset="300"
      :immediate-check="false"
    >
      <transition-group name="fade" tag="ul" class="gz-list">
        <gz-card
          v-for="(item, index) in list"
          button="msg"
          :item="item"
          :key="item.Id + '-' + index"
          @leaveMsg="leaveMsg"
        ></gz-card>
      </transition-group>
    </van-list>
    <no-data :noData="noData" style="padding-top:56px"></no-data>
    <!-- popup -->
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
    <van-popup v-model="bmSalary.picker" position="bottom">
      <van-picker
        ref="bmSalary"
        show-toolbar
        title="薪资"
        :columns="bmSalary.data.map(i => i.Name)"
        :default-index="0"
        @cancel="bmSalary.picker = false"
        @confirm="bmSalaryConfirm"
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
import mixin from "js/mixin.js";
import msgBook from "components/popup/MsgBook.vue";
import gzCard from "components/card/GzCard.vue";
import { $insertArray } from "js/tools.js";
import { Grid, GridItem, Icon, Popup, List, Picker } from "vant";
import Vue from "vue";
Vue.use(Grid)
  .use(GridItem)
  .use(Icon)
  .use(Popup)
  .use(List)
  .use(Picker);
export default {
  name: "guzhu",
  mixins: [mixin],
  components: {
    msgBook,
    gzCard
  },
  data() {
    return {
      bmtype: {
        data: [],
        index: 0,
        picker: false
      },
      area3: {
        data: [],
        index: 0,
        picker: false
      },
      bmSalary: {
        data: [],
        index: 0,
        picker: false
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
      guestBookDes: null
    };
  },
  computed: {
    bmtypeValue() {
      let { data, index } = this.bmtype;
      if (data.length > 0) {
        let { BinaryId, Name } = data[index];
        document.title = "精选保姆 · " + Name;

        return { BinaryId, Name };
      } else {
        return { BinaryId: 0, Name: "" };
      }
    },
    area3Value() {
      let { data, index } = this.area3;
      if (data.length > 0) {
        let { Id, Name } = data[index];
        return { Id, Name };
      } else {
        return { Id: 0, Name: "" };
      }
    },
    bmSalaryValue() {
      let { data, index } = this.bmSalary;
      if (data.length > 0) {
        let { min, max, Name } = data[index];
        return { min, max, Name };
      } else {
        return { min: 0, max: 0, Name: "" };
      }
    }
  },
  activated() {
    if (this.$route.query.reload) {
      this.pickerInit();
    }
  },
  methods: {
    init() {
      this.listFinished = false;
      this.list = [];
      this.curpage = 0;
      this.getPickData();
    },
    getPickData() {
      this.pickerDataLoding = true;
      let companyId = this.CompanyId;
      let { $api, area3, bmtype, bmSalary } = this;
      let obj = { Id: 0, BinaryId: 0, Name: "全部" };

      let data = [1000, 2000, 3000, 4000].map(i => {
        return {
          min: i,
          max: i + 1000,
          Name: `${i}-${i + 1000}`
        };
      });
      bmSalary.data = [
        { min: 0, max: 0, Name: "全部" },
        ...data,
        { min: 5000, max: 0, Name: "5000以上" }
      ];

      Promise.all([
        $api.getDistrict({ companyId }),
        $api.getBmtype({ companyId })
      ]).then(res => {
        area3.data = [obj, ...res[0].data];
        bmtype.data = [obj, ...res[1].data];
        this.pickerInit();
      });
    },
    pickerInit() {
      let { query } = this.$route;
      let { bmtype, area3 } = this;
      //初始化bmtype
      let bmtypeIndex = bmtype.data.findIndex(
        i => i.BinaryId === +query.bmtypeid
      );
      bmtype.index = bmtypeIndex === -1 ? 0 : bmtypeIndex;
      let area3Index = area3.data.findIndex(i => i.Id === +query.area3);
      area3.index = area3Index === -1 ? 0 : area3Index;

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
      this.listLoading = true;
      this.curpage++;
      let data = {
        curpage: this.curpage,
        pagesize: 15,
        companyid: this.CompanyId,
        area3: this.area3Value.Id,
        bmtypeid: this.bmtypeValue.BinaryId,
        Salary1: this.bmSalaryValue.min,
        Salary2: this.bmSalaryValue.max
      };
      this.$api.getGzList(data).then(res => {
        let _this = this;
        if (type) {
          this.list = [];
        }
        $insertArray({
          _this,
          data: res.data,
          targetArray: this.list,
          totalPage: res.extdata.totalpage
        }).catch(() => {});
      });
    },
    area3Confirm(values, index) {
      this.area3.index = index;
      this.area3.picker = false;
      this.listInit();
    },
    bmtypeConfirm(values, index) {
      this.bmtype.index = index;
      this.bmtype.picker = false;
      this.listInit();
    },
    bmSalaryConfirm(values, index) {
      this.bmSalary.index = index;
      this.bmSalary.picker = false;
      this.listInit();
    },
    leaveMsg(args, des) {
      this.guestBookDes = des;
      this.guestBookArgs = args;
      this.guestBookShow = true;
    }
  }
};
</script>

<style lang="scss">
.guzhu {
  .van-grid-item__content {
    padding: 10px;
    .van-grid-item__text {
      font-size: 14px !important;
    }
  }
  .van-list {
    padding-top: 36px;
  }

  .gz-list {
    color: #999;
    margin: 5px;
  }
}
</style>
