<template>
  <div>{{ errormsg }}</div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      errormsg: null
    };
  },
  created() {
    this.$wxshare();
    let {
      errorcode,
      errormsg,
      authorization,
      expired,
      headimgurl
    } = this.$route.query;

    if (errorcode === "0") {
      this.login({
        token: authorization,
        expired,
        headimgurl
      });
      this.$router.push({ name: "home" });
    } else {
      this.errormsg = errormsg || "登录失败";
    }
  },
  methods: {
    ...mapMutations(["login"])
  }
};
</script>
