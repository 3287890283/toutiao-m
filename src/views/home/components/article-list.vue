<template>
  <div class="article-list">
    <van-pull-refresh v-model="isLoading" :success-text="refreshSuccessText" success-duration="1500" @refresh="onRefresh">
      <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- <van-cell v-for="item in list" :key="item.art_id" :title="item.title" /> -->
        <ArticleItem v-for="item in list" :key="item.art_id" :article="item"></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null, // 请求获取下一页时间戳
      error: false,
      isLoading: false, // 用于下拉刷新,
      refreshSuccessText: '刷新成功'
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now()
        })
        // 没有数据了
        if (data.data.results.length === 0) {
          this.finished = true
          return
        }
        this.list = [...this.list, ...data.data.results]
        this.loading = false
        this.timestamp = data.data.pre_timestamp
      } catch (error) {
        this.error = true
        this.loading = false
      }
    },

    async onRefresh() {
      try {
        // 请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now()
        })
        // 将数据追加到列表顶部
        const { results } = data.data
        this.list = [...results, ...this.list]
        // 关闭loading状态
        this.isLoading = false

        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.refreshSuccessText = '刷新失败'
        this.isLoading = false
      }
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow: auto;
}
</style>
