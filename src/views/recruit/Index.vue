<template>
  <main>
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="#4d6">
        <van-swipe-item
          v-for="(item, index) in banner"
          :key="item + '-' + index"
        >
          <van-image :src="item" width="100%">
            <van-loading
              slot="loading"
              type="circular"
              size="30px"
            ></van-loading>
          </van-image>
        </van-swipe-item>
      </van-swipe>
      <h1>职位信息</h1>
    </div>

    <van-list
      v-model="listLoading"
      :finished="listFinished"
      :immediate-check="false"
      finished-text="没有更多了"
      v-if="!noData"
      @load="getRecruitList(0)"
      :offset="200"
    >
      <transition-group name="fade" tag="ul" class="job-list">
        <li
          v-for="item in jobList"
          :key="'job' + item.Id"
          @click="$router.push({ name: 'job', query: { id: item.Id } })"
        >
          <img :src="item.img" alt class="pull-left" width="80" height="80" />
          <h2>
            <span class="job-title">{{ item.岗位 }}</span>
            <span class="job-salary">{{ item.薪资 }}</span>
          </h2>
          <h6>
            <span class="tag">{{ item.人数 }}</span>
            <span class="tag">{{ item.学历 }}</span>
            <span class="tag">{{ item.专业 }}</span>
          </h6>
          <h6>
            <span class="tag">{{ item.经验 }}</span>
            <span class="tag">{{ item.年龄 }}</span>
          </h6>
        </li>
      </transition-group>
    </van-list>
    <no-data :noData="noData" style="padding-top:56px"></no-data>
    <vueToTop
      class="flex-center"
      :type="11"
      :bottom="100"
      :top="1"
      color="#000"
    ></vueToTop>
  </main>
</template>

<script>
import mixin from "js/mixin";
import Vue from "vue";
import { List, Swipe, SwipeItem, Image, Loading } from "vant";
import vueToTop from "vue-totop";
Vue.use(List)
  .use(vueToTop)
  .use(Swipe)
  .use(SwipeItem)
  .use(Image)
  .use(Loading);
import { $insertArray } from "js/tools.js";

export default {
  mixins: [mixin],
  data() {
    return {
      banner: [
        require("@/assets/recruit1.jpg"),
        require("@/assets/recruit2.jpg"),
        require("@/assets/recruit3.png")
      ],
      curpage: 0,
      listLoading: false,
      listFinished: false,
      noData: false,
      jobList: []
    };
  },
  methods: {
    init() {
      this.$shareApi("hr", { companyid: this.CompanyId });
      this.listFinished = false;
      this.jobList = [];
      this.curpage = 0;
      this.getRecruitList();
    },
    getRecruitList() {
      this.listLoading = true;
      this.curpage++;
      this.$api
        .getRecruitList({
          companyid: this.CompanyId,
          curpage: this.curpage,
          pagesize: 10
        })
        .then(res => {
          let _this = this;

          $insertArray({
            _this,
            data: res.data.map(i => {
              let { hr, img, Id } = i;
              return { ...hr, img, Id };
            }),
            targetArray: this.jobList,
            totalPage: res.extdata.totalpage
          }).catch(() => {});
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.banner {
  padding: 10px;
  h1 {
    display: block;
    position: relative;
    text-indent: 20px;
    margin: 10px 0;
    font-size: 16px;
  }
  h1::before {
    position: absolute;
    content: "";
    display: block;
    width: 5px;
    height: 100%;
    background: $green;
  }
}
.job-list {
  margin-top: -20px;
}
ul {
  padding: 10px;
}
li {
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 8px;
  padding: 10px;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(172, 183, 191, 0.5);
  overflow: hidden;
  img {
    margin-right: 10px;
  }
  h2 {
    font-size: 16px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    .job-title {
      color: #137a21;
    }
    .job-salary {
      color: #fc703e;
    }
  }
  h6 {
    span {
      display: inline-block;
      color: #999;
      display: inline-flex;
      align-items: center;
      line-height: 26px;
      font-size: 14px;
      &::after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 14px;
        vertical-align: middle;
        background: #999;
        margin: 0 10px;
      }
      &:last-child::after {
        display: none;
      }
    }
  }
}
.v-top {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  color: #000;
}
</style>
