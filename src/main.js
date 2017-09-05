import "assets/css/iconfont.css"

import Vuex from "vuex"

// 引入NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入Vue
import Vue from "vue"

import 'babel-polyfill';
import { Promise } from 'es6-promise-polyfill';

// 引入Element组件
import ElementUI from "element-ui"
import "element-ui/lib/theme-default/index.css"

// 引入Swiper组件
import VueAwesomeSwiper from 'vue-awesome-swiper'

// 引入highcharts组件
import VueHighcharts from 'vue-highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display.src';
import Highcharts from 'highcharts/highstock';
// import loadDrilldown from 'highcharts/modules/drilldown';
NoDataToDisplay(Highcharts)

// 引入Vue路由
import VueRouter from "vue-router"

// 引入路由配置
import routes from "./routes"

// 引入高德地图
import AMap from "vue-amap";

// 引入App主入口
import App from "./App.vue"

Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueHighcharts, { Highcharts }) //Vue.use(VueHighcharts, { Highcharts })
NProgress.configure({ showSpinner: false })

// import Mock from './mock'
// Mock.haoxueche();

const router = new VueRouter({
  // mode: 'history',
  routes
});

const store = new Vuex.Store({
  state: {
    count: 0,
    department: {},
    collapsed: false,
    tranningPicture: [],
    user: JSON.parse(sessionStorage.getItem("user")),
  },
  mutations: {
    increment(state) {
      state.count++
    },
    change(state, value) {
      state.collapsed = value;
    },
    tranningPicture(state, value) {
      state.tranningPicture = value;
    }
  }
});

//钩子函数
router.beforeEach((to, from, next) => {
  let destnation = to.path;
  let requireAuth = to.meta.requireAuth;
  if (requireAuth) {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user && destnation != "/login") {
      next({ path: "/login" });
    }
    else {
      next();
    }
  }
  else {
    next();
  }
});

router.afterEach(function (transition) {
  document.title = transition.name;
});

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
});