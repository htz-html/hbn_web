<template>
  <main>
    <div class="bm-info-container">
      <template v-if="!loading">
        <div class="flex-center">
          <div class="img-wrap">
            <van-image
              :src="data.FilePath"
              :radius="5"
              width="105px"
              height="120px"
              @click="$singleImgPreview(preview)"
            >
              <van-loading slot="loading" type="circular" size="20px" />
            </van-image>
          </div>
          <div class="bm-info">
            <div class="top">
              <h3>
                <span>{{ data.Name }}</span>
                <span class="medal">{{ data.BmTypeValue }}</span>
              </h3>
              <h4>编号：{{ data.Id }}</h4>
            </div>
            <ul class="info-1">
              <li>
                <span>学历：</span>
                <span>{{ data.BmEduValue }}</span>
              </li>
              <li>
                <span>民族：</span>
                <span>{{ data.Nation || "汉族" }}</span>
              </li>
              <li>
                <span>身高：</span>
                <span>{{ data.Height }}CM</span>
              </li>
              <li>
                <span>体重：</span>
                <span>{{ data.Weight }}KG</span>
              </li>
              <li>
                <span>城市：</span>
                <span>{{ data.BmCity }}</span>
              </li>
            </ul>
          </div>
        </div>

        <ul class="info-2">
          <li>
            <p>
              <span>{{ data.Age }}</span>
              <span>岁</span>
            </p>
            <p>年龄</p>
          </li>
          <li>
            <p>
              <span>{{ data.WorkYear }}</span>
              <span>年</span>
            </p>
            <p>经验</p>
          </li>
          <li>
            <p>{{ data.BmProvince }}</p>
            <p>籍贯</p>
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="flex-center">
          <div class="img-wrap">
            <skeleton width="105px" height="120px"></skeleton>
          </div>

          <div class="bm-info">
            <skeleton width="105px" height="26px"></skeleton>
            <br />
            <skeleton height="19px" style="margin-top:10px"></skeleton>
            <skeleton height="19px" style="margin-top:10px"></skeleton>
            <skeleton height="19px" style="margin-top:10px"></skeleton>
          </div>
        </div>
      </template>
    </div>
    <!-- <div class="tags">
      <template v-if="!loading">
        <p>体检合格</p>
        <p>技能鉴定合格</p>
      </template>
      <skeleton height="32px" v-else></skeleton>
    </div>-->
    <template v-if="!loading">
      <section class="certificate">
        <h3>
          <span class="iconfont iconanquanbaozhang-yuandi"></span>
          <span>服务保障</span>
        </h3>
        <ul>
          <li>
            <span
              class="iconfont iconjiankangzheng"
              style="color:#FF7F50"
            ></span>
            <span>健康证</span>
          </li>
          <li>
            <span class="iconfont icongongan" style="color:#00BFFF"></span>
            <span>人证合一</span>
          </li>
          <li>
            <span class="iconfont iconxuexi" style="color:#DDA0DD"></span>
            <span>鉴定培训</span>
          </li>
          <li>
            <span class="iconfont iconjianding" style="color:	#228B22"></span>
            <span>技能考核</span>
          </li>
        </ul>
      </section>

      <section class="bm-attr">
        <h3>
          <span class="iconfont iconbaomu01"></span>
          <span>求职意向</span>
          <div class="salary">
            {{ data.Salary1 }} ~ {{ data.Salary2 }}元 / 月
          </div>
        </h3>
        <ul>
          <!-- <li>
            <div class="label">期望薪资：</div>
            <div class="content" style="color:#E02424;font-weight:700">
              <span class="salary">{{data.Salary1}}</span> ~
              <span class="salary">{{data.Salary2}}</span> / 月
            </div>
          </li>-->
          <li v-if="data.BmTypeValue">
            <div class="label">保姆类型：</div>
            <div class="content">{{ data.BmTypeValue }}</div>
          </li>
          <li v-if="data.BmWorkTechValue">
            <div class="label">保姆技能：</div>
            <div class="content">{{ data.BmWorkTechValue }}</div>
          </li>
          <li v-if="data.BmLanValue">
            <div class="label">保姆语言：</div>
            <div class="content">{{ data.BmLanValue }}</div>
          </li>
          <li v-if="data.BmCertificateValue">
            <div class="label">保姆证书：</div>
            <div class="content">{{ data.BmCertificateValue }}</div>
          </li>
          <li v-if="data.BmAdvanceTechValue">
            <div class="label">高级技能：</div>
            <div class="content">{{ data.BmAdvanceTechValue }}</div>
          </li>
          <li v-if="data.BmWorkTimeValue">
            <div class="label">工作时间：</div>
            <div class="content">{{ data.BmWorkTimeValue }}</div>
          </li>
          <li v-if="data.BmCookValue">
            <div class="label">饭菜口味：</div>
            <div class="content">{{ data.BmCookValue }}</div>
          </li>
        </ul>
      </section>

      <section class="intro">
        <h3>
          <span class="iconfont iconwo"></span>
          <span>保姆介绍</span>
        </h3>
        <div>
          <p v-html="data.Intro"></p>
        </div>
      </section>
      <section class="work-exp">
        <h3>
          <span class="iconfont iconwo"></span>
          <span>工作经历</span>
        </h3>
        <ul>
          <li v-for="item in expList" :key="item.Id">
            <h4>
              <span>{{ item.ClassName }}</span>
              <span
                >{{ item.Time1.split(" ")[0] }}~{{
                  item.Time2.split(" ")[0]
                }}</span
              >
            </h4>
            <p>{{ item.Description }}</p>
          </li>
        </ul>
      </section>
      <section class="work-img" v-if="imgList.length > 0">
        <h3>
          <span class="iconfont iconxiangce"></span>
          <span>保姆风采</span>
        </h3>
        <ul class="img-list">
          <li v-for="(img, index) in imgList" :key="img">
            <van-image
              width="6rem"
              height="6rem"
              :src="img"
              fit="cover"
              :radius="5"
              @click="$multipleImgPreview(imgList, index)"
            >
              <van-loading slot="loading" type="circular" size="20px" />
            </van-image>
          </li>
        </ul>
      </section>
      <section
        class="broker"
        @click="
          $router.push({
            name: 'brokerdetailindex',
            query: { brokerid: brokerData.id }
          })
        "
        v-if="brokerData"
      >
        <div>
          <van-image
            width="70px"
            height="70px"
            :src="brokerData.filepath"
            fit="cover"
            round
            @click="$singleImgPreview(brokerData.filepath)"
          >
            <van-loading slot="loading" type="circular" size="20px" />
          </van-image>
        </div>

        <div class="broker-content">
          <h4>{{ brokerData.branch_name }} - {{ brokerData.name }}</h4>
          <i>{{ data.Tel }}</i>
          <p>{{ brokerData.CatchWord }}</p>
        </div>
      </section>
    </template>
    <template v-else>
      <section v-for="i in 4" :key="i">
        <h3>
          <skeleton height="34px" width="100px"></skeleton>
        </h3>
        <ul>
          <li v-for="j in 3" :key="j" style="margin-top:10px">
            <skeleton height="16px"></skeleton>
          </li>
        </ul>
      </section>
    </template>
    <div class="btn-group" v-if="!loading">
      <a class="flex-center" :href="`tel:${data.Tel}`">电话咨询</a>
      <van-button @click="onLeaveMsg">留言咨询</van-button>
    </div>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`保姆ID：${bmid}，保姆姓名：${data.Name}`"
    ></msg-book>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import msgBook from "components/popup/MsgBook.vue";
import { Image, Icon, Loading, Button } from "vant";
import Vue from "vue";

Vue.use(Icon)
  .use(Image)
  .use(Button)
  .use(Loading);
export default {
  mixins: [mixin],
  name: "bmdetail",
  components: {
    msgBook
  },
  data() {
    return {
      bmid: null,
      bybrokerid: null,
      data: {},
      brokerData: null,
      guestBookShow: false,
      guestBookArgs: null,
      preview: null,
      imgList: [],
      expList: [],
      loading: true
    };
  },

  methods: {
    init() {
      this.bmid = this.$route.query.bmid;
      this.bybrokerid = this.$route.query.brokerid;
      this.getBmDetail();
    },
    getBmDetail() {
      this.$api
        .getBmDetail({
          id: this.bmid,
          companyid: this.CompanyId,
          brokerid: this.bybrokerid
        })
        .then(
          res => {
            this.data = res.data;
            this.preview = res.data.FilePath.replace("_min.", ".");
            this.brokerData = res.extdata.broker;
            this.$wxshare(res.extdata.sharedata);
            this.$api
              .getUserWorkPic({ args: { employeeid: res.data.EmployeeId } })
              .then(res => {
                this.imgList = res.data.map(i => i.FilePath);
                this.loading = false;
              });
            this.getEmpExp(res.data.EmployeeId);
            document.title = `${res.data.BmTypeValue} - ${res.data.Name} - ${res.data.Id}`;
          },
          () => {
            this.$router.push({ name: "baomu" });
          }
        );
    },
    getEmpExp(employeeid) {
      this.$api.getUserExp({ args: { employeeid } }).then(res => {
        this.expList = res.data;
      });
    },
    onLeaveMsg() {
      let args = {
        dataid: this.bmid,
        datatypevalues: 1,
        demandvalues: 1,
        companyid: this.data.CompanyId
      };
      this.brokerData && (args.brokerid = this.brokerData.id);

      this.guestBookArgs = args;
      this.guestBookShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  padding-bottom: 55px;
}
.bm-info-container {
  background: linear-gradient(to top, #44bb66, $green);
  padding: 16px;
  .img-wrap {
    width: 105px;
    margin-right: 16px;
    .van-image {
      box-shadow: 2px 3px 10px rgba($color: #007323, $alpha: 0.3);
    }
    .call {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      border: 0;
      background: linear-gradient(12deg, #fcffa2, #fbb700);
      font-weight: 500;
      padding: 4px 0;
      margin: 12px 0;
      span {
        vertical-align: middle;
        line-height: 24px;
        margin: 0 3px;
      }
    }
  }
  .bm-info {
    flex: 1;
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    height: 120px;
    h3 {
      font-size: 20px;
      font-weight: 500;
      .medal {
        display: inline-block;
        margin-left: 8px;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        vertical-align: middle;
        color: #fff;
        margin-top: -4px;
        background: linear-gradient(45deg, #ffcb52, #ff7b02);
      }
    }
    h4 {
      margin-top: 4px;
    }
    .info-1 {
      font-size: 14px;
      li {
        display: inline-block;
        width: 50%;
        margin-bottom: 4px;
        span:first-child {
          opacity: 0.8;
        }
      }
    }
  }
  .info-2 {
    margin-top: 8px;
    color: #fff;
    text-align: center;
    li {
      display: inline-block;
      width: 31%;
      min-width: 4em;
      margin-right: 4px;
      p:first-child {
        font-size: 20px;
        span:last-child {
          font-size: 14px;
        }
      }
      p:last-child {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}
.tags {
  padding: 10px 0.5rem;
  background: #fff;
  margin-bottom: 8px;
  p {
    background: #ffe4ca;
    color: #ff8000;
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    margin-right: 12px;
    border-radius: 3px;
  }
}
section {
  padding: 10px 0.5rem;
  margin: 8px 0;
  background: #fff;
  h3 {
    font-size: 18px;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 24px;
      font-weight: 400;
      margin: 4px;
      color: #ffb100;
    }
  }
}
.certificate {
  ul {
    display: flex;
    padding: 10px;
  }
  li {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .iconfont {
      font-size: 22px;
      margin: 6px;
    }
  }
}

.bm-attr {
  .salary {
    flex: 1;
    padding-right: 16px;
    text-align: right;
    color: #e02424;
    font-weight: 700;
  }
  ul {
    padding: 10px;
    font-size: 14px;
    li {
      display: flex;
      line-height: 1.8;
      .label {
        width: 5em;
        color: #999;
      }
      .content {
        flex: 1;
      }
    }
  }
}
.intro {
  > div {
    padding: 10px;
    font-size: 14px;
    line-height: 1.8;
  }
}
.work-img {
  .img-list {
    margin: 10px -0.25rem;
    li {
      display: inline-block;
      width: 6rem;
      height: 6rem;
      margin: 0.25rem;
    }
  }
}
.broker {
  display: flex;
  .van-image {
    width: 70px;
    margin: 15px 10px;
    height: 70px;
    box-shadow: 0 0 10px #00000090;
  }
  h2 {
    text-align: center;
    margin: 8px 0;
    font-size: 18px;
    line-height: 24px;
  }
  .broker-content {
    flex: 1;
    position: relative;
    padding-top: 4px;
    padding-left: 10px;
    h4 {
      margin: 4px 0;
      font-weight: 700;
      font-size: 14px;
      color: rgb(38, 182, 62);
    }
    p {
      margin-top: 6px;
    }
  }
}
.work-exp {
  ul {
    padding: 16px 15px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 34px;
      left: 15px;
      height: calc(100% - 16px - 40px);
      width: 1px;
      background: $green;
    }
    li {
      margin-bottom: 4px;
      padding-left: 8px;
      h4 {
        font-size: 14px;
        padding: 6px 0;
        line-height: 24px;

        span:first-child {
          text-indent: 12px;
          display: inline-block;
          margin-right: 12px;
          position: relative;
          &::before {
            content: "";
            position: absolute;
            width: 9px;
            height: 9px;
            top: 50%;
            transform: translate(-50%, -50%);
            left: -7px;
            border-radius: 50%;
            background: $green;
            z-index: 1;
          }
          &::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 50%;
            transform: translate(-50%, -50%);
            left: -7px;
            border-radius: 50%;
            background: $green;
            opacity: 0.5;
          }
        }
      }
      p {
        padding-top: 5px;
        padding-left: 12px;
        line-height: 1.8;
      }
    }
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
    padding: 0 15px;
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
</style>
