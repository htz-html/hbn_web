import Vue from "vue";
import Router from "vue-router";
import store from "@/store.js";
Vue.use(Router);
let home = [
  {
    path: "/home",
    name: "home",
    component: () => import("views/home/Index.vue"),
    meta: {
      title: "首页",
      keepAlive: true,
      scrollTop: 0,
      bridge: true
    }
  }
];
let baomu = [
  {
    path: "/baomu",
    name: "baomu",
    component: () => import("views/business/baomu/Index.vue"),
    meta: {
      keepAlive: true,
      scrollTop: 0
    }
  },
  {
    path: "/baomu/detail",
    name: "bmdetail",
    component: () => import("views/business/baomu/BaomuDetail.vue"),
    meta: {
      title: "精选保姆"
    }
  }
];
let yuesao = [
  {
    path: "/yuesao",
    name: "yuesao",
    component: () => import("views/business/yuesao/Index.vue"),
    meta: {
      title: "月嫂",
      keepAlive: true,
      scrollTop: 0,
      headerClass: "ys"
    }
  },
  {
    path: "/yuesao/detail",
    name: "ysdetail",
    component: () => import("views/business/yuesao/YuesaoDetail.vue"),
    meta: {
      title: "月嫂",
      headerClass: "ys"
    }
  }
];
let gz = [
  {
    path: "/guzhu",
    name: "guzhu",
    component: () => import("views/business/guzhu/index.vue"),
    meta: {
      keepAlive: true,
      scrollTop: 0
    }
  }
];
let broker = [
  {
    path: "/broker",
    name: "broker",
    component: () => import("views/broker/baomu/Index.vue"),
    meta: {
      title: "明星经纪人",
      keepAlive: true,
      scrollTop: 0
    }
  },
  {
    path: "/broker/detail",
    name: "brokerdetail",
    component: () => import("views/broker/baomu/BrokerDetail.vue"),
    meta: {
      title: "明星经纪人"
    },
    children: [
      {
        path: "/broker/detail/index",
        name: "brokerdetailindex",
        component: () => import("views/broker/baomu/BrokerDetailIndex.vue")
      },
      {
        path: "/broker/detail/mybaomu",
        name: "brokerdetailmybaomu",
        component: () => import("views/broker/baomu/BrokerBaomu.vue")
      },
      {
        path: "/broker/detail/myguzhu",
        name: "brokerdetailmyguzhu",
        component: () => import("views/broker/baomu/BrokerGuzhu.vue")
      }
    ]
  },
  {
    path: "/ysbroker",
    name: "ysbroker",
    component: () => import("views/broker/yuesao/Index.vue"),
    meta: {
      title: "明星经纪人",
      keepAlive: true,
      scrollTop: 0,
      headerClass: "ys"
    }
  }
];
let service = [
  {
    path: "/service",
    name: "service",
    component: () => import("views/service/Index.vue"),
    meta: {
      keepAlive: true,
      scrollTop: 0,
      bridge: true
    }
  },
  {
    path: "/service/detail",
    name: "servicedetail",
    component: () => import("views/service/ServiceDetail.vue"),
    meta: {
      bridge: true
    }
  },
  {
    path: "/service/guestbook",
    name: "serviceguestbook",
    component: () => import("views/service/ServiceGuestBook.vue"),
    meta: {
      bridge: true
    }
  }
];
let recruit = [
  {
    path: "/recruit",
    name: "recruit",
    component: () => import("views/recruit/Index.vue"),
    meta: {
      title: "招贤纳士"
    }
  },
  {
    path: "/recruit/job",
    name: "job",
    component: () => import("views/recruit/Job.vue"),
    meta: {
      title: "招贤纳士"
    }
  }
];
let my = [
  {
    path: "/my",
    name: "my",
    component: () => import("views/my/Index.vue"),
    meta: {
      title: "个人中心"
    }
  },
  {
    path: "/my/orderlist",
    name: "orderlist",
    component: () => import("views/my/OrderList.vue")
  },
  {
    path: "/my/setting",
    name: "usersetting",
    component: () => import("views/my/MySetting.vue")
  },
  {
    path: "/emp/contarct_sign",
    name: "empcontractsign",
    component: () => import("views/my/Contract.vue")
  }
];
let other = [
  {
    path: "*",
    name: "notfound",
    component: () => import("views/NotFound.vue"),
    meta: {
      title: "页面不存在"
    }
  },
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/authLogin",
    name: "authLogin",
    component: () => import("views/authLogin.vue"),
    meta: {
      title: "微信授权登陆中..."
    }
  },
  {
    path: "/readypay",
    name: "readypay",
    component: () => import("views/pay/ReadyPay.vue"),
    meta: {
      title: "支付页面"
    }
  },
  {
    path: "/nCoV-check",
    name: "nCov",
    component: () => import("views/Others/nCov_Check.vue"),
    meta: {
      title: "防疫确认函"
    }
  },
  {
    path: "/pledge",
    name: "pledge",
    component: () => import("views/Others/pledge.vue"),
    meta: {
      title: "承诺书"
    }
  }
];
let cert = [
  {
    path: "/cert/search",
    name: "certsearch",
    component: () => import("views/CertSearch/Index.vue"),
    meta: {
      title: "证件查询"
    }
  }
];
let router = new Router({
  routes: [
    ...home,
    ...baomu,
    ...yuesao,
    ...gz,
    ...broker,
    ...service,
    ...my,
    ...other,
    ...recruit,
    ...cert
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.meta.keepAlive) {
      return {
        x: 0,
        y: to.meta.scrollTop || 0
      };
    }
    // from.meta.position = savedPosition
    // if (to.meta.position) {
    //   return to.meta.position
    // }
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: to.meta.position || 0
      };
    }
  }
});

function bridge() {
  // body

  if (store.state.env !== "html") {
    return;
  }
  var _hmt = _hmt || [];
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?0551855347713ddec62fcd76d6118e5b";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
}

router.beforeEach((to, from, next) => {
  let newBridge = document.querySelector("#newBridge");
  if (to.meta.bridge) {
    if (window._hmt) {
      newBridge.style.display = "block";
    } else {
      bridge();
    }
  } else {
    if (newBridge) {
      newBridge.style.display = "none";
    }
  }

  if (from.meta.keepAlive) {
    from.meta.scrollTop = document.documentElement.scrollTop;
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (store.state.onLogin) {
    store.commit("hideLoginBox");
  }
  store.commit("setHistory", from.name);
  next();
});
router.afterEach(() => {
  store.state.doubleJump = false;
});
export default router;
