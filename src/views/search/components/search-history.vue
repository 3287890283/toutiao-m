<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span class="allDelete-btn" @click="$emit('allDelte')">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell v-for="(item, index) in searchHistories" :key="index" :title="item">
      <van-icon name="close" v-if="isDeleteShow" @click="$emit('deleteItem', item)" />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage.js'

export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  methods: {},
  watch: {
    // 做历史记录持久化
    searchHistories: {
      handler(val) {
        setItem('SEARCH_HISTORIES', val)
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="less">
.search-history {
  .allDelete-btn {
    margin-right: 10px;
  }
}
</style>
