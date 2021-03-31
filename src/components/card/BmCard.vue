<template>
  <li
    class="card"
    @click="$router.push({ name: 'bmdetail', query: { bmid: item.Id } })"
  >
    <section class="top clearfix">
      <van-image
        :src="item.FilePath"
        width="105px"
        height="120px"
        class="pull-left"
        radius="10"
        @click.stop="$singleImgPreview(preview)"
      >
        <van-loading slot="loading" type="circular" size="20px" />
      </van-image>
      <div class="card-content">
        <h1>
          <span>{{ item.Name }}</span>
          <span style="color:#E02424"
            >{{ item.Salary1 }} ~ {{ item.Salary2 }}元/月</span
          >
        </h1>
        <p class="tag-one">
          <span
            class="card-tag"
            style="background:#fdede4;color:#e96c4b"
            v-if="item.BmTypeValue"
            >{{ item.BmTypeValue }}</span
          >
          <span
            class="card-tag"
            style="background:#d5f4e9;color:#2ba86f"
            v-if="item.BmProvince"
            >{{ item.BmProvince }}</span
          >
          <span
            class="card-tag"
            style="background:#e1eaf6;color:#4070d0"
            v-if="item.BmEatAndSleepValue"
            >{{ item.BmEatAndSleepValue }}</span
          >
        </p>
        <p class="van-ellipsis tag-two">
          <span v-if="item.Age">{{ item.Age }}岁</span>
          <span v-if="item.WorkYear">{{ item.WorkYear }}年</span>
          <span v-if="item.BmEduValue">{{ item.BmEduValue }}</span>
          <span v-if="item.BmLanValue">{{ item.BmLanValue }}</span>
          <span v-if="item.BmCertificateValue">{{
            item.BmCertificateValue
          }}</span>
        </p>
        <p class="van-ellipsis">{{ item.Street }}</p>
      </div>
    </section>
    <div class="divider divider-1"></div>
    <section class="bottom">
      <p>编号：{{ item.Id }}</p>
      <van-button
        type="primary"
        round
        v-if="button === 'detail'"
        @click.stop="
          $router.push({ name: 'bmdetail', query: { bmid: item.Id } })
        "
        >查看详情</van-button
      >
      <van-button
        type="primary"
        round
        v-if="button === 'msg'"
        @click.stop="onLeaveMsg(item.Id)"
        >给我留言</van-button
      >
    </section>
  </li>
</template>

<script>
import { Image, Loading, Button } from "vant";
import Vue from "vue";
Vue.use(Button)
  .use(Loading)
  .use(Image);
export default {
  props: {
    item: {
      type: Object
    },
    button: {
      type: String
    }
  },
  computed: {
    preview() {
      return this.item.FilePath.replace("_min.", ".");
    }
  },
  methods: {
    onLeaveMsg() {
      let args = {
        dataid: this.item.Id,
        datatypevalues: 1,
        demandvalues: 1,
        companyid: this.item.CompanyId,
        brokerid: this.item.BrokerId
      };
      let des = `保姆姓名：${this.item.Name}，保姆ID：${this.item.Id}`;
      this.$emit("leaveMsg", args, des);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: space-between;

  margin-bottom: 8px;

  color: #333;

  font-size: 16px;
  font-weight: 700;
}

.tag-two {
  margin: 5px 0;

  > span {
    &:last-child::after {
      content: "";
    }

    &::after {
      content: " / ";
    }
  }
}

.card {
  margin-bottom: 10px;

  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(172, 183, 191, 0.5);

  font-size: 14px;

  .top {
    padding: 10px 10px 5px;

    .van-image {
      margin-right: 10px;
    }

    .card-content {
      font-size: 12px;
    }

    .card-tag {
      display: inline-block;

      height: 1;
      margin-right: 3px;
      padding: 3px 5px;

      border-radius: 3px;

      line-height: 1;
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 5px 10px;

    button {
      height: 28px;
      padding: 0 14px;

      color: #fff;
      border: 0;
      border-radius: 16px;
      outline: 0;
      background: $green;

      font-size: 12px;
      font-weight: 700;
      line-height: 28px;
    }
  }
}
</style>
