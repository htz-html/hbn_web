import { mapGetters, mapMutations } from "vuex";
import { Toast } from "vant";
export default {
  data() {
    return {
      route: this.$route.name
    };
  },
  created() {
    if (this.CompanyId > 0) {
      this.init();
    }
  },
  computed: {
    ...mapGetters(["CompanyId"])
  },
  methods: {
    ...mapMutations(["setDoubleJumpMark"])
  },
  watch: {
    CompanyId: function() {
      this.$router.replace({ query: {} }).catch(() => {});
      this.init();
      Toast({
        message: "城市切换成功",
        duration: 1000
      });
    }
  }
};
