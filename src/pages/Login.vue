<template>
  <section class="login-section" id="particles-js">
    <el-form :model="loginForm" class="section-form">
      <el-row class="form-logo">
        <img src="../../src/assets/images/login.png">
      </el-row>
      <el-row class="form-input">
        <el-select v-model="zone" placeholder="请选择服务所属区域" popper-class="login-select" ref="loginSelect" :clearable="true">
          <el-option v-for="item in zones" :label="item.label" :value="item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-row>
      <el-row class="form-input">
        <input type="text" placeholder="请输入手机号" maxlength="11" v-model="loginForm.userName" class="text-box" ref="account" />
      </el-row>
      <el-row class="form-input">
        <input type="password" placeholder="密码" maxlength="30" v-model="loginForm.password" class="text-box" ref="password" />
      </el-row>
      <el-row>
        <el-button :loading="logining" class="button" @click="CheckLogin">登录</el-button>
      </el-row>
      <el-row class="remember">
        <el-col :span="12" class="remember-me">
          <el-checkbox v-model="rememberMe">记住账号</el-checkbox>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </el-form>
    <div id="element"></div>
    <el-dialog title="好学车" v-model="services.visible" size="tiny" custom-class="services-dialog" :close-on-click-modal="false" @close="DialogClose">
      <el-row>
        <el-radio-group v-model="services.select">
          <el-radio v-for="item in services.data" :label="item">{{item.name}}</el-radio>
        </el-radio-group>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="services.visible = false">取 消</el-button>
        <el-button type="primary" @click="PostLogin">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { request } from "../api/api";
import { global } from "../assets/javascript/global";
export default {
  data() {
    return {
      zones: [],//global.options.zone
      zone: "",
      services: {
        data: [],
        select: {},
        visible: false,
      },
      logining: false,
      loginForm: {
        userName: "",
        password: ""
      },
      rememberMe: false
    }
  },
  methods: {
    //获取地理信息
    getZoneInfo() {
      let map, geolocation;
      var interval = setInterval(() => {
        if (window._amapInit) {
          clearInterval(interval);
          map = new AMap.Map("element", {
            resizeEnable: true
          });
          map.plugin("AMap.Geolocation", function () {
            geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000          //超过10秒后停止定位，默认：无穷大
            });
            geolocation.getCityInfo((status, data) => {
              global.printLog(data.city);
              sessionStorage.setItem("locationName", data.city);
            });
          });
        }
      });
    },
    //查询服务所在地
    queryServiceZone() {
      request.regCenter.query.serviceArea().then((res) => {
        if (res.success) {
          this.zones = [];
          let data = res.object;
          for (let item in data) {
            this.zones.push({
              label: data[item].name + "省",
              value: data[item].code
            });
          }
          // global.options.zone.filter((item) => {
          // global.printLog(item);
          // });
        }
      });
    },
    queryServiceList() {
      request.regCenter.query.serviceList([this.zone, this.loginForm.userName]).then((res) => {
        this.logining = false;
        if (res.success) {
          let data = res.object;
          if (!data.length) {
            this.$notify.error({ title: "错误", message: "账号不存在" });
            return;
          }
          if (data.length > 1) {
            this.services.data = data;
            this.services.visible = true;
          }
          else {
            sessionStorage.setItem("baseUrl", data[0].url + "/hxc");
            this.PostLogin();
          }
        }
        else {
          this.$message.error(res.message);
        }
      });
    },
    //登录检测
    CheckLogin() {
      if (this.zone === "") {
        this.$message.warning("请选择服务所属区域");
      }
      else if (this.loginForm.userName === "") {
        this.$refs.account.focus();
        this.$message.warning("请输入登录帐号");
      }
      else if (this.loginForm.password === "") {
        this.$refs.password.focus();
        this.$message.warning("请输入登录密码");
      }
      else {
        this.logining = true;
        this.queryServiceList();
      }
    },
    //登录
    PostLogin() {
      if (this.services.data.length) {
        let data = this.services.select;
        if (JSON.stringify(data) === "{}") {
          this.$notify.info({ title: "提示", message: "请选择登录环境" });
          return;
        }
        else {
          this.services.visible = false;
          sessionStorage.setItem("baseUrl", data.url + "/hxc");
        }
      }
      this.logining = true;
      var loginParams = { userName: this.loginForm.userName, password: this.loginForm.password };
      request.login(loginParams).then(res => {
        let data = res.data;
        global.printLog(JSON.stringify(data.object));
        this.logining = false;
        let { message, success, object } = data;
        if (!success) {
          this.loginForm.password = "";
          this.$notify.error({ title: "错误", message: message });
        }
        else {
          window.localStorage.setItem("zone", this.zone);
          if (this.rememberMe === true) {
            window.localStorage.setItem("hxc_account", this.loginForm.userName);
          }
          else {
            window.localStorage.removeItem("hxc_account");
          }
          let para = {
            name: object.name,
            authCode: object.authCode,
            authorization: object.authorization,
            deptId: object.deptId,
            isFnCheck: object.fnCheck,
            parentSchoolCode: object.parentSchoolCode,
            schoolCode: object.schoolCode,
            schoolName: object.schoolName,
            userId: object.userId,
            userName: object.userName,
            financialChapter: object.financialChapter,
            postalCode: object.postalCode
          }
          sessionStorage.setItem("user", JSON.stringify(para));
          //this.$store.state.user = object;
          this.$router.replace({ path: "/overview" });
        }
      });
    },
    DialogClose() {
      this.logining = false;
      this.services.select = {};
    }
  },
  created() {
    //this.getZoneInfo();
    if (window.localStorage.getItem("hxc_account") !== null) {
      this.rememberMe = true;
      this.loginForm.userName = window.localStorage.getItem("hxc_account");
    }
    if (window.localStorage.getItem("zone") !== null) {
      this.zone = window.localStorage.getItem("zone");
    }
    this.queryServiceZone();
  },
  mounted() {
    setTimeout(() => { initParticles(); }, 300);
    // document.addEventListener("keydown", (evt) => {
    //   if (evt.keyCode == 13) {
    //     this.PostLogin();
    //   }
    // });
  }
}

</script>

<style lang="scss">
.login-section {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  font-family: serif;
  background-color: #20364D;
  .section-form {
    position: absolute;
    width: 400px;
    height: 490px;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -240px;
    background: rgba(0, 0, 0, .21);
    border-radius: 15px;
    text-align: center;
    .form-logo {
      margin: 50px auto;
    }
    .form-input {
      margin-bottom: 10px;
      .el-select {
        width: 80%;
        .el-input__inner {
          border: 0;
          color: #fff;
          border-radius: 0;
          background: transparent;
          border-bottom: 1px solid #273A4F;
        }
      }
    }
    input.text-box {
      width: 80%;
      height: 38px;
      text-indent: 8px;
      background: none;
      color: #fff;
      border-bottom: 1px solid #273A4F;
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #97A8BE;
      }

      &::-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #97A8BE;
      }

      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #97A8BE;
      }

      &::-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #97A8BE;
      }
    }
    .button {
      width: 315px;
      background: #0B9EFF;
      cursor: pointer;
      height: 50px;
      color: #FFF;
      border: 0;
      font-size: 1em;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 1.3em;
    }
    .remember {
      padding: 20px 50px;
      .remember-me {
        text-align: left;
      }
      .el-checkbox__inner {
        background-color: transparent;
        border-radius: 2px;
        border: 1px solid #FFF;
      }
      .el-checkbox__label {
        font-family: serif;
        color: #FFF;
        line-height: 1;
      }
    }
  }
  #element {
    width: 0;
    height: 0;
    opacity: 0;
    display: none;
  }
}

.services-dialog {
  width: 400px;
  .el-row {
    padding: 30px 0 20px 2px;
  }
}
</style>