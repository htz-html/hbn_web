<template>
  <main>
    <div class="contract-info">
      <h3>合同详情</h3>
      <div class="mask flex-center" v-if="loading">
        <van-loading
          slot="loading"
          type="spinner"
          color="#4d6"
          size="24px"
          vertical
          >正在获取合同信息...</van-loading
        >
      </div>
      <template v-else>
        <ul>
          <li v-for="item in kvdata" :key="item.Key">
            <key-value
              labelHeight="2em"
              :label="item.Key"
              :content="item.Value"
            ></key-value>
          </li>
          <li>
            <key-value labelHeight="2em" label="合同详情">
              <span
                slot="content"
                class="contract-btn"
                @click="$singleImgPreview(contractImageUrl)"
                >点击查看合同</span
              >
            </key-value>
          </li>
        </ul>
      </template>
    </div>
    <div class="signature">
      <h4>请在此区域签名</h4>
      <vueSignature
        ref="signature"
        :sigOption="option"
        :w="'100%'"
        :h="'200px'"
        :defaultUrl="signature"
      ></vueSignature>
      <button @click="reSign" class="reSign">重新签名</button>
    </div>
    <div class="check-btn">
      <van-button @click="postContract" :disabled="loading"
        >确认签名</van-button
      >
    </div>
  </main>
</template>

<script>
import VueSignature from "vue-signature";
import mixin from "js/mixin.js";
import { Button, Loading, Toast } from "vant";
import Vue from "vue";
Vue.use(Loading).use(Button);
Vue.use(VueSignature);
export default {
  mixins: [mixin],
  data() {
    return {
      loading: true,
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "transparent"
      },
      fromvalues: null,
      paymentvalues: null,
      contractnum: null,
      contractid: null,
      signature: "",
      contractImageUrl: "",
      kvdata: []
    };
  },
  methods: {
    init() {
      this.getContract();
    },
    getContract() {
      let data = this.$route.query;
      this.$api.getContract_emp(data).then(res => {
        this.contractImageUrl = res.extdata.imgUrl;
        this.kvdata = res.data;
        this.signature = res.extdata.sign || null;
        this.$refs.signature.clear();
        if (this.signature) {
          this.$refs.signature.fromDataURL(this.signature);
        }
        this.loading = false;
        this.$wxshare(res.extdata.sharedata);
      });
    },
    reSign() {
      this.$refs.signature.clear();
    },
    postContract() {
      let args = this.$route.query;
      if (this.loading) {
        return;
      }
      if (this.$refs.signature.isEmpty()) {
        Toast("提交之前需要进行签名");
        return;
      } else {
        let loading = Toast.loading({
          mask: true,
          message: "正在提交...",
          duration: 0
        });
        this.signature = this.$refs.signature.save();
        this.$api
          .postContract_emp({
            args: {
              ...args,
              sign: this.signature
            }
          })
          .then(() => {
            loading.clear();
            Toast.success("签名已保存，请通知您的经纪人。");
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  font-size: 16px;
  padding: 10px 1em;
  color: #333;
  font-weight: 500;
}
ul {
  padding: 20px;
  background: #fff;
  font-size: 16px;
  li {
    color: #888;
  }
}
.check-btn {
  margin: 20px;
  button {
    width: 100%;
    border: 0;
    background: $green;
    outline: 0;
    display: inline-block;
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    border-radius: 5px;
    color: #fff;
    &.disabled {
      opacity: 0.5;
    }
    .van-loading__text {
      color: #fff;
    }
  }
}

.signature {
  background: #eee;
  position: relative;
  h4 {
    position: absolute;
    color: $orange;
    font-size: 12px;
    left: 10px;
    top: 10px;
    padding: 0;
  }
  .reSign {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: transparent;
    border: 0;
    outline: 0;
    padding: 0;
    color: red;
  }
}
.contract-btn {
  color: #07f;
}
</style>
