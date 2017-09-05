<template id="home">
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="12" class="logo">
        <img src="http://img.haoxueche.com:8888/group1/M00/01/C4/wKgKH1jwe-uAB3QkAAAQqOgfuvM002.png" />
        <span style="font-size:1.2em;font-family:webfont">{{schoolName}}</span>
      </el-col>
      <el-col :span="12" class="userinfo">
        <el-popover ref="msg-popover" placement="bottom-end" width="400" trigger="hover" :visible-arrow="false" :disabled="!messages.notice.length">
          <a href="javascript:;" v-for="(item,index) in messages.notice" v-if="index<5" @click="()=>{messages.notice=[];addTab($router.options.routes[14].children[0]);}">{{item.title}}</a>
        </el-popover>
        <el-popover ref="alarm-popover" placement="bottom-end" width="400" trigger="hover" :visible-arrow="false" :disabled="!messages.warning.length">
          <a href="javascript:;" v-for="(item,index) in messages.warning" v-if="index<5" @click="()=>{messages.warning=[];addTab($router.options.routes[14].children[1]);}">{{item.title}}</a>
        </el-popover>
        <el-menu mode="horizontal" @select="handleSelect" unique-opened>
          <el-menu-item index="14-0" v-popover:msg-popover>
            消息
            <el-badge class="mark" :value="messages.notice.length" :max="5" />
            <span class="glyph-icon icon-xiaoxi"></span>
          </el-menu-item>
          <el-menu-item index="14-1" v-popover:alarm-popover>
            报警
            <el-badge class="mark" :value="messages.warning.length" :max="5" />
            <span class="glyph-icon icon-baojing"></span>
          </el-menu-item>
          <el-submenu index="0-0">
            <template slot="title">个人中心</template>
            <el-menu-item index="0-1">上传财务公章</el-menu-item>
            <el-menu-item index="0-2">退出</el-menu-item>
          </el-submenu>
          <!--<el-menu-item index="3"><a href="javascript:">个人中心</a></el-menu-item>-->
        </el-menu>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <div style="height:30px;background-color:transparent;color:#FFF;">
          <a class="collapse-bar" :class="collapsed?'glyph-icon icon-zhedie':'glyph-icon icon-dakai'" @click.prevent="collapse">
          </a>
        </div>
        <el-menu :default-active="$route.path" unique-opened v-show="!collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf&&checkRole(item.name)">
              <template slot="title">
                <i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-if="!child.hidden&&checkRole(child.name)" v-for="child in item.children" :index="child.path" @click="addTab(child);">
                <i :class="child.iconCls"></i>{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0&&checkRole(item.children[0].name)" :index="item.children[0].path" @click="addTab(item.children[0]);">
              <i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
            <template v-if="!item.leaf">
              <div class="el-submenu__title" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <i :class="item.iconCls"></i>
              </div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <li v-for="child in item.children" v-if="!child.hidden" class="el-menu-item" style="min-width:130px;display:block;text-align:left;padding-left:15px;" :class="$route.path==child.path?'is-active':''" @click="addTab(child);">
                  <i :class="child.iconCls"></i>{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
              <li class="el-submenu">
                <div class="el-submenu__title" :class="$route.path==item.children[0].path?'is-active':''" @click="addTab(item.children[0]);">
                  <i :class="item.iconCls"></i>
                </div>
              </li>
            </template>
          </li>
        </ul>
      </aside>
      <section class="main-content">
        <el-tabs v-model="currentTab" type="card" :closable="closable" @tab-remove="removeTab" @tab-click="tabSelect">
          <el-tab-pane v-for="(item, index) in tabs" :label="item.title" :name="item.name">
          </el-tab-pane>
        </el-tabs>
        <div class="content-container">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </section>
    </el-col>
    <!--上传公章-->
    <el-dialog title="上传公章" v-model="chapterFormVisible" :close-on-click-modal="false" custom-class="chapter-form" size="tiny">
      <el-upload class="avatar-uploader mt20" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="margin-left:45px;margin-top:30px;">
        <img v-if="chapterPic" :src="chapterPic" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer mt5">
        <el-button type="primary" size="large" @click.native="saveChapter">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { request } from "../api/api";
import { global } from "../assets/javascript/global";
export default {
  data() {
    return {
      authority: [],
      routerPath: [],
      currentTab: "",
      messages: {
        notice: [],
        warning: []
      },
      tabs: [],
      tabIndex: 0,
      closable: true,
      collapsed: false,
      chapterFormVisible: false,
      fileUploadAction: sessionStorage.getItem("baseUrl") + "/file/uploadFile",
      userId: JSON.parse(sessionStorage.getItem("user")).userId,
      schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
      schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
      chapterPic: JSON.parse(sessionStorage.getItem("user")).financialChapter
    }
  },
  methods: {
    //判断是否已存在相同选项卡
    isexists(item) {
      let tabs = this.tabs;
      for (let tab in tabs) {
        // if(tabs[tab].title === "消息详情"){
        //   return true;
        // }
        if (tabs[tab].title === item.name && tabs[tab].title !== "消息详情") {
          return true;
        }
      }
      return false;
    },
    //添加选项卡
    addTab(item) {
      let _this = this;
      this.closable = true;
      if (!this.isexists(item)) {
        let newTabName = ++this.tabIndex + "";
        this.tabs.push({
          title: item.name,
          name: newTabName,
          content: item.path
        });
        this.currentTab = newTabName;
        //this.$router.push({ name: item.name });
        this.$router.push(item.path);
      }
      else {
        let nextTabPath;
        let tabs = this.tabs;
        tabs.forEach((tab, index) => {
          if (tab.title === item.name) {
            this.currentTab = tab.name;
            nextTabPath = tab.content;
          }
        });
        this.$router.push(nextTabPath);
        //this.$router.push({ name: item.name });
      }
    },
    //点击选项卡
    tabSelect(item) {
      let nextTabPath;
      let tabs = this.tabs;
      tabs.forEach((tab, index) => {
        if (tab.title === item.label) {
          let nextTab = tabs[index];
          if (nextTab) {
            nextTabPath = nextTab.content;
            return false;
          }
        }
      });
      this.$router.push(nextTabPath);
    },
    //移除选项卡
    removeTab(targetName) {
      let tabs = this.tabs;
      if (tabs.length <= 1) {
        this.closable = false;
        return;
      }
      let nextTabPath;
      let activeName = this.currentTab;
      let currentTabTitle;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              currentTabTitle = nextTab.title;
              activeName = nextTab.name;
              nextTabPath = nextTab.content;
            }
            else {
              nextTabPath = "/";
            }
          }
        });
        //this.$router.push(nextTabPath);
        this.$router.push({ name: currentTabTitle, params: { curShow: 123 } });
      }
      this.currentTab = activeName;
      this.tabs = tabs.filter(tab => tab.name !== targetName);
    },
    //默认选项卡
    defaultShow() {
      let routes = this.$router.options.routes;
      // console.warn(routes);
      for (var item in routes) {
        if (!routes[item].hidden) {
          if (item === "8") {
            this.addTab(routes[item].children[0]);
          }
          // if (routes[item].leaf && routes[item].children.length > 0) {
          //   this.addTab(routes[item].children[0]);
          // }
        }
      }
    },
    handleSelect(keyPath) {
      var key = keyPath.split("-")[0];
      var children = keyPath.split("-")[1];
      if (key == 0) {
        if (children == 1) {
          this.chapterFormVisible = true;
        }
        else if (children == 2) {
          sessionStorage.clear();
          this.$router.replace({ path: "/" });
        }
      }
      else {
        if (children == 0) {
          this.messages.notice = [];
        }
        else {
          this.messages.warning = [];
        }
        this.addTab(this.$router.options.routes[key].children[children]);
      }
    },
    checkRole(roleName) {
      // return true;
      let results = false;
      let authority = this.authority;
      for (let item in authority) {
        if (authority[item] === roleName) {
          results = true;
          break;
        }
      }
      return results;
    },
    //折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed;
      this.$store.commit("change", this.collapsed);
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
    },
    //头像上传成功回调
    handleAvatarScucess(res, file) {
      if (res.success) {
        this.chapterPic = res.object[0];
      }
    },
    //头像上传前检测
    beforeAvatarUpload(file) {
      const validateType = file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!validateType) {
        this.$message.error("上传财务公章只能是 JPG 或 PNG 图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传财务公章图片大小不能超过 2MB!");
      }
      return validateType && isLt2M;
    },
    //上传驾校公章
    saveChapter() {
      let para = {
        financialChapter: this.chapterPic,
        schoolCode: this.schoolCode
      }
      request.systemSettings.branchSchool.create.financialChapter(para).then((res) => {
        if (res.success) {
          this.chapterFormVisible = false;
          this.$message.success({ message: "财务公章上传成功！" });
        }
        else {
          this.$message.error("财务公章上传失败，原因：" + res.message);
        }
      });
    },
    //查询消息（websocket）
    queryMessagesByWS() {
      // global.websocket.create("ws://" + sessionStorage.getItem('baseUrl').split("//")[1] + "/websocket/school/notice/admin/" + this.userId + "/" + JSON.parse(sessionStorage.getItem("user")).authorization, (event) => {
      //   global.printLog("websocket get message");
      //   let data = eval("(" + event.data + ")");
      //   if (data.type === "WARNING") {
      //     this.messages.warning.unshift({
      //       title: data.title
      //     });
      //   }
      //   else if (data.type === "NOTICE") {
      //     this.messages.notice.unshift({
      //       title: data.title
      //     });
      //   }
      // });
      let socket = new WebSocket("ws://" + sessionStorage.getItem('baseUrl').split("//")[1] + "/websocket/school/notice/admin/" + this.userId + "/" + JSON.parse(sessionStorage.getItem("user")).authorization);
      socket.onopen = (event) => {
        global.printLog("websocket open on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
        socket.onmessage = (event) => {
          global.printLog("websocket message on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
          let data = eval("(" + event.data + ")");
          if (data.type === "WARNING") {
            this.messages.warning.unshift({
              title: data.title
            });
          }
          else if (data.type === "NOTICE") {
            this.messages.notice.unshift({
              title: data.title
            });
          }
        }
      }
      //绑定关闭事件
      socket.onclose = (event) => {
        global.printLog("websocket close on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
      };
      //出现错误的时候的方法
      socket.onerror = (event) => {
        console.log(event);
        global.printLog("websocket error on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
      };
    },
    //查询训练场图层
    queryTranning3D() {
      request.public.queryTranning3DPicture([this.schoolCode, 1, 100]).then((res) => {
        if (res.success) {
          let tranningPic = [];
          if (res.object) {
            for (let item in res.object.list) {
              tranningPic.push({
                upLeft: res.object.list[item].upLeft,
                downRight: res.object.list[item].downRight,
                picUrl: res.object.list[item].picUrl
              });
            }
          }
          this.$store.commit("tranningPicture", tranningPic);
        }
      });
    }
  },
  created() {
    this.authority = [];
    let authority = JSON.parse(sessionStorage.getItem("user")).authCode;
    for (let item in authority) {
      this.authority.push(authority[item].functionName);
    }
    this.queryTranning3D();
    this.queryMessagesByWS();
  },
  mounted: function () {
    global.printLog(JSON.parse(sessionStorage.getItem("user")).financialChapter);
    this.addTab(this.$route);
    sessionStorage.setItem("collapsed", this.collapsed);
    //this.defaultShow();
  }
}

</script>

<style lang="scss">
.el-menu-item,
.el-submenu__title {
  color: #FFF;
}

.el-submenu .el-menu-item {
  color: #000;
}

.el-menu--horizontal .el-menu-item,
.el-menu--horizontal>.el-menu-item:hover,
.el-menu--horizontal>.el-submenu:hover .el-submenu__title {
  border-bottom: 0;
}

.el-menu--horizontal .el-menu-item:not(:last-child) {
  border-right: 1px solid rgba(17, 29, 47, 0.4);
}

.el-menu--horizontal>.el-menu-item:hover,
.el-menu--horizontal .el-submenu__title:hover {
  background: rgba(17, 29, 47, 0.4);
}

.el-menu--horizontal .el-menu-item.is-active {
  color: #FFF;
  background: rgba(17, 29, 47, 0.4);
}

.el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
  color: #FFF;
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  background: #21364c; // background:url(../../src/assets/images/bg.jpg) no-repeat top center fixed;
  background-size: cover;
  .header {
    height: 60px;
    line-height: 60px;
    color: #FFF; // box-shadow: 0 0 5px rgba(4, 0, 0, 0.3);
    .userinfo {
      .el-menu {
        float: right;
        background-color: transparent;
      }
      .userinfo-inner {
        color: #c0ccda;
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          float: right;
        }
      }
    }
    .logo {
      font-size: 16px;
      img {
        width: 30px;
        height: 30px;
        float: left;
        margin: 15px 10px 10px 18px;
      }
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    border-top: 0 solid #00C1DE;
    aside {
      // position: absolute;
      flex: 0 0 199px;
      width: 199px; // border-right: 1px solid #e4e8eb;
      // // bottom: 0;
      // // top: 0;
      // z-index: 1;
      // overflow: auto;
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 199px;
      width: 199px;
    }
    aside::-webkit-scrollbar {
      width: 0;
    }
    .collapsed {
      width: 60px;
      .item {
        position: relative;
      }
      .submenu {
        position: absolute;
        top: 0px;
        left: 60px;
        z-index: 99999;
        height: auto;
        display: none;
        background: #21364c;
      }
    }
    .el-menu {
      border-radius: 0;
      background: transparent;
      .el-submenu__title,
      .el-submenu .el-menu-item,
      .el-menu-item {
        height: 44px;
        line-height: 44px;
        color: #FFF;
        font-size: 12px;
      }
      .el-submenu__title {
        background-color: transparent;
      }
      .el-menu-item:hover,
      .el-submenu__title:hover {
        background: rgba(17, 29, 47, .4);
      }
      .el-menu-item.is-active {
        background: rgba(17, 29, 47, .4);
        color: #FFF;
      }
      .el-submenu__title {
        color: #FFF;
      }
    }
    section.main-content {
      flex: 1;
      background: #FFF;
      overflow-y: auto; // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 199px;
      .el-tabs--card {
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__nav {
          .el-tabs__item {
            height: 44px;
            line-height: 44px;
            padding: 0 20px;
          }
          .is-active {
            border-radius: 0;
            border-top: 0;
            background: rgba(32, 160, 255, 1);
            color: #FFF;
          }
          .is-active:first-child {
            border-left: 0;
          }
        }
        .el-tabs__nav-wrap {
          top: -1px;
          margin-bottom: -2px;
        }
        .el-tabs__content {
          position: inherit;
        }
      }
      .breadcrumb-container {
        margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
      .content-container {
        // position: absolute;
        // top: 45px;
        // left: 0px;
        // right: 0;
        // bottom: 0;
        background: #fff;
        padding: 20px;
        overflow-y: auto;
      }
    }
  }
  .el-dialog__wrapper {
    overflow: hidden;
  }
  .el-dialog--full {
    width: 1100px;
    overflow: hidden;
    .el-dialog__header {
      padding: 0 20px 0;
      background: #FFF;
      line-height: 49px;
      border-bottom: 1px solid #d1dbe5;
    }
    .el-dialog__body {
      padding: 0 20px;
      color: #48576a;
      font-size: 14px;
      overflow: auto;
      position: absolute;
      bottom: 67px;
      top: 50px;
      left: 0;
      right: 0; // z-index: -1;
    }
    .el-dialog__footer {
      // padding: 15px 50px;
      text-align: right;
      box-sizing: border-box;
      background: #FFF;
      position: absolute;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #d1dbe5;
    }
  }
  .el-dialog--mini {
    width: 450px;
  }
}

.el-popover {
  padding: 0;
  >a {
    display: block;
    padding: 10px 0;
    text-indent: 10px;
    &:hover {
      background: #d1dbe5;
    }
  }
}



















































/* 自定义重写element table样式 */

.el-table tr {
  height: 50px;
}

.el-button--text,
.el-button--text:focus,
.el-button--text:hover {
  color: #20A0FF;
}

.el-table__body-wrapper,
.el-table__header-wrapper {
  font-size: 13px;
  text-align: center;
}

.el-table__header-wrapper thead div {
  color: #1f2d3d;
  background-color: #E5E9F2;
}

.el-table th {
  text-align: center;
  font-weight: normal;
  height: 50px;
  background-color: #E5E9F2;
}

.el-table th>.cell.highlight {
  color: #000;
}






























































/* 自定义重写element pager样式 */

.el-pager li.active {
  border-color: #20A0FF;
  background-color: #20A0FF;
}

.el-pagination {
  margin-top: 20px;
  float: right;
}

.collapse-bar {
  width: 100%;
  display: block;
  height: 30px;
  line-height: 30px;
  color: #aeb9c2;
  cursor: pointer;
  background: rgba(26, 43, 64, .5);
}

.collapse-bar:hover {
  color: #FFF;
}

.glyph-icon {
  font-family: "iconfont"!important;
  margin-right: 10px;
  opacity: 1;
  font-size: 15px;
  display: block;
  float: left;
  text-align: center;
  font-weight: 400!important;
  color: #FFF;
}

.glyph-icon:before {
  font-style: normal;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  background: 0;
  display: inline-block;
}

.icon-zonglan:before {
  content: "\e611";
}

.icon-guanli:before {
  content: "\e600";
}

.icon-xueyuan:before {
  content: "\e111";
}

.icon-jiaolian:before {
  content: "\e62d";
}

.icon-cheliang:before {
  content: "\e667";
}

.icon-xitongshezhi:before {
  content: "\e78a";
}

.icon-yonghuguanli:before {
  content: "\e607";
}

.icon-fenxiaoguanli:before {
  content: "\e6ec";
}

.icon-neibuguanli:before {
  content: "\e600";
}

.icon-danweishezhi:before {
  content: "\e6a0";
}

.icon-caiwushezhi:before {
  content: "\e601";
}

.icon-jiageshezhi:before {
  content: "\e628";
}

.icon-caiwuzhidan:before {
  content: "\e618";
}

.icon-caiwushenhe:before {
  content: "\e62b";
}

.icon-zhedie:before {
  content: "\e614";
}

.icon-dakai:before {
  content: "\e6bc";
  font-size: 13px;
}

.icon-kaoshi:before {
  content: "\e691"
}

.icon-yuyueguanli:before {
  content: "\e684"
}

.icon-yuyueqiang:before {
  content: "\e673"
}

.icon-moshiguanli:before {
  content: "\e608"
}

.icon-canshushezhi:before {
  content: "\e6b4"
}

.icon-yuyuejilu:before {
  content: "\e72e"
}

.icon-jiaolianbaoban:before {
  content: "\e655"
}

.icon-baobanshenhe:before {
  content: "\e691"
}

.icon-zaixianzhifudingdan:before {
  content: "\e616"
}

.icon-xianxiachongzhijilu:before {
  content: "\e64a"
}

.icon-chongzhi:before {
  content: "\e656"
}

.icon-jishipeixun:before {
  content: "\e60b"
}

.icon-changdiguanli:before {
  content: "\e686"
}

.icon-dongtaijiankong:before {
  content: "\e613"
}

.icon-xueshishenhe:before {
  content: "\e603"
}

.icon-jieduanjilushenhe:before {
  content: "\e677"
}

.icon-xiaoxizhongxin:before {
  content: "\e61f"
}

.icon-xiaoxi:before {
  content: "\e60c"
}

.icon-baojing:before {
  content: "\e636"
}

.icon-gonggao:before {
  content: "\e61e"
}

.icon-empty:before {
  content: "\e6fc";
}

.icon-close:before {
  content: "\e629";
}

.icon-paizhao:before {
  content: "\e74b";
}

.icon-shipin:before {
  content: "\e61d";
}

.icon-baobiao:before {
  content: "\e60a";
}

.icon-yewu-baobiao:before {
  content: "\e66b";
}

.icon-zengzhi-fuwu:before {
  content: "\e7b6";
}

.icon-fuwu-zonglan:before {
  content: "\e6e4";
}

.icon-fuwu-guanli:before {
  content: "\e622";
}

.icon-lilun-jiaoxue:before {
  content: "\e612";
}

.icon-lilun-jiaoshi:before {
  content: "\e637";
}

.icon-lilun-shebei:before {
  content: "\e62c";
}

.icon-shexiangtou:before {
  content: "\e62a";
}

.icon-zidingyi:before {
  content: "\e621";
}

.icon-kefu:before {
  content: "\e602";
}

.icon-kaochangguanli:before {
  content: "\e686";
}

.icon-weixin:before {
  content: "\e66f";
}

.icon-baoxian:before {
  content: "\e627";
}

.icon-shouyin:before {
  content: "\e619";
}

.icon-dingzhihua:before {
  content: "\e621";
}

.icon-ie-broswer:before {
  content: "\e7f5";
}

.icon-sougou-broswer:before {
  content: "\e61c";
}

.icon-360-broswer:before {
  content: "\e643";
}

.icon-kaoshizhongxin:before {
  content: "\e626";
}

.icon-chengjichaxun:before {
  content: "\e68a";
}

.icon-qingjiashenhe:before {
  content: "\e648";
}

.icon-jieduan-baobiao:before {
  content: "\e623";
}

.icon-xianluguanli:before {
  content: "\e634";
}

.icon-xianluliebiao:before {
  content: "\e689";
}

.icon-yuyuechaxun:before {
  content: "\e625";
}

.icon-kaoshichaxun:before {
  content: "\e631";
}

.icon-genzong:before {
  content: "\e61a";
}

.icon-dingwei:before {
  content: "\e6d9";
}

.icon-cheguanzhuangtai:before {
  content: "\e63a";
}
</style>

<style lang="scss">
.classRecordDetails {
  font-size: .95em;
  .info {
    padding: 0 10px;
    display: flex;
    .left-img {
      margin-right: 20px;
      img {
        border: 1px solid #eee;
        width: 88px;
        height: 112px;
      }
    }
    .right-content {
      p {
        margin-bottom: 5px;
      }
    }
  }
  .el-row {
    &>p {
      line-height: 32px;
      padding: 0 10px;
    }
    &.part {
      padding: 0 10px;
      div {
        &>p {
          text-indent: 5px;
          margin-bottom: 10px;
        }
        margin-bottom: 5px;
      }
    }
    &.bottom-speed {
      display: flex;
      flex-direction: row;
      text-align: center;
      border: 1px solid #eee;
      >div {
        &:not(:last-child) {
          border-right: 1px solid #eee;
        }
        padding-top:10px;
        width: 33.3%;
        >p:not(:first-child) {
          line-height: 30px;
        }
      }
    }
  }
}

.search-input {
  width: 280px;
}

.el-input-group__prepend .el-select {
  width: 90px;
}

.cs .el-col .el-select {
  width: 192px;
}

.cs .el-form-item__content {
  width: 770px;
}

.normal .el-select,
.normal .el-cascader {
  width: 192px;
}

.addr .el-form-item__content {
  width: 776px;
}

p.group-title {
  line-height: 60px;
  font-weight: bolder;
  font-size: 17px;
}

.selCoach {
  .el-checkbox {
    margin-bottom: 10px;
    margin-left: 0;
    margin-right: 20px;
    min-width: 100px;
  }
  .el-tag {
    margin-right: 10px;
  }
}
</style>

<style scope lang="scss">
.el-dialog__body {
  padding: 0 20px;
  .el-dialog__header {
    padding: 20px 20px 20px;
  }
}

.photograph .el-dialog--tiny {
  width: 500px;
}

.photograph .el-dialog--small {
  width: 900px;
}

.detailForm {
  img.photo {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    position: absolute;
    top: 17px;
    cursor: pointer;
  }
  span.name {
    position: absolute;
    top: 27px;
    left: 50px;
  }
}

.details-header {
  width: 98.4%;
  background-color: rgb(255, 255, 255);
  position: absolute;
  z-index: 99;
  right: 0;
  left: 0;
  padding: 12px 0 12px 12px;
  box-shadow: 0 0 20px rgba(4, 0, 0, 0.2);
}

.swiper-wrapper .img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  display: block;
  margin: 5px auto;
}

.basic,
.electronic-teaching-log,
.time-tracking,
.stage-training-record,
.training-teaching-log,
.graduation-management {
  margin-top: 45px;
  padding: 20px;
  .el-row {
    border-bottom: 1px dotted #dedede;
    padding: 15px 0;
    &:last-child {
      margin-bottom: 0;
      border-bottom: 0;
    }
    .box-card {
      margin: 10px;
      border-top: 5px solid #20A0FF;
      p {
        line-height: 30px;
        span {
          display: inline-block;
          width: 48%;
        }
      }
      .el-card__body {
        padding: 20px;
        max-height: 115px;
      }
    }
    .authority {
      ul li {
        line-height: 30px;
        margin-left: 20px;
        list-style-type: disc;
      }
    }
    p.title {
      line-height: 40px;
    }
    h1.title {
      line-height: 80px;
      font-size: 1.7em;
      text-align: center;
    }
    .base-info,
    .info-intr {
      min-height: 30px;
      margin: 10px 0;
      line-height: 30px;
      .el-col {
        border: 1px solid #dedede;
        text-indent: 5px;
      }
    }
    .info-intr {
      min-height: 120px;
      .el-col {
        padding: 30px 20px;
      }
    }
  }
  .el-table {
    .studyProgress {
      margin: 20px 0;
      p {
        text-align: left;
        line-height: 30px;
        font-size: 12px;
        .el-progress-bar__innerText {
          margin: 0;
          text-indent: 2px;
        }
      }
    }
    i:not(.el-icon) {
      font-size: 30px;
      line-height: normal;
    }
    .el-icon-circle-check {
      color: #13CE66;
    }
    .el-icon-circle-cross {
      color: #FF4949;
    }
  }
  p.prompt {
    color: #262d38;
    line-height: 35px;
    font-size: 1.2em;
    font-weight: bolder;
  }
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
  }
  .table tbody tr:nth-child(odd) {
    background: #fff;
  }
  .table tbody tr {
    border: 0;
    padding: 15px;
  }
  .table.table-bordered th,
  .table.table-bordered td {
    border: 1px solid #dedede;
  }
  .table tbody tr:nth-child(even) {
    background: #f9fbfd;
  }
  .table tbody .empty-tr td {
    background: #f4f6f8;
    padding: 5px;
  }
  table td {
    padding: 10px;
  }
  td,
  th {
    padding: 15px 10px;
  }
  .table tbody td.tb-title {
    font-size: 18px;
    background: #fff;
  }
  .table tbody tr.td-textarea {
    height: 100px;
  }
}

.chapter-form {
  width: 240px;
  height: 240px;
}

.el-icon-search {
  color: #FFF;
  background: #20a0ff;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.el-input__icon.is-clickable:hover {
  color: #FFF;
}

.dot {
  width: 8px;
  height: 8px;
  background: #F12424;
  border-radius: 100%;
  display: inline-block;
  margin-right: 2px;
}
</style>