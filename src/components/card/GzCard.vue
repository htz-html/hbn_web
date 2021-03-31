<template>
  <li class="card">
    <section class="top">
      <h1>
        <span class="van-ellipsis">{{ item.Street }}</span>
        <span>{{ item.Salary1 }} ~ {{ item.Salary2 }}/月</span>
      </h1>
      <p class="tags">
        <span
          v-for="tag in tags"
          :key="tag.tag"
          class="tag"
          v-show="item[tag.tag]"
          :style="tag.style"
          >{{ item[tag.tag] }}</span
        >
        <span class="tag" style="background:#fdede4;color:#e96c4b"
          >{{ item.EndAge }}-{{ item.StartAge }}岁</span
        >
      </p>
      <div v-html="item.Intro"></div>
    </section>
    <div class="divider"></div>
    <section class="bottom">
      <p class="info">{{ item.Name }} | 雇主编号：{{ item.Id }}</p>
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
import { Button } from "vant";
import Vue from "vue";
Vue.use(Button);
export default {
  props: {
    item: {
      type: Object
    },
    button: {
      type: String
    }
  },
  data() {
    return {
      tags: [
        {
          tag: "BmTypeValue",
          style: "background:#fdede4;color:#e96c4b"
        },
        {
          tag: "BmEduValue",
          style: "background:#d5f4e9;color:#2ba86f"
        },
        {
          tag: "BmLanValue",
          style: "background:#e1eaf6;color:#4070d0"
        }
      ]
    };
  },
  methods: {
    onLeaveMsg() {
      let args = {
        dataid: this.item.Id,
        datatypevalues: 2,
        demandvalues: 1,
        companyid: this.$store.state.CompanyId,
        brokerid: this.item.Brokerid
      };
      let des = `雇主ID：${this.item.Id}，雇主姓名：${this.item.Name}，地址：${this.item.Street}`;
      this.$emit("leaveMsg", args, des);
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 10px;

  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(172, 183, 191, 0.5);

  font-size: 14px;

  .top {
    padding: 10px 10px 5px;

    h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 8px;

      color: #333;

      font-size: 16px;

      span:first-child {
        flex: 1;
      }

      span:last-child {
        display: inline-block;

        width: 130px;

        color: #e02424;

        text-align: right;
      }
    }
  }

  .divider {
    height: 1px;

    background: #f5f5f5;
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 5px 10px;

    color: #333;

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

.tags {
  margin: 10px 0;

  .tag {
    display: inline-block;

    height: 1;
    margin-right: 3px;
    padding: 3px 5px;

    border-radius: 3px;

    line-height: 1;
  }
}
</style>
