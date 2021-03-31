<template>
  <main>
    <div class="cell-group">
      <van-cell-group>
        <van-field v-model="name" label="用户名" placeholder="请输入用户名" required />
        <van-field v-model="addr" label="默认地址" placeholder="请输入默认地址" required />
        <!-- <van-field v-model="mobile" label="绑定手机" placeholder="请输入绑定的手机号" /> -->
        <!-- <van-field v-model="sms" center clearable label="短信验证码" placeholder="请输入短信验证码">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>-->
      </van-cell-group>
    </div>
    <div class="check-btn">
      <van-button @click="postData" :disabled="(loading.get) || loading.post">修改信息</van-button>
    </div>
  </main>
</template>

<script>
import Vue from "vue";
import mixin from "js/mixin.js";
import { mapMutations, mapActions } from "vuex";

import { CellGroup, Cell, Field, Button, Toast } from "vant";
Vue.use(CellGroup)
  .use(Cell)
  .use(Field)
  .use(Button);

export default {
  mixins: [mixin],

  data() {
    return {
      name: null,
      addr: null,
      loading: {
        get: true,
        post: false
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),
    init() {
      this.login();
      this.getData();
    },
    login() {
      this.checkId({ needBind: false }).then(
        res => {
          this.getData();
        },
        res => {
          this.showLoginBox(this.login);
        }
      );
    },
    getData() {
      this.$api.getUserData({ args: { companyid: this.CompanyId } }).then(
        res => {
          ["name", "addr"].forEach(key => {
            this[key] = res.data[key];
          });
          this.loading.get = false;
        },
        res => {}
      );
    },
    postData() {
      if (!this.name) {
        Toast("请输入用户名");
        return;
      }
      if (!this.addr) {
        Toast("请输入地址");
        return;
      }
      this.loading.post = true;
      this.$api
        .updateUserData({
          args: {
            companyid: +this.CompanyId,
            addr: this.addr,
            name: this.name
          }
        })
        .then(
          res => {
            this.loading.post = false;
            Toast.success("修改成功");
          },
          res => {
            this.loading.post = false;
          }
        );
    }
  }
};
</script>




<style lang="scss" scoped>
.cell-group {
  padding-top: 20px;
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
    transform: color 0.1s;
    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>