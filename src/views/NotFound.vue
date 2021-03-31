<template>
  <main>
    <van-empty description="404 Not Found" />
  </main>
</template>

<script>
import Vue from "vue";
import { Empty, Dialog } from "vant";
Vue.use(Empty);
export default {
  created() {
    this.$wxshare();
    if (this.$route.query.goback) {
      window.history.go(-1);
      return;
    }
    Dialog.confirm({
      title: "页面出错",
      message: "是否重新进入？"
    })
      .then(() => {
        this.$router.replace({ query: { goback: 1 } });
        window.location.reload();
      })
      .catch(() => {});
  }
};
</script>
