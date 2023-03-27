<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="加载失败，请点击重试" @load="onLoad">
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'

export default {
  name: 'SearchResult',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perpage: 20 // 每次请求数据的条数
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perpage,
          q: this.searchText
        })
        const { results } = data.data
        if (!results) {
          // 没有数据
          this.finished = true
          return
        }
        this.list.push(...results)
        this.loading = false
        this.page++
      } catch (error) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
