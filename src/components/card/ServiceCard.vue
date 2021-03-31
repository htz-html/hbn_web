<template>
  <li @click="onClick">
    <van-image :src="item.FilePath" width="9.5rem" height="9.5rem">
      <van-loading slot="loading" type="circular" size="30px" />
    </van-image>
    <div class="product-content">
      <h4 v-text="item.Name" class="product-name"></h4>
      <h5
        v-text="item.Description"
        class="product-description van-ellipsis"
      ></h5>
      <p class="product-price">
        <template v-if="item.ShowPrice > 0">
          <span style="color:#ED4124">
            ￥
            <span v-text="item.ShowPrice" style="font-size:1.2rem"></span>
          </span>
          /
          <span v-text="item.ShowUnit"></span>
        </template>
        <span v-else style="line-height:22px;color:#ED4124">留言咨询</span>
      </p>
    </div>
  </li>
</template>

<script>
import { Image, Loading } from "vant";
import Vue from "vue";
Vue.use(Loading).use(Image);
export default {
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    onClick() {
      let type = (this.item.OptionValues & 4) === 4;
      let route = { query: { hbnserviceid: this.item.HbnServiceId } };
      route.name = type ? "serviceguestbook" : "servicedetail";
      this.$router.push(route);
    }
  }
};
</script>

<style lang="scss" scoped>
li {
  display: inline-block;
  overflow: hidden;

  box-sizing: border-box;
  width: 9.5rem;
  margin: 0 0.25rem;
  margin-bottom: 8px;

  border-radius: 10px;
  background: #fff;
}

.product-content {
  padding: 10px;

  .product-name {
    margin-bottom: 8px;

    font-size: 16px;
    font-weight: 700;
  }

  .product-description {
    min-height: 20px;
    margin-bottom: 8px;

    color: #999;

    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  .product-price {
    color: #999;

    font-size: 12px;

    text-align: right;
  }
}
</style>
