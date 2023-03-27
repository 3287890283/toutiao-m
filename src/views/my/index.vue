<template>
  <div class="my-container">
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" fit="cover" round :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-status">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiaoshoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiaolishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <div>
      <van-cell title="消息通知" center clickable>
        <template #right-icon>
          <van-icon name="arrow" />
        </template>
      </van-cell>
      <van-cell title="小智同学" center clickable>
        <template #right-icon>
          <van-icon name="arrow" />
        </template>
      </van-cell>
      <van-cell v-if="user" title="退出登录" class="lgout-cell" clickable @click="onLogout"></van-cell>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    // 如果用户登录了，则请求加载用户数据信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLogout() {
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认要退出嘛'
        })
        .then(() => {
          // 确认操作：清除登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('cancel')
        })
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        // console.log(data)
      } catch (error) {
        console.log(error)
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('@/assets/banner.png');
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 231px;
      padding: 76px 32px 23px;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          margin-right: 23px;
          height: 132px;
          width: 132px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }

      .right {
        .van-button {
          padding: 0 8px;
        }
      }
    }

    .data-status {
      display: flex;
      height: 130px;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiaoshoucang {
        color: #eb5253;
      }
      .toutiaolishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .lgout-cell {
    margin-top: 20px;
    text-align: center;
    color: #e28c;
  }
}
</style>
