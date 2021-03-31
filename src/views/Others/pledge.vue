<template>
  <main v-if="!loading.get">
    <header>
      <h2>
        承诺书<van-button
          v-if="imgUrl"
          type="info"
          size="mini"
          @click="$singleImgPreview(imgUrl)"
          >立即查看</van-button
        >
      </h2>
    </header>
    <section>
      <p>
        本人：<span class="underline">{{ name }}</span>
      </p>
      <p>
        身份证号：<span class="underline">{{ idnum }}</span>
      </p>
      <p>
        本人现在在<span class="underline">{{ city }}</span
        >市欲寻求一份家政服务方面的工作，希望通过<span>{{ cmpname }}</span
        >介绍一份工作，特作以下承诺：
      </p>
      <p>
        1、本人在有关表格中填写的简历或者有关身份信息均为真实，不存在虚假或者隐瞒的情况。
      </p>
      <p>
        2、本人的健康信息、学历信息、乃至参加培训的证书等均为真实，如因提供的有关证书、信息虚假，造成任何影响、损失或者矛盾等，均由本人承担，<span
          >{{ cmpname }}</span
        >无关。
      </p>
      <p>
        3、本人如不具备或者不熟悉有关家政的某些领域服务技能，本人愿意继续学习、更希望得到<span
          >{{ cmpname }}</span
        >提供培训机会。
      </p>
      <p>
        4、本人确认<span>{{ cmpname }}</span
        >为本人介绍工作，没有收取本人任何费用。
      </p>
      <p>
        5、本人感谢<span>{{ cmpname }}</span
        >免费为本人介绍工作，无论雇主是否雇请本人，也不管雇请后服务如何，本人确认与<span
          >{{ cmpname }}</span
        >没有劳动关系，也没有劳务关系。本人一旦出现安全事故或者工伤事故均由本人承担，与<span
          >{{ cmpname }}</span
        >无关。
      </p>
      <p>
        6、本人在雇主处做家政服务过程中，保证尊重雇主及家人，尽心尽力做好家政工作，绝对不做违背良心、道德的事情，更不会做出违法事情来。
      </p>
      <p>
        7、本人为雇主提供的服务无论质量如何，都是本人的责任，与介绍工作的公司没有任何关系。
      </p>
      <p>
        8、因<span>{{ cmpname }}</span
        >介绍的雇主是该公司的客户，本人保证尽力做好本人的服务工作，不影响公司在客户中的形象和声誉。
      </p>
      <p>
        9、本人授权<span>{{ cmpname }}</span
        >及关联机构对本人进行背景调查，背景调查包括但不局限于身份信息、负面社会安全、诉讼及失信等信息。本人同意好邦伲工作人员根据背调结果作为是否为本人推荐工作的依据。
      </p>
      <p>
        以上内容本人全部认真阅读过或者公司经办人念给我听清楚了，本人对以上承诺保证做到，否则产生任何纠纷、矛盾或者损失，均由本人承担。
      </p>

      <p>此致</p>
      <p style="text-align:right;padding-right:100px">
        承诺人：
      </p>
      <p style="text-align:right;padding-right:20px">
        {{ today }}
      </p>
    </section>
    <footer>
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
      <div class="check-box">
        <van-checkbox
          v-model="isCheck"
          shape="square"
          class="pay-check"
          checked-color="#4d6"
          icon-size="20px"
        >
          <p>
            我已确认承诺书内容，并接受服务条款。
          </p>
        </van-checkbox>
      </div>
      <div class="check-btn">
        <van-button @click="postContract" type="primary" block size=""
          >确认签名</van-button
        >
      </div>
    </footer>
  </main>
</template>

<script>
import Vue from "vue";
import dateFormat from "dateformat";
import VueSignature from "vue-signature";
import { Checkbox, Toast } from "vant";
Vue.use(VueSignature).use(Checkbox);
export default {
  data() {
    return {
      city: "",
      cmpname: "",
      idnum: "",
      imgUrl: "",
      name: "",
      signature: "",
      today: "",
      loading: {
        get: false
      },
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "transparent"
      },
      isCheck: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getPledge();
      this.today = dateFormat(new Date(), "yyyy 年 mm 月 dd 日");
    },
    getPledge() {
      Toast.loading("请稍后");
      this.loading.get = true;
      const { employeeid, brokerid } = this.$route.query;
      this.$api.get承诺书({ args: { employeeid, brokerid } }).then(res => {
        Object.assign(this, res.data);
        this.$wxshare(res.extdata.sharedata);
        this.loading.get = false;
        Toast.clear();
      });
    },
    reSign() {
      this.$refs.signature.clear();
    },
    postContract() {
      const { employeeid, brokerid } = this.$route.query;
      const { isCheck } = this;
      if (!isCheck) {
        Toast("请勾选“确认信息”");
        return;
      }
      if (this.$refs.signature.isEmpty()) {
        Toast("请先进行签名");
        return;
      }
      let signature = this.$refs.signature.save();
      let data = {
        signature
      };
      let args = {
        brokerid,
        employeeid
      };
      Toast.loading("提交中...", { duration: 0 });
      this.$api.update承诺书({ args, data }).then(res => {
        Toast.clear();
        Dialog.confirm({
          title: "提交成功",
          message: "是否查看承诺书"
        })
          .then(() => {
            this.$singleImgPreview(res.data);
            this.init();
          })
          .catch(() => {
            this.init();
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  h2 {
    padding: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      margin-left: 8px;
    }
  }
}
header,
section,
footer {
  background: #fff;
}

section {
  padding-bottom: 20px;
  p {
    text-indent: 2em;
    font-size: 14px;
    padding: 5px 10px;
    line-height: 1.6;
    span.underline {
      border-bottom: 1px solid red;
      padding: 0 10px;
      padding-bottom: 2px;
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
.check-box {
  margin: 10px;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  p {
    padding: 5px 10px;
  }
}
.check-btn {
  display: flex;
  padding: 4px 8px;
  padding-bottom: 10px;
  button {
    flex: 1;
    margin: 4px;
  }
}
</style>
