<!-- 关注和已关注按钮的展示 -->
<template>
  <van-button v-if="value" class="follow-btn" round size="small" :loading="loading" @click="onFollow">已关注</van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" :loading="loading" @click="onFollow">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',

  // // 自定义v-model的数据名称
  // model: {
  //   prop: 'isFollowed',  // 默认为value
  //   event: 'update-is_followed' // 默认为input
  // },

  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },

  mounted() {},

  methods: {
    async onFollow() {
      // 展示关注按钮的loading状态
      this.loading = true
      try {
        if (this.value) {
          // 已关注，就要取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，就要添加关注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('update-is_followed', !this.isFollowed)
        this.$emit('input', !this.value)
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
