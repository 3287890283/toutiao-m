<!-- 文章列表中每个文章题目，图片的展示 -->
<template>
  <!--
    :to="'/article/' + article.art_id"
    :to="`/article/${article.art_id}`"
   -->
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <div slot="label">
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image class="cover-item-img" :src="img" fit="cover"></van-image>
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image v-if="article.cover.type === 1" slot="default" class="right-cover" :src="article.cover.images[0]" fit="cover" />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    flex: unset;
    padding-left: 25px;
    width: 232px;
    height: 146px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap span {
    margin-right: 25px;
    font-size: 22px;
    color: #b4b4b4;
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      //同样作用
      // &:not(last-child) {
      //   padding-right: 4px;
      // }
      padding-right: 4px;
      &:nth-child(3) {
        padding-right: 0;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
