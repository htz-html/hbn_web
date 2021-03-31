<template>
  <li
    class="card"
    @click="$router.push({ name: 'ysdetail', query: { ysid: item.Id } })"
  >
    <section class="top clearfix">
      <van-image
        :src="item.FilePath"
        width="105px"
        height="120px"
        class="pull-left"
        radius="5"
      >
        <van-loading slot="loading" type="circular" size="20px" />
      </van-image>
      <div class="card-content">
        <h1>
          <span>{{ item.EmployeeName }}</span>
          <span style="color:#E02424"
            >{{ item.Salary2 }} 元/ {{ item.Days }}天</span
          >
        </h1>
        <p>编号：{{ item.Id }}</p>
      </div>
      <p class="tag-one">
        <!-- <span class="card-tag" style="background:#ffedf5;color:#ff519a">{{
          item.StarCount
        }}</span> -->
        <span
          class="card-tag"
          style="background:#ffedf5;color:#ff519a"
          v-if="item.YsProvince"
          >{{ item.YsProvince }}</span
        >
        <span
          class="card-tag"
          style="background:#ffedf5;color:#ff519a"
          v-if="item.YsCity"
          >{{ item.YsCity }}</span
        >
      </p>
      <p class="van-ellipsis tag-two">
        <span v-if="item.Age">{{ item.Age }}岁</span>
        <span v-if="item.EduClass">{{ item.EduClass }}</span>
        <span v-if="item.Animal">{{ item.Animal }}</span>
      </p>
    </section>
    <section class="right-bottom">
      <van-button
        type="primary"
        round
        v-if="button === 'msg'"
        @click.stop="onLeaveMsg(item.Id)"
        >给我留言</van-button
      >
      <van-button
        v-if="button === 'detail'"
        type="primary"
        round
        @click.stop="
          $router.push({ name: 'ysdetail', query: { ysid: item.Id } })
        "
        >查看详情</van-button
      >
    </section>
  </li>
</template>

<script>
import { Button, Image, Loading } from "vant";
import Vue from "vue";
Vue.use(Button)
  .use(Image)
  .use(Loading);

export default {
  props: {
    item: {
      type: Object
    },
    button: {
      type: String
    }
  },

  methods: {
    onLeaveMsg() {
      let args = {
        dataid: this.item.Id,
        datatypevalues: 1,
        demandvalues: 2,
        companyid: this.item.CompanyId,
        brokerid: this.item.Brokerid
      };
      let des = `月嫂ID：${this.item.Id}，月嫂姓名：${this.item.EmployeeName}`;
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
  position: relative;
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
      p {
        margin: 5px 0;
      }
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

  .right-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 5px 10px;
    position: absolute;
    right: 0;
    bottom: 0;
    button {
      height: 28px;
      padding: 0 14px;

      color: #fff;
      border: 0;
      border-radius: 16px;
      outline: 0;
      background: $purple;

      font-size: 12px;
      font-weight: 700;
      line-height: 28px;
    }
  }
}
</style>
