<template>
  <li>
    <header>
      <h2>
        <span>{{ order.Class1 }}</span>
        <template v-if="order.Class2">
          <span style="margin:0 5px">-</span>
          <span>{{ order.Class2 }}</span>
        </template>
      </h2>
      <key-value label="单号" :content="order.Id"></key-value>
      <key-value label="日期" :content="order.PreTime"></key-value>
      <h3>{{ order.OrderStatus }}</h3>
    </header>
    <div class="divider divider-1"></div>
    <div class="main">
      <div class="order-info">
        <key-value label="称呼" :content="order.ContactCustomer"></key-value>
        <key-value label="电话" :content="order.ContactTel"></key-value>
        <key-value label="地址" :content="order.ServiceAddress"></key-value>
        <key-value label="提供服务" :content="order.CompanyName"></key-value>
        <key-value
          label="客服电话"
          :content="order.ServiceTel || '无'"
        ></key-value>
      </div>
    </div>
    <footer>
      <template v-if="status === 2 || status === 3">
        <p>已支付：￥{{ order.HasPay }}</p>
      </template>
      <template v-else>
        <p>应支付：￥{{ order.MustPay }}</p>
        <van-button @click="readyPay">立即支付</van-button>
      </template>
    </footer>
  </li>
</template>
<script>
import { Button } from "vant";
import Vue from "vue";
Vue.use(Button);
export default {
  props: {
    order: {
      type: Object
    },
    status: {
      type: Number
    }
  },
  methods: {
    readyPay() {
      // fun=serviceorder&fromvalues=4&&orderid=
      this.$router.push({
        name: "readypay",
        query: {
          fun: "serviceorder",
          fromvalues: 4,
          orderid: this.order.Id,
          companyid: this.order.CompanyId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
li {
  background: #fff;
  margin-bottom: 10px;
  border-radius: 5px;
  header {
    position: relative;
    padding: 12px 10px 5px;
    h2 {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    h3 {
      font-weight: 500;
      color: #d04;
      position: absolute;
      top: 12px;
      right: 10px;
      font-size: 14px;
    }
  }
  .main {
    padding: 10px;
    color: #888;
  }
  footer {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    p {
      color: #e22;
      font-size: 16px;
      padding-right: 18px;
    }
    button {
      border: 0;
      outline: 0;
      background: $green;
      font-size: 14px;
      color: #fff;
      font-weight: 700;
      height: 32px;
      line-height: 32px;
      padding: 0 14px;
      border-radius: 20px;
    }
  }
}
</style>
