<template>
  <div>
    <div ref="vantaRef" style="width:100%;height:100vh">
      <div class="login-container">
        <div class="form">
          <h1>LOGIN</h1>
          <el-card shadow="never" class="login-card">
            <!--登录表单-->
            <el-form ref="form" :model="loginForm" :rules="loginRules">
              <el-form-item prop="mobile">
                <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
              </el-form-item>
              <el-form-item prop="isAgree">
                <el-checkbox v-model="loginForm.isAgree" style="color:black">
                  User Platform Service Agreement
                </el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button class="login-button" type="primary" @click="login">Sign in</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import Net from 'vanta/src/vanta.net'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : '',
        isAgree: process.env.NODE_ENV === 'development'
      },
      loginRules: {
        mobile: [{
          required: true,
          message: 'Please enter your mobile phone number',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: 'The format of the mobile phone number is incorrect',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please enter your password',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: 'The password should be between 6-16 digits long',
          trigger: 'blur'
        }],
        // required只能检测 null undefined ""
        isAgree: [{
          validator: (rule, value, callback) => {
            // rule校验规则
            // value 校验的值
            // callback 函数 - promise resolve reject
            // callback() callback(new Error(错误信息))
            value ? callback() : callback(new Error('You must agree to the User Platform Usage Agreement'))
          }
        }]
      }
    }
  },
  mounted() {
    this.vantaEffect = Net({
      el: this.$refs.vantaRef,
      THREE: THREE
    })

    // eslint-disable-next-line no-undef
    VANTA.NET({
      el: this.$refs.vantaRef,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3fffef,
      backgroundColor: 0x63990
    })
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          await this.$store.dispatch('user/login', this.loginForm)
          // Vuex 中的action 返回的promise
          // 跳转主页
          this.$router.push('/')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.my_title{
  z-index: 999;
  position: fixed;
  top: 40%;
  left: 10%;
  color: aquamarine;
  font-size: 100px;
  font-weight: bolder;
}
.login-container {
  display: flex;
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中
  height: 100vh;
}
.login-card {
  margin: 0;
  padding: 0;
  border-color: rgba(255, 255, 255, 0);
  background-color: rgba(255, 255, 255, 0);
}
.form {
  width: 400px;
  padding: 20px;
  margin: 0;
  background: rgba(255, 255, 255, 0); // 半透明背景
}
h1 {
  text-align: center;
  font-size: 35px;
  margin-bottom: 20px;
  color: white;
}
.el-input {
  width: 100%;
  height: 44px;
  border-color: rgba(255, 255, 255, 0);
  border-radius: 8px;
  .el-input__inner {
    background: rgba(0, 0, 0, 0.25);
    border-color: rgba(255, 255, 255, 0);
    color: white;
  }
}
.el-checkbox {
  color: rgba(0, 0, 0, 0.144);
}
.el-button {
  width: 100%;
}
.login-button {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.25); // 设置按钮的背景颜色
  border: none;
  color: rgb(255, 255, 255);
  font-size: 16px;
  padding: 12px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
