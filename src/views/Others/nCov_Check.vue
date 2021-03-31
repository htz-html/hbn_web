<template>
  <main v-if="!loading.get">
    <header>
      <h2>
        防疫确认函<van-button
          v-if="imgUrl"
          type="info"
          size="mini"
          @click="$singleImgPreview(imgUrl)"
          >确认记录</van-button
        >
      </h2>
      <div></div>
    </header>
    <section class="content-container">
      <div class="content">
        <p>
          <span>
            姓名
          </span>
          <i>{{ name }}</i>
        </p>
        <p>
          <span>
            身份证号码
          </span>
          <i>{{ id }}</i>
        </p>
        <p>
          最近15天内，体温正常、无浑身酸痛、无咳嗽头疼、无呼吸困难，无接触疫情人员等，且神态健康。在这15天内，没有到过湖北区域，也没有接触过从湖北来的人员，并且有认真学习防疫知识。
        </p>
      </div>
    </section>
    <section>
      <van-cell title="本人于今日测得体温如下："></van-cell>
      <van-field
        label="体温℃"
        :value="tem.value"
        clickable
        readonly
        placeholder="输入一小时内有效体温"
        :error="tem.value.length !== 4 || +tem.value < 35 || +tem.value > 40"
        @touchstart.native.stop="tem.NumberKeyboard = true"
      ></van-field>
      <van-number-keyboard
        :show="tem.NumberKeyboard"
        close-button-text="完成"
        extra-key="."
        title="体温"
        @blur="tem.NumberKeyboard = false"
        @input="onTemInput"
        @delete="onTemDelete"
      />
    </section>
    <section>
      <van-cell title="本人最近15天的行程如下："></van-cell>
      <div v-for="i in list.length" :key="i">
        <van-cell-group :title="`第${i}段时间`" class="record">
          <van-cell
            title="日期"
            :value="list[i - 1] | formatDate"
            @click="onDate(i - 1)"
          ></van-cell>
          <van-cell
            title="城市"
            @click="onArea(i - 1)"
            :value="list[i - 1].addr || '点击选择城市'"
          ></van-cell>
        </van-cell-group>
      </div>

      <div class="btn-group">
        <van-button type="primary" icon="add-o" size="small" @click="addItem"
          >添 加</van-button
        ><van-button
          type="warning"
          icon="close"
          size="small"
          @click="deleteItem"
          :disabled="list.length === 1"
        >
          删 除
        </van-button>
      </div>
    </section>

    <footer>
      <div class="check-box">
        <van-checkbox
          v-model="isCheck"
          shape="square"
          class="pay-check"
          checked-color="#4d6"
          icon-size="20px"
        >
          <p style="padding-left:15px">
            确认信息：本人<span style="color:red">郑重确认以上内容</span
            >无隐瞒、无漏报，本人所言均属实，若有不实，本人愿意承担一切后果。
          </p>
        </van-checkbox>
      </div>
      <div class="chenk-btn">
        <van-button
          :disabled="!isCheck"
          block
          type="primary"
          size="normal"
          @click="signature.popup = true"
          >签名</van-button
        >
      </div>
    </footer>

    <van-calendar
      v-model="calendar.show"
      type="range"
      :min-date="calendar.minDate"
      :max-date="calendar.maxDate"
      @confirm="onCalendar"
      color="#1c3"
    ></van-calendar>
    <van-popup v-model="area.show" position="bottom">
      <van-picker
        show-toolbar
        title="城市"
        :loading="!areaData"
        :columns="areaData"
        @confirm="onAreaConfirm"
        @cancel="area.show = false"
        ref="areaPicker"
      ></van-picker>
    </van-popup>
    <van-popup v-model="signature.popup" position="bottom">
      <van-cell title="在此区域签名"> </van-cell>
      <div class="signature" v-if="signature.popup">
        <vueSignature
          ref="signature"
          :sigOption="signature.option"
          :w="'100%'"
          :h="'160px'"
          :defaultUrl="signature.src"
        ></vueSignature>
      </div>
      <div class="chenk-btn">
        <van-button
          type="primary"
          size=""
          @click="onCheck"
          :loading="loading.update"
          loading-text="提交中..."
          >提交</van-button
        >
        <van-button type="danger" plain="" size="" @click="reSign"
          >重新签名</van-button
        >
      </div>
    </van-popup>
  </main>
</template>

<script>
import Vue from "vue";
import VueSignature from "vue-signature";
import {
  Cell,
  Calendar,
  CellGroup,
  Popup,
  Picker,
  Divider,
  NumberKeyboard,
  Field,
  Panel,
  Button,
  Checkbox,
  Toast,
  Dialog
} from "vant";
Vue.use(VueSignature);
Vue.use(Cell)
  .use(Field)
  .use(Calendar)
  .use(Popup)
  .use(CellGroup)
  .use(Divider)
  .use(Checkbox)
  .use(NumberKeyboard)
  .use(Panel)
  .use(Picker)
  .use(Button);
export default Vue.extend({
  data() {
    return {
      imgUrl: "",
      loading: {
        get: false,
        update: false
      },
      employeeid: null,
      brokerid: null,
      name: "",
      id: "",
      tem: { value: "", NumberKeyboard: false },
      isCheck: false,
      calendar: {
        show: false,
        index: 0,
        minDate: new Date(2020, 0, 1),
        maxDate: new Date(2020, 3, 1)
      },
      area: {
        show: false,
        index: 0,
        data: null
      },
      list: [],
      signature: {
        popup: false,
        src: "",
        option: {
          penColor: "rgb(0, 0, 0)",
          backgroundColor: "transparent"
        }
      }
    };
  },
  computed: {
    areaData() {
      let { data } = this.area;
      if (!data) return null;
      return data.map(province => {
        let { Children, Id, Name } = province;
        let children = Children.map(city => {
          return {
            text: city.Name,
            ...city
          };
        });
        return {
          text: Name,
          Id,
          children
        };
      });
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.calendar.maxDate = new Date();
      this.calendar.minDate = new Date(
        new Date().getTime() - 1000 * 3600 * 24 * 30
      );

      let { brokerid, employeeid } = this.$route.query;
      Object.assign(this, { brokerid, employeeid });
      if (!(brokerid && employeeid)) {
        Toast.fail({
          message: "参数错误，请联系经纪人",
          duration: 0,
          closeOnClick: true
        });
        return;
      }
      Toast.loading("请稍后");
      this.loading.get = true;

      this.$api.get防疫确认函({ args: { employeeid, brokerid } }).then(res => {
        let { name, idnum, signature, travel, imgUrl } = res.data;
        this.imgUrl = imgUrl;
        this.name = name;
        this.id = idnum;
        this.signature.src = signature;
        const obj = {
          date1: null,
          date2: null,
          addr: null
        };
        this.list = travel.length ? travel : [obj];
        this.$wxshare(res.extdata.sharedata);
        this.loading.get = false;
        Toast.clear();
      });
      this.$api.getProvince({ showcity: true }).then(res => {
        this.area.data = res.data;
      });
    },
    onCalendar(date) {
      const [date1, date2] = date;
      let { calendar, list } = this;
      Object.assign(list[calendar.index], {
        date1: this.f(date1),
        date2: this.f(date2)
      });
      calendar.show = false;
    },
    onDate(index) {
      Object.assign(this.calendar, { index, show: true });
    },
    onArea(index) {
      Object.assign(this.area, { index, show: true });
    },
    onIdInput(key) {
      this.id.value = this.id.value + key;
    },
    onIdDelete() {
      this.id.value = this.id.value.substring(0, this.id.length - 1);
    },
    onTemInput(key) {
      let { value } = this.tem;
      const length = value.length;
      switch (length) {
        case 2: {
          if (key !== ".") {
            return;
          }
          this.tem.value = value + key;
          break;
        }
        case 4: {
          return;
        }
        default: {
          if (key === ".") {
            return;
          }
          this.tem.value = value + key;
          break;
        }
      }
    },
    onTemDelete() {
      this.tem.value = this.tem.value.substring(0, this.tem.value.length - 1);
    },
    onAreaConfirm(values) {
      let { area, list } = this;
      list[area.index].addr = values.join("-");
      this.area.show = false;
    },
    addItem() {
      this.list.push({
        date1: null,
        date2: null,
        addr: null
      });
    },
    deleteItem() {
      this.list.pop();
    },
    reSign() {
      this.$refs.signature.clear();
    },
    onCheck() {
      const { isCheck, list, tem, brokerid, employeeid } = this;
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
        signature,
        travel: list,
        temperature: tem.value
      };
      let args = {
        brokerid,
        employeeid
      };
      this.loading.update = true;

      this.$api.update防疫确认函({ args, data }).then(
        res => {
          this.signature.popup = false;
          this.loading.update = false;
          Dialog.confirm({
            title: "提交成功",
            message: "是否查看确认函"
          })
            .then(() => {
              this.$singleImgPreview(res.data);
            })
            .catch(() => {
              this.init();
            });
        },
        () => {
          this.loading.update = false;
        }
      );
    },
    f(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
  },
  filters: {
    formatDate(data) {
      const { date1, date2 } = data;
      const f = date => {
        let [year, month, day] = date.split("/");
        year;
        return `${month}月${day}日`;
      };
      if (date1 && date2) {
        return `${f(date1)} - ${f(date2)}`;
      } else {
        return "点击选择日期";
      }
    }
  }
});
</script>
<style lang="scss" scoped>
header {
  background: #fff;
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
section,
footer,
header {
  margin: 10px 0;
}
.content-container {
  font-size: 14px;
  background: #fff;
  .content {
    line-height: 2;
    padding: 12px 16px;
    text-indent: 2em;
    i {
      font-weight: 800;
      text-indent: 0;
      display: inline-block;
      padding: 0 12px;
      border-bottom: 1px solid #333;
      font-style: italic;
    }
    span {
      text-indent: 0;
      display: inline-block;
      width: 7em;
      &::after {
        content: "：";
      }
    }
  }
}
.btn-group {
  display: flex;
  justify-content: flex-end;
  background: #fff;
  padding: 10px;
  button {
    margin-left: 10px;
  }
}
.signature {
  background: #eee;
  border: 15px solid #ddd;
}
.check-box {
  margin: 10px;
}
.chenk-btn {
  display: flex;
  padding: 4px 8px;
  button {
    flex: 1;
    margin: 4px;
  }
}
</style>
