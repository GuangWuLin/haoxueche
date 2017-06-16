<template>
  <section class="login-section" id="particles-js">
    <el-form :model="loginForm" class="section-form">
      <el-row class="form-logo">
        <img src="../../src/assets/images/login.png">
      </el-row>
      <el-row class="form-input">
        <input type="text" placeholder="请输入邮箱或手机号" maxlength="30" v-model="loginForm.userName" class="text-box" ref="account" />
      </el-row>
      <el-row class="form-input">
        <input type="password" placeholder="密码" maxlength="30" v-model="loginForm.password" class="text-box" ref="password" />
      </el-row>
      <el-row>
        <el-button :loading="logining" class="button" @click="PostLogin">登录</el-button>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import { request } from "../api/api";
export default {
  data() {
    return {
      logining: false,
      loginForm: {
        userName: "15900000000",//18981947813 15226636985 15900000000
        password: "12345678"//zl15198275928
      }
    }
  },
  methods: {
    PostLogin() {
      if (this.loginForm.userName === "") {
        this.$refs.account.focus();
        this.$notify.warning({ title: "错误", message: "请输入登录帐号" });
      }
      else if (this.loginForm.password === "") {
        this.$refs.password.focus();
        this.$notify.warning({ title: "错误", message: "请输入登录密码" });
      }
      else {
        this.logining = true;
        var loginParams = { userName: this.loginForm.userName, password: this.loginForm.password };
        request.login(loginParams).then(res => {
          let data = res.data;
          console.log(data);
          //console.log(JSON.stringify(data.object.authCode));
          let { message, success, object } = data;
          if (!success) {
            this.logining = false;
            this.loginForm.password = "";
            this.$notify.error({ title: "错误", message: message });
          } else {
            let para = {
              authCode: object.authCode,
              authorization: object.authorization,
              deptId: object.deptId,
              isFnCheck: object.fnCheck,
              parentSchoolCode: object.parentSchoolCode,
              schoolCode: object.schoolCode,
              schoolName: object.schoolName,
              userId: object.userId,
              userName: object.userName,
              financialChapter: object.financialChapter
            }
            sessionStorage.setItem("user", JSON.stringify(para));
            //this.$store.state.user = object;
            this.$router.replace({ path: "/vehicle" });
          }
        });
      }
    }
  },
  mounted() {
    setTimeout(() => { initParticles(); }, 300);
    // document.addEventListener("keydown", (evt) => {
    //   if (evt.keyCode == 13) {
    //     console.log("登录中...");
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
  background-color: #20364D;
  .section-form {
    position: absolute;
    width: 400px;
    height: 450px;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -220px;
    background: rgba(0, 0, 0, .21);
    border-radius: 15px;
    text-align: center;
    .form-logo {
      margin: 50px auto;
    }
    .form-input {
      margin-bottom: 10px;
    }
    input.text-box {
      width: 80%;
      height: 38px;
      text-indent: 8px;
      background: none;
      color: #fff;
      border-bottom: 1px solid #273A4F;
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
  }
}
</style>