<template>
  <div class="login-container">
    <el-form v-if="isLogin" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">自然语言处理线上平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登&nbsp;&nbsp;录</el-button>

      <div style="position:relative">
        <div class="tips">
          <span style="margin-left:36px;margin-right:36px;" @click="changeLogin">没有账号？</span>
          <span>找回密码</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;" />
          <span />
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          社交账号登录
        </el-button>
      </div>
    </el-form>

    <el-form v-else ref="RegisterFormRef" :model="RegisterForm" :rules="RegisterFormRules" label-width="80px" class="Register_form">
      <!--                用户名-->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="RegisterForm.username" prefix-icon="el-icon-user-solid" />
      </el-form-item>
      <!--                密码-->
      <el-form-item label="密码" prop="password">
        <el-input v-model="RegisterForm.password" prefix-icon="el-icon-lock" type="password" />
      </el-form-item>
      <!--                二次确认密码-->
      <el-form-item label="确认密码" prop="doubleCheck">
        <el-input v-model="RegisterForm.doubleCheck" prefix-icon="el-icon-lock" type="password" />
      </el-form-item>
      <!--                姓名-->
      <el-form-item label="姓名" prop="name">
        <el-input v-model="RegisterForm.name" prefix-icon="el-icon-user-solid" />
      </el-form-item>

      <!--      头像-->
      <span>上传头像</span>
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="RegisterForm.avatar" :src="RegisterForm.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <!--      <el-form-item label="头像" prop="avatar">-->
      <!--        <el-input v-model="RegisterForm.avatar" prefix-icon="el-icon-user-solid" />-->
      <!--      </el-form-item>-->
      <!--      个人介绍-->
      <el-form-item label="个人介绍" prop="introduction">
        <el-input v-model="RegisterForm.introduction" type="textarea" />
      </el-form-item>

      <div>
        <button @click="changeLogin">已有账号</button>
        <button @click="registerNum">注册</button>
      </div>

    </el-form>

    <el-dialog title="社交帐号登录" :visible.sync="showDialog">
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('用户名长度不小于4位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不小于6位'))
      } else {
        callback()
      }
    }
    // 二次验证的方法
    // eslint-disable-next-line no-unused-vars
    const validateCheck = (rule, value, callback) => {
      if (value !== this.RegisterForm.password) {
        callback(new Error('密码校验错误'))
      } else {
        callback()
      }
    }
    return {
      isLogin: true,
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      RegisterForm: {
        username: '',
        password: '',
        doubleCheck: '',
        name: '',
        avatar: '',
        introduction: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      RegisterFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 5, message: '长度在 4 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 5, message: '长度在 4 到 5 个字符', trigger: 'blur' }
        ],
        doubleCheck: [
          { required: true, trigger: 'blur', validator: validateCheck }
        ],
        name: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 4, max: 5, message: '长度在 4 到 5 个字符', trigger: 'blur' }
        ],
        avatar: [
          { required: false, message: '请上传头像', trigger: 'blur' }
        ],
        introduction: [
          { required: false, message: '介绍一下', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 头像区域的函数
    handleAvatarSuccess(res, file) {
      this.RegisterForm.avatar = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 注册函数
    registerNum() {
      this.$refs.RegisterFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/registerNum', this.RegisterForm)
            .then(() => {
              alert('注册成功')
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.isLogin = !this.isLogin
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeLogin() {
      this.isLogin = !this.isLogin
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
     position: relative;
     width: 520px;
     max-width: 100%;
     padding: 160px 35px 0;
     margin: 0 auto;
     overflow: hidden;
   }

  .Register_form {
    position: relative;
    width: 520px;
    /*max-width: 100%;*/
    padding: 130px 35px 0;
    margin: 0 auto;
    /*overflow: hidden;*/
    .el-input {
      padding-left: 12px;
    }
    /*头像区域*/
    .avatar-uploader .el-upload {
      border: 3px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 15px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
