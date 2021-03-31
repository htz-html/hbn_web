<template>
  <main>
    <div class="sticky">
      <div class="broker-info">
        <div class="img-wrap">
          <van-image
            :src="data.HeadPhoto"
            width="70px"
            @click="$singleImgPreview(data.HeadPhoto)"
          >
            <van-loading slot="loading" type="circular" size="20px" />
          </van-image>
        </div>
        <div class="info-container">
          <h2>
            <span @click="$router.push({ name: 'brokerdetailindex' })">{{
              data.LoginName
            }}</span>
            <span class="praise">
              <van-icon name="good-job" tag="span"></van-icon>
              <span>{{ data.Praise }}</span>
            </span>
          </h2>
          <p class="ellipsis-2">{{ data.CatchWord }}</p>
        </div>
      </div>
      <ul class="btn-group">
        <li>
          <a :href="`tel:${data.SaleTel}`">
            <van-icon name="phone" />
            <span>拨打电话</span>
          </a>
        </li>
        <li>
          <button @click="$icepalace">
            <van-icon name="column" />
            <span>自助报名</span>
          </button>
        </li>
        <li>
          <button @click="$singleImgPreview(data.Qrcode)">
            <van-icon name="friends" />
            <span>加我微信</span>
          </button>
        </li>
        <li>
          <button @click="praiseAdd">
            <van-icon name="good-job" />
            <span>给我点赞</span>
          </button>
        </li>
      </ul>
    </div>

    <router-view :brokername="data.LoginName"></router-view>
  </main>
</template>
<script>
import mixin from "js/mixin";
import { Image, Icon, Loading, Toast, Grid, GridItem } from "vant";
import { mapMutations, mapActions } from "vuex";
import Vue from "vue";
Vue.use(Icon)
  .use(Image)
  .use(Loading)
  .use(Grid)
  .use(GridItem);

export default {
  name: "brokerdetail",

  mixins: [mixin],
  data() {
    return {
      brokerid: null,
      activeIndex: "index",
      query: null,
      data: {},
      args: {},
      postData: null,
      loading: true,
      noData: false
    };
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),
    init() {
      document.title = "明星经纪人";
      this.query = this.$route.query;
      this.brokerid = this.$route.query.brokerid;
      this.getBrokerDetail();
    },
    getBrokerDetail() {
      this.$api
        .getBrokerDetail({
          companyid: this.CompanyId,
          id: this.brokerid
        })
        .then(
          res => {
            if (res.errorcode === 1) {
              Toast.fail(res.errormsg);
            } else {
              this.data = res.data;
              document.title = "明星经纪人·" + res.data.LoginName;
              this.args = {
                demandvalues: 1,
                companyid: this.CompanyId,
                brokerid: this.brokerid
              };
              this.$wxshare(res.extdata.sharedata);
            }
          },
          () => {
            this.$router.push({ name: "broker" });
          }
        );
    },

    praiseAdd() {
      this.checkId({ needBind: true }).then(
        () => {
          this.$api
            .praiseAdd({
              args: {
                brokerid: this.brokerid
              }
            })
            .then(() => {
              this.data.Praise++;
              Toast("点赞成功，谢谢您的支持");
            });
        },
        () => {
          this.showLoginBox(this.praiseAdd);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  overflow-y: hidden;
}

button:active {
  .van-icon {
    color: $green;
  }
}

section {
  overflow-y: auto;

  height: calc(100vh - 46px - 165px);
  padding-top: calc(165px);
}

.img-wrap {
  overflow: hidden;

  width: 68px;
  height: 68px;
  margin: 0 20px;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1);
}

.broker-info {
  display: flex;

  padding: 10px 15px;

  color: #fff;
  background: $green;

  .info-container {
    flex: 1;

    padding-left: 10px;

    h2 {
      display: flex;

      margin: 5px 0;

      font-size: 20px;
      line-height: 20px;

      .praise {
        display: inline-flex;
        align-items: center;

        padding-left: 20px;

        font-size: 14px;
      }
    }

    p {
      max-height: 60px;

      line-height: 20px;
    }
  }
}

.btn-group {
  display: flex;

  margin: 0 20px;
  margin-bottom: 10px;

  border-radius: 10px;
  background: #fff;

  li {
    flex: 1;

    padding: 10px 0;

    button,
    a {
      border: 0;
      outline: 0;
      background: #fff;

      i,
      span {
        display: inline-block;

        width: 100%;

        text-align: center;
      }

      i {
        color: $orange;

        font-size: 24px;
      }

      span {
        font-size: 12px;
      }
    }
  }
}

.sticky {
  position: absolute;

  background: $green;
}
</style>
