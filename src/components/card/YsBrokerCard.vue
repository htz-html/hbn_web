<template>
  <li class="ysbroker-item">
    <div class="left">
      <div class="img-wrap">
        <van-image
          :src="item.HeadPhoto"
          width="80"
          lazy-load
          @click="$singleImgPreview(item.HeadPhoto)"
        >
          <van-loading slot="loading" type="circular" size="30px"></van-loading>
        </van-image>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <h3>{{ item.LoginName }}</h3>
        <h4>
          <span>{{ item.BranchValues }}</span>
          <span style="color:#e48;margin-left:6px">{{ item.Mobile }}</span>
        </h4>
        <p>{{ item.CatchWord }}</p>
      </div>
    </div>
  </li>
</template>

<script>
import { Button, Loading, Image, Icon, Lazyload } from "vant";
import Vue from "vue";
Vue.use(Button)
  .use(Loading)
  .use(Image)
  .use(Icon)
  .use(Lazyload);
export default {
  props: {
    item: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.img-wrap {
  overflow: hidden;

  width: 78px;
  height: 78px;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1);
}

.ysbroker-item {
  display: flex;

  margin-bottom: 10px;
  padding: 10px;

  border-radius: 10px;
  background: #fff;
}

.left {
  display: flex;
  align-items: center;
  flex-direction: column;

  padding-right: 10px;

  text-align: center;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding-left: 10px;

  h3,
  h4 {
    line-height: 1.6;
  }

  h3 {
    font-size: 16px;
  }

  h4 {
    font-size: 14px;
    font-weight: 500;
  }

  p {
    margin-top: 5px;

    line-height: 2;
  }
}

.bottom {
  margin-top: 10px;

  button {
    padding: 0 14px;

    color: #e48;
    border-color: #e48;
    border-radius: 3px;
    background: #fff;

    transition: all 0.1s;
  }
}
</style>
