<template>
  <div>
    <el-form ref="RegisterFormRef" :model="RegisterForm" :rules="RegisterFormRules" label-width="80px" class="Register_form">
      <!--                用户名-->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="RegisterForm.username" prefix-icon="el-icon-user-solid" placeholder="用户名" />
      </el-form-item>
      <!--                密码-->
      <el-form-item label="密码" prop="password">
        <el-input v-model="RegisterForm.password" prefix-icon="el-icon-lock" type="password" placeholder="密码" />
      </el-form-item>
      <!--                二次确认密码-->
      <el-form-item label="确认密码" prop="doubleCheck">
        <el-input v-model="RegisterForm.doubleCheck" prefix-icon="el-icon-lock" type="password" placeholder="确认密码" />
      </el-form-item>
      <!--                姓名-->
      <el-form-item label="姓名" prop="name">
        <el-input v-model="RegisterForm.name" prefix-icon="el-icon-user-solid" placeholder="姓名" />
      </el-form-item>

      <div class="regBottom">
        <el-button type="primary" @click="registerChangeLogin">已有账号</el-button>
        <el-button type="primary" @click="registerNum">注册</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
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
      RegisterForm: {
        username: '',
        password: '',
        doubleCheck: '',
        name: ''
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
        ]
      }
    }
  },
  methods: {
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
    // changeLogin() {
    //   this.isLogin = !this.isLogin
    // }
    registerChangeLogin() {
      this.$emit('itemClick')
    }

  }
}
</script>

<style lang="scss" >
  .Register_form {
    position: relative;
    width: 520px;
    background-color: #f0f0f0;
    /*max-width: 100%;*/
    padding: 35px;
    margin: 130px auto 0;
    border-radius: 20px;
    /*overflow: hidden;*/
    .el-input {
      padding-left: 12px;
      /*color: #00ff00;*/
      .el-input__inner{
        color: #222222;
      }
    }
    .regBottom {
      display: flex;
      justify-content: space-around;
    }
  }
  .Register_form .el-form-item__label {
    line-height: 46px !important;
  }
</style>
