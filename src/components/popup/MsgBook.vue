<template>
  <van-popup v-model="popup" position="bottom" round>
    <div class="msg-container">
      <input v-model="form.name" placeholder="请输入姓名" />
      <!-- <input v-model="form.mobile" placeholder="请输入电话号码" type="tel" disabled /> -->
      <p>{{ form.mobile }}</p>
      <input v-model="form.addr" placeholder="请输入大概位置" />
      <textarea
        rows="4"
        v-model="form.body"
        placeholder="请输入详细内容"
      ></textarea>
      <van-button @click="postGuestBook">
        <span v-if="!postLoading">提交留言</span>
        <van-loading size="24px" v-else type="spinner" color="#fff"
          >正在发送...</van-loading
        >
      </van-button>
    </div>
  </van-popup>
</template>

<script>
import Vue from "vue";
import { Popup, Button, Loading, Toast } from "vant";
Vue.use(Button)
  .use(Popup)
  .use(Loading);
import { mapMutations, mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      popup: false,
      getArgs: null,
      form: {},
      postLoading: false
    };
  },
  computed: { ...mapState(["salerid", "salercode", "salerempid"]) },
  props: {
    args: {
      type: Object
    },
    show: {
      type: Boolean,
      default: false
    },
    des: {
      default: null
    }
  },
  watch: {
    show: function(newV) {
      if (newV) {
        this.login();
      }
    },
    popup: function(newV) {
      if (!newV) {
        this.$emit("guestBookClose");
      }
    }
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),
    postGuestBook() {
      let data = {
        args: this.args,
        data: {
          ...this.form,
          salerid: this.salerid,
          salercode: this.salercode,
          salerempid: this.salerempid
        }
      };
      !!this.des && (data.data.des = this.des);
      this.postLoading = true;
      // console.log(data);
      this.$api.postGuestBook(data).then(
        res => {
          this.postLoading = false;
          Toast(res.errormsg);
          this.popup = false;
        },
        res => {
          this.postLoading = false;
          Toast(res.errormsg);
        }
      );
    },
    getGuestBook() {
      this.$api.getGuestBook({ args: this.args }).then(res => {
        let data = { args: this.args, form: {} };
        if (Object.keys(res.data).length > 0) {
          let { guestbookid, ...other } = res.data;
          Object.assign(data.form, other);
          data.args.guestbookid = guestbookid;
        } else {
          Object.assign(data.form, res.extdata);
        }
        this.form = data.form;
        this.args = data.args;
        this.popup = true;
      });
    },
    login() {
      let loginLoading = Toast.loading({ message: "请稍后...", duration: 0 });
      this.checkId({ needBind: true }).then(
        () => {
          loginLoading.clear();
          this.getGuestBook();
        },
        () => {
          loginLoading.clear();
          this.$emit("guestBookClose");
          this.showLoginBox(this.login);
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.msg-container {
  // text-align: center;
  margin: 30px 30px 20px;
}

input,
textarea,
p {
  box-sizing: border-box;
  width: 100%;
  margin: 5px 0;
  padding: 10px 15px;

  border: 1px solid #ccc;
  border-radius: 4px;
  outline: 0;
  background: #fff;
}

p {
  background: #ddd;
}

textarea {
  resize: none;
}

button {
  width: 100%;
  height: 40px;

  color: #fff;
  border-color: #4d6;
  border-radius: 20px;
  background: #4d6;

  font-size: 16px;
  line-height: 40px;

  .van-loading__text {
    color: #fff;
  }
}
</style>
