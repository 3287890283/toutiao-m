<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <template #left>
        <van-icon @click="$router.back()" name="cross" size="18" />
      </template>
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field v-model="user.mobile" name="mobile" placeholder="请输入手机号" :rules="userFormRules.mobile" type="number" maxlength="11" center>
        <!-- 以下两种写法都可以（使用插槽） -->
        <!-- <template #left-icon>
          <i class="toutiao toutiaoshouji"></i>
        </template> -->
        <i slot="left-icon" class="toutiao toutiaoshouji"></i>
      </van-field>
      <van-field v-model="user.code" name="code" placeholder="请输入验证码" :rules="userFormRules.code" type="number" maxlength="6">
        <i slot="left-icon" class="toutiao toutiaoyanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-count-down v-if="isCountDownShow" :time="5 * 1000" format="ss s" @finish="isCountDownShow = false" />
          <van-button v-else class="send-sns-btn" round size="small" type="default" @click="onSendSms" native-type="button">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <!-- 登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginPage',
  data() {
    return {
      user: {
        mobile: '',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            validator: (value) => {
              return /^1[3|5|7|8]\d{9}$/.test(value)
            },
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          {
            validator: (value) => {
              return /^\d{6}$/.test(value)
            },
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit() {
      // 1 获取表单数据
      const user = this.user
      // 2 表单数据验证(在rules中)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0 // 持续时间，持续展示
      })
      // 3 提交表单请求登录
      try {
        const res = await login(user)
        console.log('登陆成功', res)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登陆成功')

        // 调整原来页面,不严谨！！！！
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登陆失败，请稍后重试')
        }
      }
      // 4 根据请求响应结果做相应的处理
    },
    async onSendSms() {
      // 1 验证手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2 验证通过，显示倒计时
      this.isCountDownShow = true

      // 3 发送验证码
      try {
        sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sns-btn {
    width: 180px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
