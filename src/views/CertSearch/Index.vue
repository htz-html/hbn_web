<template>
  <main>
    <form action="/">
      <van-search
        v-model="IdentityNum"
        placeholder="请输入身份证号"
        @search="onSearch"
      />
    </form>
    <template v-if="firstCheck">
      <loading-wrap :loading="loading" content="正在获取证书..." />
      <div v-if="!loading">
        <van-cell title="姓名" :value="student.Name"></van-cell>
        <no-data :noData="!certlist.length"></no-data>
      </div>
      <ul>
        <li v-for="(item, index) in certlist" :key="item.CertId">
          <van-cell title="证件类型" :value="item.CertName"></van-cell>
          <van-cell title="证件级别" :value="item.CertLevel"></van-cell>
          <van-cell title="证件号" :value="item.CertNo"></van-cell>
          <van-cell title="发放单位" :value="item.CertOrg"></van-cell>
          <div class="img-wrap">
            <van-image
              :src="item.CertUrl"
              width="19rem"
              height="6rem"
              radius="10"
              fit="cover"
              @click="$multipleImgPreview(imgList, index)"
            >
              <van-loading slot="loading" type="circular" size="20px" />
            </van-image>
          </div>
        </li>
      </ul>
    </template>
  </main>
</template>

<script>
import Vue from "vue";
import { Search, Cell, Image, Loading } from "vant";
Vue.use(Search)
  .use(Cell)
  .use(Loading)
  .use(Image);
export default {
  data() {
    return {
      IdentityNum: "",
      student: {},
      certlist: [],
      loading: false,
      firstCheck: false
    };
  },
  computed: {
    imgList() {
      return this.certlist.map(i => i.CertUrl);
    }
  },
  methods: {
    onSearch(value) {
      this.firstCheck = true;
      this.loading = true;
      this.$api
        .certSearch({ args: { IdentityNum: value } })
        .then(res => {
          res.data.certlist = res.data.certlist.map(item => {
            return {
              ...item,
              CertUrl: item.CertUrl
            };
          });
          Object.assign(this, res.data);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
li {
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  .img-wrap {
    padding: 10px 5px;
  }
}
.van-cell__value {
  flex: 3;
}
</style>
