<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" @focus="isResultShow = false" background="#3296fa" />
    </form>
    <!-- 搜索栏 -->

    <!-- 搜索结果 -->
    <searchResult v-if="isResultShow" :search-text="searchText"></searchResult>
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <searchSuggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"></searchSuggestion>
    <!-- 联想建议 -->

    <!-- 搜索历史记录 -->
    <searchHistory v-else :search-histories="searchHistories" @allDelte="searchHistories = []" @deleteItem="deleteFn"></searchHistory>
    <!-- 搜索历史记录 -->
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import searchResult from './components/search-result.vue'
import searchSuggestion from './components/search-suggestion.vue'
import { getItem } from '@/utils/storage'

export default {
  name: 'SearchPage',
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示
      searchHistories: getItem('SEARCH_HISTORIES') || []
    }
  },
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val

      // 储存搜索历史结果
      // 不要有重复历史记录；最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // this.searchHistories.push(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    },
    deleteFn(item) {
      const index = this.searchHistories.indexOf(item)
      this.searchHistories.splice(index, 1)
    }
  },
  components: {
    searchHistory,
    searchResult,
    searchSuggestion
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    right: 0;
  }
}
</style>
