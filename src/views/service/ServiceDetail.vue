<template>
  <main>
    <template v-if="imgList.length > 0">
      <div class="scroll">
        <div class="img-wrap">
          <img
            v-for="img in imgList"
            :key="img"
            :src="img"
            alt
            @load="imgLoading = true"
          />
        </div>
        <template v-if="imgLoading">
          <div class="service-description" v-if="description || body">
            <template v-if="description">
              <h3>服务说明</h3>
              <p>{{ description }}</p>
            </template>
            <template v-if="body">
              <h3>产品说明</h3>
              <p v-html="body"></p>
            </template>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="loading flex-center">
        <van-loading slot="loading" type="circular" size="50px"></van-loading>
      </div>
    </template>
    <div class="btn-group" v-if="imgList.length > 0">
      <a
        class="flex-center"
        v-if="branchList.length === 1"
        :href="`tel:${branchList[0].Tel}`"
        >电话咨询</a
      >
      <van-button @click="showTelsList = true" v-else>电话咨询</van-button>
      <van-button @click="onBeforeOrder">立即下单</van-button>
      <van-button @click="guestBookShow = true">留言咨询</van-button>
    </div>
    <van-popup
      v-model="showTelsList"
      position="bottom"
      round
      class="tels-popup"
    >
      <h3>点击拨打公司电话</h3>
      <ul>
        <li
          v-for="(branch, index) in branchList"
          :key="'branchTel' + branch.Tel + index"
        >
          <a :href="`tel:${branch.Tel}`">
            <key-value
              :label="branch.BranchName"
              :content="branch.Tel"
              labelWidth="5.4em"
            ></key-value>
          </a>
        </li>
      </ul>
    </van-popup>
    <van-popup
      v-model="branchPopup"
      position="bottom"
      round
      ref="branch"
      class="branch-popup"
    >
      <h3>请选择服务范围</h3>
      <ul>
        <li v-for="branch in branchList" :key="branch.BinaryId">
          <button
            plain
            hairline
            type="primary"
            class="van-ellipsis"
            @click="onBranchChange(branch.BinaryId)"
          >
            {{ branch.BranchName }}
          </button>
        </li>
      </ul>
    </van-popup>
    <van-popup
      v-model="skuPopup"
      position="bottom"
      round
      ref="sku"
      class="sku-popup"
    >
      <section class="service-header">
        <div class="service-img">
          <img :src="serviceImg" width="120" />
        </div>
        <div class="service-content">
          <h3 class="van-ellipsis">{{ name }}</h3>
          <div class="sku-price">
            <p v-if="skuPrice">
              <span style="font-size:14px">￥</span>
              <span>{{ skuPrice }}</span>
            </p>
            <p v-else>计算中...</p>
          </div>
          <p class="ellipsis ellipsis-3">{{ description }}</p>
        </div>
      </section>
      <section class="sku-container">
        <div class="strategysingle-container" v-if="skuSingle.data.length > 0">
          <h3>单选服务</h3>
          <ul>
            <li
              v-for="(item, index) in skuSingle.data"
              :key="item.Id + Math.random()"
            >
              <span
                @click="singleConfirm(index)"
                :class="{ active: skuSingle.index === index }"
                >{{ item.Name }}</span
              >
            </li>
          </ul>
        </div>
        <div
          class="strategymultiple-container"
          v-if="skuMultiple.data.length > 0"
        >
          <h3>多选服务</h3>
          <ul>
            <li v-for="item in skuMultiple.data" :key="item.Id + Math.random()">
              <span
                @click="multipleConfirm(item)"
                :class="{ active: item.isChioce }"
                >{{ item.Name }}</span
              >
            </li>
          </ul>
        </div>
        <van-collapse
          class="collapse"
          v-model="activeSkuIndex"
          accordion
          @change="collapseChange"
          ref="collapse"
        >
          <van-collapse-item
            title="日期"
            :value="skuDate.data[skuDate.index].text"
          >
            <ul>
              <li
                v-for="(item, index) in skuDate.data"
                :key="index + Math.random()"
                v-show="index !== 0"
              >
                <span
                  @click="skuDateConfirm(index)"
                  :class="{ active: skuDate.index === index }"
                  >{{ item.text }}</span
                >
              </li>
            </ul>
          </van-collapse-item>
          <van-collapse-item
            title="时间"
            :value="skuTime.data[skuTime.index].text"
          >
            <ul>
              <li
                v-for="(item, index) in skuTime.data"
                :key="index + Math.random()"
                v-show="index !== 0"
              >
                <span
                  @click="skuTimeConfirm(index)"
                  :class="{ active: skuTime.index === index }"
                  >{{ item.text }}</span
                >
              </li>
            </ul>
          </van-collapse-item>
          <van-collapse-item
            title="人数"
            :value="skuPersons.data[skuPersons.index].text"
          >
            <ul>
              <li
                v-for="(item, index) in skuPersons.data"
                :key="index + Math.random()"
              >
                <span
                  @click="skuPersonsConfirm(index)"
                  :class="{ active: skuPersons.index === index }"
                  >{{ item.text }}</span
                >
              </li>
            </ul>
          </van-collapse-item>
          <van-collapse-item
            title="数量"
            :value="skuBuycount.data[skuBuycount.index].text"
          >
            <ul>
              <li
                v-for="(item, index) in skuBuycount.data"
                :key="index + Math.random()"
              >
                <span
                  @click="skuBuycountConfirm(index)"
                  :class="{ active: skuBuycount.index === index }"
                  >{{ item.text }}</span
                >
              </li>
            </ul>
          </van-collapse-item>
        </van-collapse>
      </section>
      <section class="sku-btn">
        <van-button @click="onCheck">确认</van-button>
      </section>
    </van-popup>
    <van-popup v-model="infoPopup" position="bottom" round>
      <div class="msg-container">
        <input v-model="form.name" placeholder="请输入姓名" />
        <input v-model="form.mobile" placeholder="请输入电话号码" type="tel" />
        <input v-model="form.addr" placeholder="请输入大概位置" />
        <textarea
          rows="4"
          v-model="form.body"
          placeholder="请输入详细内容"
        ></textarea>
        <div class="info-btn-group">
          <van-button @click="infoCancel">返回</van-button>
          <van-button @click="infoCheck">确认</van-button>
        </div>
      </div>
    </van-popup>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`服务：${name}`"
    ></msg-book>
  </main>
</template>

<script>
import keyValue from "components/other/KeyAndValue.vue";
import mixin from "js/mixin.js";
import { mapState, mapMutations, mapActions } from "vuex";
import {
  Button,
  Loading,
  Popup,
  Collapse,
  CollapseItem,
  Toast,
  Image
} from "vant";
import Vue from "vue";
import msgBook from "components/popup/MsgBook.vue";
Vue.use(Button)
  .use(Loading)
  .use(Popup)
  .use(Collapse)
  .use(CollapseItem)
  .use(Image);
export default {
  mixins: [mixin],
  components: { keyValue, msgBook },
  name: "servicedetail",
  data() {
    return {
      hbnserviceid: null,
      imgList: [],
      branchList: [],
      branchPopup: false,

      branchId: null,
      skuPopup: false,
      infoPopup: false,
      name: null,
      title: null,
      body: null,
      description: null,
      publishId: null,
      serviceImg: null,
      form: {},
      skuMultiple: {
        data: [],
        indexs: {}
      },
      skuSingle: {
        data: [],
        index: null
      },
      skuDate: {
        data: [{ value: "请选择", text: "请选择" }],
        index: 0
      },
      skuTime: {
        data: [
          { value: "请选择", text: "请先选择日期" },
          { value: "请选择", text: "请先选择日期" }
        ],
        index: 0
      },
      skuPersons: {
        data: [{ value: "请选择", text: "请选择" }],
        index: 0
      },
      skuBuycount: {
        data: [{ value: "请选择", text: "请选择" }],
        index: 0
      },
      activeSkuIndex: null,
      skuPrice: null,
      showTelsList: false,
      guestBookShow: false,
      guestBookArgs: null,
      imgLoading: false
    };
  },
  computed: {
    ...mapState(["salerid", "salercode", "salerempid"])
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),

    init() {
      this.hbnserviceid = this.$route.query.hbnserviceid;
      this.getServiceDetail();
    },
    getServiceDetail() {
      this.$api
        .getServiceDetail({
          hbnserviceid: this.hbnserviceid,
          companyid: this.CompanyId
        })
        .then(res => {
          this.imgList = res.data.imgList;
          this.branchList = res.data.branchList;
          this.name = res.data.Name;
          document.title = this.name;
          this.publishId = res.data.PublishId;
          this.title = res.data.Title;
          this.description = res.data.Description;
          this.body = res.data.Body;
          this.serviceImg = res.data.ServiceImg;

          this.guestBookArgs = {
            demandvalues: res.data.demandValues,
            companyid: this.CompanyId
          };
          this.$wxshare(res.data.sharedata);
        });
    },
    onBeforeOrder() {
      this.checkId({ needBind: true }).then(
        () => {
          this.onOrder();
        },
        () => {
          this.showLoginBox(this.onBeforeOrder);
        }
      );
    },
    onOrder() {
      this.branchPopup = true;
    },
    onBranchChange(id) {
      this.branchId = id;
      this.branchPopup = false;
      this.skuPopup = true;
      this.$api
        .getServiceSku({
          args: { publishid: this.publishId, branchvalues: this.branchId }
        })
        .then(res => {
          let {
            datelist,
            persons,
            buycount,
            single,
            multiple
          } = res.data.strategy;
          this.skuDate.data = [{ value: 0, text: "请选择日期" }, ...datelist];
          this.skuPersons.data = persons;
          this.skuBuycount.data = buycount;
          this.skuSingle.data = single;
          this.skuMultiple.indexs = {};
          [
            "skuSingle",
            "skuDate",
            "skuTime",
            "skuPersons",
            "skuBuycount"
          ].forEach(key => {
            this[key].index = 0;
          });
          multiple.forEach(i => {
            i.isChioce = false;
          });
          this.skuMultiple.data = multiple;
          this.serviceSkuPrice();
          this.$nextTick(() => {
            this.$refs.sku.$el.style.height =
              this.$refs.sku.$el.offsetHeight + "px";
          });
        });
    },
    skuDateConfirm(index) {
      this.skuDate.index = index;
      this.activeSkuIndex = null;
      this.serviceSkuPrice();
      this.$api
        .getServiceSkuTime({
          args: {
            companyid: this.CompanyId,
            publishid: this.publishId,
            branchvalues: this.branchId,
            date: this.skuDate.data[index].value
          }
        })
        .then(res => {
          this.skuTime.data = [
            { value: 0, text: "请选择时间" },
            ...res.data.map(i => {
              return { value: i, text: i };
            })
          ];
          this.skuTime.index = 0;
        });
    },
    skuPersonsConfirm(index) {
      this.skuPersons.index = index;
      this.activeSkuIndex = null;
      this.serviceSkuPrice();
    },
    skuBuycountConfirm(index) {
      this.skuBuycount.index = index;
      this.activeSkuIndex = null;
      this.serviceSkuPrice();
    },
    skuTimeConfirm(index) {
      this.skuTime.index = index;
      this.activeSkuIndex = null;
      this.serviceSkuPrice();
    },
    singleConfirm(index) {
      this.skuSingle.index = index;
      this.serviceSkuPrice();
    },
    multipleConfirm(item) {
      item.isChioce = !item.isChioce;
      this.serviceSkuPrice();
    },
    serviceSkuPrice() {
      let data = {
        args: {
          publishid: this.publishId,
          branchvalues: this.branchId,
          strategymultiple: this.skuMultiple.data
            .filter(i => i.isChioce)
            .map(i => i.Id),
          buycount: this.skuBuycount.data[this.skuBuycount.index].value,
          persons: this.skuPersons.data[this.skuPersons.index].value
        }
      };
      let strategysingle = this.skuSingle.data[this.skuSingle.index];
      if (strategysingle) {
        data.args.strategysingle = strategysingle.Id;
      }
      this.$api.serviceSkuPrice(data).then(res => {
        this.skuPrice = res.data.mustpay;
      });
    },
    onCheck() {
      if (!this.skuDate.index) {
        Toast("请选择日期");
        return;
      }
      if (!this.skuTime.index) {
        Toast("请选择时间段");
        return;
      }
      this.$api
        .getUserData({ args: { companyid: this.CompanyId } })
        .then(res => {
          this.skuPopup = false;
          this.infoPopup = true;
          this.form = res.data;
        });
    },
    infoCancel() {
      this.skuPopup = true;
      this.infoPopup = false;
    },
    infoCheck() {
      if (!this.form.name) {
        Toast("请输入您的姓名");
        return;
      }
      if (!this.form.mobile) {
        Toast("请输入您的电话");
        return;
      }
      if (!this.form.addr) {
        Toast("请输入您的住址");
        return;
      }
      let { publishId, salerid, salercode, salerempid } = this;
      let data = {
        args: { publishId },
        data: {
          branchvalues: this.branchId,
          strategymultiple: this.skuMultiple.data
            .filter(i => i.isChioce)
            .map(i => i.Id),
          orderdate: this.skuDate.data[this.skuDate.index].value,
          ordertime: this.skuTime.data[this.skuTime.index].value,
          cusname: this.form.name,
          mobile: this.form.mobile,
          address: this.form.addr,
          content: this.form.body,
          buycount: this.skuBuycount.data[this.skuBuycount.index].value,
          persons: this.skuPersons.data[this.skuPersons.index].value,
          salerid,
          salercode,
          salerempid
        }
      };
      let strategysingle = this.skuSingle.data[this.skuSingle.index];
      if (strategysingle) {
        data.data.strategysingle = strategysingle.Id;
      }
      this.$api.serviceCommit(data).then(
        res => {
          Toast.success(res.errormsg);
          this.infoPopup = false;
          let { orderid, fromvalues, fun } = res.data.payparams;
          setTimeout(() => {
            this.$router.push({
              name: "readypay",
              query: { orderid, fromvalues, fun, companyid: this.CompanyId }
            });
          }, 2000);
        },
        ({ is401 }) => {
          if (is401) {
            this.showLoginBox(this.infoCheck);
          }
        }
      );
    },
    collapseChange(index) {
      if (typeof index === "number") {
        let service = document.querySelector(".service-header");
        let collapse = document.querySelector(".collapse");
        let sku = document.querySelector(".sku-container");

        setTimeout(function() {
          let currentTop = sku.scrollTop;
          var targetTop =
            collapse.offsetTop -
            service.offsetHeight +
            collapse.children[index].offsetTop;
          var T = 50;
          var n = 50;
          var t = T / n;
          var S = targetTop - currentTop;
          var s = S / n;
          var i = 0;
          var id = setInterval(function() {
            if (i === n) {
              window.clearInterval(id);
              return;
            }
            i += 1;
            sku.scrollTo(0, currentTop + s * i);
          }, t);
        }, 300);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
main {
  overflow-y: hidden;
}
.loading {
  height: calc(100vh - 101px);
  width: 100vw;
}
.scroll {
  height: calc(100vh - 46px - 55px);
  overflow-y: auto;
  padding-bottom: 55px;
}
.img-wrap {
  img {
    width: 100vw;
  }
}

.service-description {
  border: 1px #18b777 solid;
  margin: 10px;
  padding: 0 10px 10px 10px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.6;
  h3 {
    display: inline-block;
    margin: 20px 0 10px;
    color: #fff;
    background: #18b777;
    padding: 5px 10px;
    border-radius: 5px;
  }
}

.btn-group {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  padding: 5px 10px;
  height: 55px;
  border-top: 2px solid #eee;
  button,
  a {
    padding: 0 15px;
    flex: 1;
    display: inline-block;
    line-height: 26px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border: 0;
    outline: 0;
    background: $green;
    color: #fff;
    border-radius: 0;

    &:first-child {
      background: linear-gradient(90deg, #7dea8f, #51d167);
      border-top-left-radius: 18px;
      border-bottom-left-radius: 18px;
    }
    &:last-child {
      background: linear-gradient(90deg, #25b73e, #28b740);
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
    }
  }
}
.tels-popup {
  text-align: center;
}
.branch-popup,
.tels-popup {
  h3 {
    text-align: center;
    margin: 20px;
    font-size: 16px;
    color: #888;
  }
  ul {
    margin-bottom: 30px;
    button {
      width: 100%;
      border: 1px solid #888;
      background: #fff;
      display: inline-block;
      height: 36px;
      border-radius: 5px;
      font-size: 14px;
    }
    a > p {
      padding: 2px 0;
      border-radius: 5px;
      // background: $green;
      box-sizing: border-box;
      width: 100%;
      display: inline-block;
      border: 1px solid #888;
      line-height: 32px;
    }
  }
}
.branch-popup {
  ul {
    margin: 0 0.25rem 30px;
  }
  li {
    display: inline-block;
    width: 6rem;
    margin: 4px 0.25rem;
  }
}
.tels-popup {
  li {
    margin: 10px;
  }
}

.sku-popup {
  padding: 0 16px;
  // height: 80%;
  min-height: 400px;
  overflow: hidden;
  box-sizing: border-box;
  .service-header {
    padding: 12px 0;
    display: flex;
    border-bottom: 1px solid #ddd;
    .service-img {
      width: 120px;
      img {
        border-radius: 5px;
      }
    }
    .service-content {
      width: calc(100% - 120px);
      max-height: 120px;
      overflow: hidden;
      padding-left: 16px;
      h3 {
        font-size: 22px;
        line-height: 36px;
        color: #333;
      }
      .sku-price {
        font-size: 18px;
        line-height: 24px;
        color: #f22;
      }
      > p {
        font-size: 14px;
        line-height: 20px;
        height: 60px;
      }
    }
  }
  .sku-container {
    overflow-y: auto;
    height: calc(100% - 144px - 46px);
  }
}
.sku-container > div {
  h3 {
    line-height: 20px;
    border-left: 5px solid $green;
    margin: 8px 0;
    padding-left: 0.5em;
  }
  li {
    display: inline-block;
    span {
      display: inline-block;
      line-height: 16px;
      font-size: 12px;
      padding: 8px 12px;
      margin: 4px;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #333;
      background: #eee;
      &.active {
        background: rgb(213, 244, 233);
        color: rgb(43, 168, 111);
        border-color: rgb(213, 244, 233);
      }
    }
  }
}

.sku-btn {
  display: inline-block;
  border-top: 1px solid #ddd;
  width: 100%;
  text-align: center;
  padding: 5px 0;
  button {
    width: 100%;
    display: inline-block;
    line-height: 26px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border: 0;
    outline: 0;
    background: $green;
    color: #fff;
    border-radius: 18px;
  }
}
.msg-container {
  text-align: center;
  margin: 10px 10px 20px;
  input,
  textarea {
    width: 100%;
    margin: 5px 0;
    padding: 10px 15px;
    box-sizing: border-box;
    border-radius: 4px;
    outline: 0;
    background: #fff;
    border: 1px solid #ccc;
  }
  textarea {
    resize: none;
  }
  .info-btn-group {
    display: flex;
  }
  button {
    flex: 1;
    margin: 0 10px;
    line-height: 26px;
    height: 36px;
    font-size: 16px;
    font-weight: 700;
    border: 0;
    outline: 0;
    background: $green;
    color: #fff;
    border-radius: 18px;
  }
}
</style>
