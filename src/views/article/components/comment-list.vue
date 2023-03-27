<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
    <CommentItem v-for="(item, index) in list" :key="index" :comment="item"></CommentItem>
    <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.content" /> -->
  </van-list>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item.vue'

export default {
  name: 'CommentList',

  components: {
    CommentItem
  },

  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      // list: [],
      error: false,
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据
      limit: 10
    }
  },

  created() {
    this.onLoad()
  },

  methods: {
    async onLoad() {
      try {
        // 1 获取数据
        const { data } = await getComment({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset,
          limit: this.limit
        })
        const { results } = data.data
        // console.log(data.data)

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        // 2 判断数据是否为空
        if (results.length === 0) {
          this.finished = true
          return
        }
        // 3 将数据添加到列表中
        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(...results)
        // 4 更新页码，设置loading
        this.offset = data.data.last_id
        this.loading = false
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
