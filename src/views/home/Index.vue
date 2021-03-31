<template>
  <main>
    <div class="banner-container">
      <template v-if="swipeData.length > 0">
        <van-swipe :autoplay="3000" indicator-color="#4d6">
          <van-swipe-item
            v-for="(item, index) in swipeData"
            :key="item.Pri + '-' + index"
          >
            <van-image
              :src="item.ImageUrl"
              width="100%"
              height="10.625rem"
              @click="swipeClick(item.TargetUrl)"
            >
              <van-loading
                slot="loading"
                type="circular"
                size="30px"
              ></van-loading>
            </van-image>
          </van-swipe-item>
        </van-swipe>
      </template>
      <template v-else>
        <skeleton width="100%" height="10.625rem"></skeleton>
      </template>
    </div>
    <div class="catalog-container">
      <template v-if="catalogData.length > 0">
        <ul class="catalog-wrap">
          <li
            v-for="(item, index) in catalogData"
            :key="item.Id + '--' + index"
            @click="swipeClick(item.Url)"
          >
            <div>
              <van-image :src="item.ImageUrl" width="30px" height="30px">
                <van-loading slot="loading" type="circular" size="1rem" />
              </van-image>
              <p v-text="item.Name"></p>
            </div>
          </li>
        </ul>
      </template>
      <template v-else>
        <ul class="catalog-wrap">
          <li v-for="index in 8" :key="index + '+ske'">
            <div>
              <skeleton
                width="30px"
                height="30px"
                circle
                style="margin-bottom:5px"
              ></skeleton>
              <br />
              <skeleton width="3rem" height="16px"></skeleton>
            </div>
          </li>
        </ul>
      </template>
    </div>
    <div class="product-list">
      <div class="divider flex-center">
        <p class="flex-center">热门服务</p>
      </div>
      <ul>
        <template v-if="hotListData.length > 0">
          <service-card
            v-for="(item, index) in hotListData"
            :key="item.Name + '---' + index"
            :item="item"
          ></service-card>
        </template>
        <template v-else>
          <li v-for="item in 2" :key="'ske+' + item" class="skeleton-card">
            <skeleton width="9.5rem" square></skeleton>
            <div class="product-content">
              <skeleton style="margin-bottom:8px"></skeleton>
              <skeleton style="margin-bottom:8px"></skeleton>
              <skeleton width="4rem"></skeleton>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </main>
</template>

<script>
import mixin from "js/mixin.js";
import { jump } from "js/tools";
import serviceCard from "components/card/ServiceCard.vue";
import { Loading, SwipeItem, Swipe, Image } from "vant";
import Vue from "vue";

Vue.use(Loading)
  .use(SwipeItem)
  .use(Swipe)
  .use(Image);
export default {
  name: "home",
  mixins: [mixin],
  components: {
    serviceCard
  },
  data() {
    return {
      swipeData: [],
      catalogData: [],
      hotListData: []
    };
  },
  activated() {
    this.$nextTick(() => {
      document.documentElement.scrollTo(0, 0);
    });
  },
  methods: {
    init() {
      let companyId = this.$store.state.CompanyId;
      this.$api.getSwipe({ companyId }).then(res => {
        this.swipeData = res.data;
      });
      this.$api.getCatalog({ companyId }).then(res => {
        this.catalogData = res.data.navlink;
      });
      this.$api.getHotList({ companyId }).then(res => {
        this.hotListData = res.data;
      });
      this.$shareApi("home", { companyid: companyId });
    },
    swipeClick(url) {
      jump.call(this, url);
    }
  }
};
</script>

<style lang="scss" scoped>
.catalog-container {
  background: #fff;
}
.catalog-wrap {
  li {
    display: inline-flex;
    width: 25%;
    margin: 10px 0;
    justify-content: center;
    align-items: center;
    text-align: center;
    p {
      line-height: 2;
    }
  }
}
.indicators {
  padding: 5px 0;
  .circle {
    width: 15px;
    height: 2px;
    background: #ddd;
    margin: 0 2px;
    &.active {
      background: $green;
    }
  }
}
.divider {
  margin: 10px 0;
  position: relative;
  font-size: 16px;
  font-weight: 700;
  color: $orange;
  p {
    &::before,
    &::after {
      content: "";
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $orange;
    }
    &::before {
      margin-right: 10px;
    }
    &::after {
      margin-left: 10px;
    }
  }
  &::before,
  &::after {
    content: "";
    width: 40px;
    display: block;
    height: 2px;
    background: $orange;
  }
}
.skeleton-card {
  display: inline-block;
  margin: 0 0.25rem;
  box-sizing: border-box;
  width: 9.5rem;
  margin-bottom: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  .product-content {
    padding: 10px;
  }
}
</style>
