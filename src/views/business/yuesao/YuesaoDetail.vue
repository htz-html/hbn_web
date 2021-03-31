<template>
  <main>
    <div class="ys-info-container">
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
              <van-loading
                slot="loading"
                type="circular"
                size="20px"
              ></van-loading>
            </van-image>
          </div>
          <div class="ys-info">
            <div class="top">
              <h3>
                <span>{{ data.EmployeeName }}</span>
                <span class="medal">星级月嫂</span>
              </h3>
              <h4>编号：{{ data.Id }}</h4>
            </div>
            <ul class="info">
              <li>
                <span>年龄：</span>
                <span>{{ data.Age }}</span>
              </li>
              <li>
                <span>属相：</span>
                <span>{{ data.Animal }}</span>
              </li>
              <li>
                <span>籍贯：</span>
                <span>{{ data.YsProvince }}</span>
              </li>
              <!-- <li>
                <span>城市：</span>
                <span>{{ data.YsCity }}</span>
              </li>-->
              <li>
                <span>学历：</span>
                <span>{{ data.EduClass }}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex-center">
          <div class="img-wrap">
            <skeleton width="105px" height="120px"></skeleton>
          </div>

          <div class="ys-info">
            <skeleton width="105px" height="26px"></skeleton>
            <br />
            <skeleton height="19px" style="margin-top:10px"></skeleton>
            <skeleton height="19px" style="margin-top:10px"></skeleton>
            <skeleton height="19px" style="margin-top:10px"></skeleton>
          </div>
        </div>
      </template>
    </div>
    <template v-if="!loading">
      <section class="certificate">
        <h3>
          <span class="iconfont iconanquanbaozhang-yuandi"></span>
          <span>服务保障</span>
        </h3>
        <ul>
          <li v-for="item in certificateHash" :key="item.icon">
            <span
              class="iconfont"
              :class="item.icon"
              :style="{ color: item.color }"
            ></span>
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </section>
      <section class="intro">
        <h3>
          <span class="iconfont iconwo"></span>
          <span>月嫂介绍</span>
          <div class="salary">{{ data.Salary1 }} / {{ data.Days }}天</div>
        </h3>
        <div>
          <p v-html="data.Intro"></p>
        </div>
      </section>
      <section class="work-img" v-if="imgList.length > 0">
        <h3>
          <span class="iconfont iconxiangce"></span>
          <span>月嫂风采</span>
        </h3>
        <ul class="img-list">
          <li
            v-for="(img, index) in imgList.filter((_, i) => {
              return i < 9;
            })"
            :key="img"
          >
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
      <!-- <section
        class="broker"
        @click="
          $router.push({
            name: 'brokerdetailindex',
            query: { brokerid: brokerData.id }
          })
        "
        v-if="brokerData"
      > -->
      <section class="broker" v-if="brokerData">
        <div class="img-wrap">
          <van-image
            width="70px"
            :src="brokerData.filepath"
            @click="$singleImgPreview(brokerData.filepath)"
          >
            <van-loading slot="loading" type="circular" size="20px" />
          </van-image>
        </div>

        <div class="broker-content">
          <h4>{{ brokerData.branch_name }} - {{ brokerData.name }}</h4>
          <i>{{ data.Mobile }}</i>
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
      <a class="flex-center" :href="`tel:${data.Mobile}`">电话咨询</a>
      <van-button @click="onLeaveMsg">留言咨询</van-button>
    </div>
    <msg-book
      :args="guestBookArgs"
      :show="guestBookShow"
      @guestBookClose="guestBookShow = false"
      :des="`月嫂ID：${ysid}，月嫂姓名：${data.EmployeeName}`"
    ></msg-book>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import msgBook from "components/popup/MsgBook.vue";
import { Loading, Icon, Image, Button } from "vant";
import Vue from "vue";
Vue.use(Loading)
  .use(Button)
  .use(Icon)
  .use(Image);
export default {
  mixins: [mixin],
  name: "ysdetail",
  components: {
    msgBook
  },
  data() {
    return {
      ysid: null,
      bybrokerid: null,
      data: {},
      brokerData: null,
      guestBookShow: false,
      guestBookArgs: null,
      preview: null,
      imgList: [],
      expList: [],
      loading: true,
      certificateHash: [
        {
          title: "健康证",
          icon: "iconjiankang",
          color: "#198"
        },
        {
          title: "人证合一",
          icon: "iconjiancha",
          color: "rgb(210, 126, 29)"
        },
        {
          title: "一对一服务",
          icon: "iconicon",
          color: "#8282fd"
        },
        {
          title: "鉴定上岗",
          icon: "iconpeixun-copy",
          color: "#FA8072"
        },
        {
          title: "标准流程",
          icon: "iconbiaozhun",
          color: "#ff9800"
        },
        {
          title: "上户日志",
          icon: "iconrizhi",
          color: "#4caf50"
        },
        {
          title: "品牌保障",
          icon: "iconpinpai",
          color: "#008080"
        },
        {
          title: "家政保险",
          icon: "iconicon-power-shield",
          color: "#e4c896"
        }
      ]
    };
  },
  methods: {
    init() {
      this.ysid = this.$route.query.ysid;
      this.bybrokerid = this.$route.query.brokerid;
      this.getYsDetail();
    },
    getYsDetail() {
      this.$api
        .getYsDetail({
          id: this.ysid,
          brokerid: this.bybrokerid,
          companyid: this.CompanyId
        })
        .then(
          res => {
            this.data = res.data;
            this.preview = res.data.EmpImgUrl;
            this.brokerData = res.extdata.broker;
            this.$wxshare(res.extdata.sharedata);
            this.$api
              .getUserWorkPic({
                args: {
                  count: 21,
                  employeeid: res.data.EmployeeId //! 没有ID
                }
              })
              .then(res => {
                this.imgList = res.data.map(i => i.FilePath);
                this.loading = false;
              });
            // this.getEmpExp(res.data.EmployeeId); //? 预留
            document.title = `月嫂-${res.data.EmployeeName}-${res.data.Id}`;
          },
          () => {
            this.$router.push({ name: "yuesao" });
          }
        );
    },
    // getEmpExp(employeeid) {
    //   this.$api.getUserExp({ args: { employeeid } }).then(res => {
    //     this.expList = res.data;
    //   });
    // },
    onLeaveMsg() {
      let args = {
        dataid: this.ysid,
        datatypevalues: 1,
        companyid: this.data.CompanyId,
        demandvalues: 2
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

.ys-info-container {
  padding: 16px;

  background: linear-gradient(to bottom, $purple, #913ae0);

  .img-wrap {
    width: 105px;
    margin-right: 16px;

    .van-image {
      box-shadow: 2px 3px 10px rgba($color: #007323, $alpha: 0.3);
    }

    .call {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      margin: 12px 0;
      padding: 4px 0;

      color: #fff;
      border: 0;
      border-radius: 4px;
      background: linear-gradient(12deg, #fcffa2, #fbb700);

      font-size: 14px;
      font-weight: 500;

      span {
        margin: 0 3px;

        line-height: 24px;

        vertical-align: middle;
      }
    }
  }

  .ys-info {
    display: flex;
    align-content: space-between;
    flex: 1;
    flex-wrap: wrap;

    height: 120px;

    color: #fff;

    h3 {
      font-size: 20px;
      font-weight: 500;

      .medal {
        display: inline-block;

        margin-top: -4px;
        margin-left: 8px;
        padding: 2px 6px;

        color: #fff;
        border-radius: 3px;
        background: linear-gradient(45deg, #ffcb52, #ff7b02);

        font-size: 12px;

        vertical-align: middle;
      }
    }

    h4 {
      margin-top: 4px;
    }

    .info {
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
}

section {
  margin: 8px 0;
  padding: 10px 0.5rem;

  background: #fff;

  h3 {
    display: flex;
    align-items: center;

    font-size: 18px;

    .iconfont {
      margin: 4px;

      color: #ffb100;

      font-size: 24px;
      font-weight: 400;
    }
  }
}

.certificate {
  ul {
    display: flex;
    flex-wrap: wrap;

    padding: 10px 0;
  }

  li {
    display: flex;
    align-items: center;
    flex-direction: column;

    width: 25%;
    margin-bottom: 12px;

    .iconfont {
      margin: 6px;

      font-size: 22px;
    }
  }
}

.intro {
  .salary {
    flex: 1;

    padding-right: 16px;

    color: #e02424;

    font-weight: 700;

    text-align: right;
  }

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

.btn-group {
  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;

  box-sizing: border-box;
  width: 100%;
  height: 55px;
  padding: 5px 10px;

  border-top: 2px solid #eee;
  background: #fff;

  button,
  a {
    display: inline-block;
    flex: 1;

    height: 36px;
    padding: 0 15px;

    color: #fff;
    border: 0;
    border-radius: 0;
    outline: 0;

    font-size: 16px;
    font-weight: 700;
    line-height: 26px;

    &:first-child {
      border-top-left-radius: 18px;
      border-bottom-left-radius: 18px;
      background: linear-gradient(90deg, #a173de, #aa57f7);
    }

    &:last-child {
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
      background: linear-gradient(90deg, #913ae0, #7c00f0);
    }
  }
}
.broker {
  display: flex;
  .img-wrap {
    width: 70px;
    height: 70px;
    margin: 15px 10px;
    border-radius: 50%;
    overflow: hidden;
  }
  .van-image {
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
      color: #7c00f0;
    }
    p {
      margin-top: 6px;
    }
  }
}
</style>
