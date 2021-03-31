<template>
  <footer>
    <van-tabbar
      v-model="active"
      :active-color="$route.meta.headerClass ? '#a7d' : '#4d6'"
      inactive-color="#333"
      safe-area-inset-bottom
    >
      <van-tabbar-item
        v-for="(tabbar, index) in tabbarData"
        :key="tabbar.route"
        :name="tabbar.route"
        @click.native="onClick(index, tabbar)"
      >
        <i
          slot="icon"
          slot-scope="props"
          class="iconfont"
          :class="props.active ? tabbar.active : tabbar.normal"
        ></i>
        <p>{{ tabbar.name }}</p>
      </van-tabbar-item>
    </van-tabbar>
    <van-action-sheet
      v-model="actionShow"
      :actions="action"
      @select="onSelect"
      @click-overlay="cancel"
    />
  </footer>
</template>

<script>
import { Tabbar, TabbarItem, ActionSheet } from "vant";
import Vue from "vue";
Vue.use(Tabbar)
  .use(TabbarItem)
  .use(ActionSheet);

export default {
  data() {
    return {
      active: null,
      tabbarData: [
        {
          route: "home",
          normal: "iconicon_home",
          active: "iconicon_solid_home",
          name: "首页"
        },
        {
          route: "business",
          normal: "iconicon_baomu",
          active: "iconicon_solid_baomu",
          name: "保姆月嫂",
          children: [
            {
              route: "baomu",
              name: "保姆"
            },
            {
              route: "yuesao",
              name: "月嫂"
            },
            {
              route: "broker",
              name: "经纪人"
            },
            {
              route: "ysbroker",
              name: "母婴顾问"
            }
          ]
        },

        {
          route: "service",
          normal: "iconicon_service",
          active: "iconicon_solid_service",
          name: "综合服务"
        },
        {
          route: "learn",
          normal: "iconpeixun",
          active: "iconpeixun",
          name: "招聘培训",
          children: [
            {
              route: "recruit",
              name: "人才招聘"
            },
            {
              route: "service",
              query: { type: 8, reload: 2 },
              name: "家政培训"
            },
            {
              route: "certsearch",
              name: "证书查询"
            }
          ]
        },
        {
          route: "my",
          normal: "iconicon_my",
          active: "iconicon_solid_my",
          name: "我的"
        }
      ],
      actionIndex: null,
      actionShow: false,
      action: []
    };
  },
  watch: {
    active: function(to) {
      this.tabbarData.forEach(i => {
        if (i.children) {
          let obj = i.children.find(j => j.route === to);
          obj && (i.route = obj.route);
        }
      });
      this.tabbarData[3].route = "learn";
    }
  },
  methods: {
    onClick(index, item) {
      if (index === 1 || index === 3) {
        this.actionIndex = index;
        this.action = item.children;
        this.actionShow = true;
      } else {
        this.$router.push({ name: item.route }).catch(() => {});
      }
    },
    onSelect(item) {
      this.$router
        .push({ name: item.route, query: item.query })
        .catch(() => {});
      this.actionShow = false;
    },
    cancel() {
      this.active = this.$route.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.iconfont {
  font-size: 24px !important;
}

.van-tabbar-item__text {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
}
</style>
