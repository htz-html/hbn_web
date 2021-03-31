<template>
  <section>
    <ul class="btn-cells">
      <li @click="$router.push({ name: 'brokerdetailmybaomu', query })">
        <p>
          <i class="iconfont icon-baomu" style="color:#e91e63"></i>
          <span>我的保姆</span>
        </p>
        <i class="iconfont iconicon-arrowright"></i>
      </li>
      <li @click="$router.push({ name: 'brokerdetailmyguzhu', query })">
        <p>
          <i class="iconfont icon-cus" style="color:#dc71ee"></i>
          <span>我的雇主</span>
        </p>
        <i class="iconfont iconicon-arrowright"></i>
      </li>
      <li @click="leaveMsg">
        <p>
          <i class="iconfont iconliuyan" style="color:#FFC107"></i>
          <span>给我留言</span>
        </p>
        <i class="iconfont iconicon-arrowright"></i>
      </li>
      <li @click="$router.push({ name: 'service' })">
        <p>
          <i class="iconfont iconjiazhengzaixian" style="color:#FF5722"></i>
          <span>家政服务</span>
        </p>
        <i class="iconfont iconicon-arrowright"></i>
      </li>
      <li @click="$router.push({ name: 'recruit' })">
        <p>
          <i class="iconfont iconzhaopin" style="color:#03A9F4"></i>
          <span>找工作应聘</span>
        </p>
        <i class="iconfont iconicon-arrowright"></i>
      </li>
      <!-- <li>
        <p>
          <i class="iconfont icon-yinle" style="color:#44c9b6"></i>
          <span>好邦伲之歌</span>
        </p>
        <i class="iconfont iconicon-arrowright"></i>
      </li>-->
    </ul>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`经纪人姓名：${brokername}，ID：${brokerid}`"
    ></msg-book>
  </section>
</template>

<script>
import mixin from "js/mixin";
import msgBook from "components/popup/MsgBook.vue";
export default {
  mixins: [mixin],
  components: {
    msgBook
  },
  props: {
    brokername: {
      type: String
    }
  },
  data() {
    return {
      query: null,
      brokerid: null,
      guestBookArgs: {},
      guestBookShow: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.brokerid = this.$route.query.brokerid;
      this.query = this.$route.query;
    },
    leaveMsg() {
      this.guestBookArgs = {
        companyid: this.CompanyId,
        demandvalues: 1,
        brokerid: this.brokerid
      };
      this.guestBookShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-cells {
  background: #fff;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px 16px;

    border-bottom: 1px solid #ccc;

    font-size: 14px;

    > p {
      display: inline-flex;
      align-items: center;

      color: #000;

      i {
        display: inline-block;

        width: 32px;
        margin-right: 5px;

        font-size: 28px;
        line-height: 32px;
      }
    }
  }
}
</style>
