<template>
  <div class="login">
    <div class="container">
      <img src="@/assets/avatar.jpg" alt="" class="avatar" />
      <!-- 用户名 -->
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入11位电话号码"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-key"
            placeholder="请输入4-10位密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="login-btn" @click="login"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/apis/user.js";
export default {
  data() {
    return {
      loginForm: {
        username: "15338072403",
        password: "st145502",
      },
      rules: {
        username: [
          { required: true, message: "请输入11位手机号", trigger: "blur" },
          {
            pattern: /^1[35789]\d{9}$/,
            message: "请输入11位有效数字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入4-10位密码", trigger: "blur" },
          {
            pattern: /^.{4,10}$/,
            message: "密码为4-10位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      // 登陆失败则不发送请求
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          let res = await userLogin(this.loginForm);
          if (res.data.message == "登录成功") {
            localStorage.setItem("userManager", res.data.data.token);
            this.$message.success(res.data.message);
            this.$router.push({ name: "index" });
          } else {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.warning("输入的不合法");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>