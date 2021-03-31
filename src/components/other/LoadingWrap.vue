<template>
  <div class="mask flex-center" v-if="loading" :style="style">
    <van-loading
      slot="loading"
      type="spinner"
      color="#4d6"
      :size="size"
      vertical
      >{{ content }}</van-loading
    >
  </div>
</template>

<script>
import { Loading } from "vant";
import Vue from "vue";
Vue.use(Loading);
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    background: {
      type: String,
      default: "transparent"
    },
    height: {
      type: String,
      default: "200px"
    },
    width: {
      type: String,
      default: "100%"
    },
    size: {
      type: String,
      default: "24px"
    },
    content: {
      type: String,
      default: "正在加载中..."
    }
  },
  computed: {
    style() {
      return {
        background: this.background,
        height: this.height,
        width: this.width
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.mask {
  height: 200px;
}
</style>
