<template>
  <van-button :icon="value === 1 ? 'good-job' : 'good-job-o'" :class="{ liked: value === 1 }" @click="onLike" :loading="loading"></van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, Object, String],
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
    onLike() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 点赞，需要取消点赞
          deleteLike(this.articleId)
        } else {
          // 没有点赞，需要点赞
          addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.clear()
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')

        // setTimeout(() => {
        //   this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
        // })
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败，请重试!')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f !important;
  }
}
</style>
