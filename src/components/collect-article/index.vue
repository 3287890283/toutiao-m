<template>
  <van-button :icon="value ? 'star' : 'star-o'" :class="{ collected: value }" @click="oncollect" :loading="loading"></van-button>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',

  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
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
    async oncollect() {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，需要收藏
          await addCollect(this.articleId)
        }
        // 自定义事件修改数据不是立即的
        this.$emit('input', !this.value)
        // this.$nextTick(() => {
        //   this.$toast.success(this.value ? '收藏成功' : '取消收藏')
        // })

        setTimeout(() => {
          // 点赞和收藏的提示无法一起设置，一起设置以后提示就会出现混乱，需要clear()
          this.$toast.clear()
          this.$toast.success(this.value ? '收藏成功' : '取消收藏')
        })
      } catch (err) {
        this.$toast.fail('操作失败，请重试！')
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.collected {
  .van-icon {
    color: #ffa500 !important;
  }
}
</style>
