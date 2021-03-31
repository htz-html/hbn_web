<template>
  <main class="yuesao">
    <!-- <van-grid :column-num="2" class="sticky" v-show="!pickerDataLoding">
      <van-grid-item @click="ysStar.picker = true" class="van-ellipsis">
        <span class="picker-title">
          {{ ysStar.index ? ysStarValue.Name : "星级" }}
          <van-icon name="arrow-down" />
        </span>
      </van-grid-item>
      <van-grid-item @click="ysSalary.picker = true" class="van-ellipsis">
        <span class="picker-title">
          {{ ysSalary.index ? ysSalaryValue.Name : "薪资范围" }}
          <van-icon name="arrow-down" />
        </span>
      </van-grid-item>
    </van-grid> -->

    <van-list
      v-model="listLoading"
      :finished="listFinished"
      finished-text="没有更多了"
      v-if="!noData"
      @load="getList(0)"
      :offset="300"
      :immediate-check="false"
    >
      <transition-group name="fade" tag="ul" class="ys-list">
        <ys-card
          v-for="(item, index) in list"
          button="msg"
          :item="item"
          :key="item.Id + '-' + index"
          @leaveMsg="leaveMsg"
        ></ys-card>
      </transition-group>
      <button
        v-if="!isbindmobile && curpage >= 1"
        slot="loading"
        class="list-login-btn"
        @click="getList(0)"
      >
        <span style="color:#a7d">登陆</span>
        后查看更多信息
      </button>
    </van-list>
    <no-data :noData="noData" style="padding-top:56px"></no-data>

    <van-popup v-model="ysStar.picker" position="bottom">
      <van-picker
        ref="ysStar"
        show-toolbar
        title="星级"
        :columns="ysStar.data.map(i => i.Name)"
        :default-index="0"
        @cancel="ysStar.picker = false"
        @confirm="ysStarConfirm"
      />
    </van-popup>
    <van-popup v-model="ysSalary.picker" position="bottom">
      <van-picker
        ref="ysSalary"
        show-toolbar
        title="薪资"
        :columns="ysSalary.data.map(i => i.Name)"
        :default-index="0"
        @cancel="ysSalary.picker = false"
        @confirm="ysSalaryConfirm"
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
import ysCard from "components/card/YsCard.vue";
import { mapMutations } from "vuex";

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
  name: "yuesao",
  mixins: [mixin],
  components: {
    msgBook,
    ysCard
  },
  data() {
    return {
      ysStar: {
        data: [],
        index: 0,
        picker: false
      },
      ysSalary: {
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
      guestBookDes: null,
      isbindmobile: false
    };
  },
  computed: {
    ysStarValue() {
      let { data, index } = this.ysStar;
      if (data.length > 0) {
        let { value, Name } = data[index];
        document.title = "精选月嫂 · " + Name;
        return { value, Name };
      } else {
        return { value: 0, Name: "" };
      }
    },
    ysSalaryValue() {
      let { data, index } = this.ysSalary;
      if (data.length > 0) {
        let { min, max, Name } = data[index];
        return { min, max, Name };
      } else {
        return { min: 0, max: 0, Name: "" };
      }
    }
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    init() {
      this.$shareApi("yuesao", { companyid: this.CompanyId });
      this.getPickerData();
    },
    getPickerData() {
      this.pickerDataLoding = true;

      let data = [6000, 8000, 10000, 12000].map(i => {
        return {
          min: i,
          max: i + 2000,
          Name: `${i}-${i + 2000}`
        };
      });
      let dataBefore = [
        {
          min: 0,
          max: 0,
          Name: "全部"
        },
        {
          min: 0,
          max: 6000,
          Name: "6000以下"
        }
      ];
      let dataAfter = [
        {
          min: 14000,
          max: 0,
          Name: "14000以上"
        }
      ];
      this.ysSalary.data = [...dataBefore, ...data, ...dataAfter];
      this.ysStar.data = [1, 2, 3, 4, 5].map(i => {
        return {
          value: i,
          Name: `${i}星`
        };
      });
      this.ysStar.data.unshift({ value: 0, Name: "全部" });
      this.pickerInit();
    },
    pickerInit() {
      let { query } = this.$route;
      let { ysStar } = this;
      let ysStarIndex = ysStar.data.findIndex(i => i.value === +query.ysstar);
      ysStar.index = ysStarIndex === -1 ? 0 : ysStarIndex;
      this.pickerDataLoding = false;
      this.listInit();
    },

    ysSalaryConfirm(values, index) {
      this.ysSalary.picker = false;
      if (this.ysSalary.index === index) {
        return;
      }
      this.ysSalary.index = index;
      this.listInit();
    },
    ysStarConfirm(values, index) {
      this.ysStar.picker = false;
      if (this.ysStar.index === index) {
        return;
      }
      this.ysStar.index = index;
      this.listInit();
    },
    listInit() {
      this.curpage = 0;
      this.list = [];
      this.listFinished = false;
      this.noData = false;
      this.getList();
    },
    getList() {
      if (!this.isbindmobile && this.curpage >= 1) {
        this.showLoginBox(this.afterLogin);
        return;
      }
      this.listLoading = true;
      this.curpage++;
      let data = {
        curpage: this.curpage,
        pagesize: 15,
        companyid: this.CompanyId
      };
      data.starcount = this.ysStarValue.value;
      data.Salary1 = this.ysSalaryValue.min;
      data.Salary2 = this.ysSalaryValue.max;
      this.$api.getYsList(data).then(res => {
        let _this = this;
        $insertArray({
          _this,
          data: res.data,
          targetArray: this.list,
          totalPage: res.extdata.totalpage
        }).catch(() => {});
      });
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
.yuesao {
  .van-grid-item__content {
    padding: 10px;
    .van-grid-item__text {
      font-size: 14px !important;
    }
  }
  .van-list {
    padding-top: 5px;
  }

  .ys-list {
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
