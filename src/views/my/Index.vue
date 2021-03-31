<template>
  <main>
    <section class="user-info">
      <div class="img-wrap">
        <van-image
          :src="
            headimgurl || 'https://www.haobangni.com/hbnls/avatar_default.png'
          "
          width="70px"
        >
          <van-loading slot="loading" type="circular" size="20px" />
        </van-image>
      </div>
      <div class="info-container">
        <h1 v-if="data.hbnid">{{ `会员-${data.hbnid}` }}</h1>
        <h1 v-else @click="login">登陆</h1>
        <h5 v-show="data.mobile">
          <van-icon name="phone-o" />
          <span>{{ data.mobile }}</span>
        </h5>
      </div>
    </section>
    <section class="order-btn">
      <ul>
        <li v-for="item in orderlist" :key="item.label" class="flex-center">
          <router-link
            :to="{
              name: 'orderlist',
              query: {
                type: item.type
              }
            }"
          >
            <van-icon :name="item.icon"></van-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </section>
    <section>
      <van-cell-group>
        <van-cell
          title="全部订单"
          is-link
          :to="{
            name: 'orderlist',
            query: {
              type: 0
            }
          }"
        >
          <van-icon slot="icon" name="column" color="#f83" />
        </van-cell>
      </van-cell-group>
      <div class="divider"></div>
      <van-cell-group>
        <van-cell title="我的合同" is-link @click="$icepalace">
          <van-icon slot="icon" name="diamond" color="#0af" />
        </van-cell>
        <van-cell title="我的团购" is-link @click="$icepalace">
          <van-icon slot="icon" name="coupon" color="#ea5" />
        </van-cell>
        <van-cell title="我的评价" is-link @click="$icepalace">
          <van-icon slot="icon" name="comment" color="#e11" />
        </van-cell>
      </van-cell-group>
      <div class="divider"></div>
      <van-cell-group>
        <van-cell title="个人设置" is-link :to="{ name: 'usersetting' }">
          <van-icon slot="icon" name="setting" color="#4d6" />
        </van-cell>
        <van-cell title="联系客服" is-link @click="$icepalace">
          <van-icon slot="icon" name="question" color="#4d6" />
        </van-cell>
        <van-cell title="退出登陆" is-link @click="logout">
          <van-icon slot="icon" name="question" color="#4d6" />
        </van-cell>
      </van-cell-group>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import mixin from "js/mixin.js";
import { Cell, CellGroup, Icon, Image, Loading, Toast } from "vant";
import Vue from "vue";
Vue.use(Loading)
  .use(Icon)
  .use(Image)
  .use(Cell)
  .use(CellGroup);
export default {
  name: "my",
  mixins: [mixin],
  data() {
    return {
      data: {
        hbnid: "",
        mobile: ""
      },
      orderlist: [
        {
          type: 1,
          icon: "pending-payment",
          label: "待付款"
        },
        {
          type: 2,
          icon: "paid",
          label: "已支付"
        },
        {
          type: 3,
          icon: "sign",
          label: "已完成"
        },
        {
          type: 4,
          icon: "service",
          label: "客服下单"
        }
      ],

      loading: true
    };
  },
  computed: {
    ...mapGetters(["headimgurl", "env", "token"])
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),
    init() {
      this.$wxshare();
      this.login();
    },
    login() {
      this.checkId({ needBind: false }).then(
        () => {
          this.getUserInfo();
        },
        () => {
          this.showLoginBox(this.login);
        }
      );
    },
    getUserInfo() {
      this.$api.getUserInfo().then(res => {
        this.data = res.data;
      });
    },
    logout() {
      this.$api.logout().then(() => {
        Toast("退出登陆成功");
        window.localStorage.removeItem("token");
        this.$router.push({ path: "/" });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.user-info {
  display: flex;
  background: $green;
  padding: 10px 10px 20px;
  color: #fff;
  .img-wrap {
    height: 68px;
    width: 68px;
    overflow: hidden;
    margin: 0 20px;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  .info-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    padding-left: 10px;
    h1 {
      font-size: 18px;
    }
    h5 {
      span,
      i {
        display: inline-block;
        vertical-align: middle;
        margin: 4px 0;
        font-size: 14px;
        line-height: 16px;
        color: #fff;
      }
    }
    button {
      display: inline-block;
      background: rgba(68, 195, 95, 0.8);
      outline: 0;
      padding: 5px 10px;
      border-radius: 5px;
      border: 0;
    }
  }
}
.order-btn {
  > ul {
    display: flex;
    background: #fff;
    li {
      flex: 1;
      margin: 15px 0;
      border-right: 1px solid #eee;
      &:last-child {
        border-right: 0;
      }
      i,
      span {
        text-align: center;
        display: inline-block;
        width: 100%;
        margin: 3px 0;
      }
      i {
        font-size: 24px;
        color: $orange;
      }
      span {
        font-size: 12px;
      }
    }
  }
}

.van-cell {
  .van-icon {
    font-size: 1.5em;
    line-height: inherit;
    margin-right: 10px;
  }
  .van-cell__right-icon {
    margin-right: 0;
  }
}
.divider {
  height: 15px;
}
</style>
