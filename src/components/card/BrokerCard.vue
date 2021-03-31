<template>
  <li class="broker-item">
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
      <p>{{ item.LoginName }}</p>
    </div>
    <div class="right">
      <p class="top">{{ item.CatchWord }}</p>
      <div class="bottom">
        <p>{{ item.BranchValues }}</p>
        <van-button
          type="primary"
          size="small"
          class="btn-1"
          @click="praiseAdd"
        >
          <van-icon name="good-job" tag="span"></van-icon>
          <span>{{ item.Praise }}</span>
        </van-button>
        <van-button
          plain
          type="primary"
          size="small"
          class="btn-2"
          @click="
            $router.push({
              name: 'brokerdetailindex',
              query: { brokerid: item.Id }
            })
          "
        >
          <span>进入主页</span>
        </van-button>
      </div>
    </div>
  </li>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { Button, Loading, Image, Icon, Lazyload, Toast } from "vant";
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
  },
  methods: {
    ...mapMutations(["showLoginBox"]),
    ...mapActions(["checkId"]),
    praiseAdd() {
      this.checkId({ needBind: true }).then(
        () => {
          this.$api
            .praiseAdd({
              args: {
                brokerid: this.item.Id
              }
            })
            .then(() => {
              this.item.Praise++;
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
.img-wrap {
  overflow: hidden;

  width: 78px;
  height: 78px;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1);
}

.broker-item {
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
  justify-content: center;

  width: 80px;
  padding-right: 10px;

  border-right: 1px dashed #888;

  text-align: center;

  > p {
    width: 5em;
    margin-top: 14px;

    font-size: 16px;
  }
}

.right {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  padding-left: 10px;

  .top {
    color: #888;
  }

  .bottom {
    > p {
      margin-bottom: 10px;

      color: $orange;
    }

    button {
      padding: 0 14px;

      border-radius: 10px;

      > span {
        display: inline-block;

        height: 28px;

        line-height: 28px;

        vertical-align: middle;
      }

      &.btn-1 {
        margin-right: 5px;

        color: #fff;
        border-color: $green;
        background: $green;
      }

      &.btn-2 {
        color: $green;
        background: #fff;

        transition: all 0.1s;
      }
    }
  }
}
</style>
