<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <van-icon name="arrow-left" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- 模板中的$event是事件参数
          当我们传递给子组件的数据既要使用还要修改
          （传递：props :is-followed="article.is_followed"
          修改：自定义事件 @update-is_followed="article.is_followed = $event"），
          简写方式： 在组件上使用 v-model，就相当于下面两行代码
          :value="article.is_followed"
          @input="article.is_followed=$event"
          如果需要修改v-model规则名称，可以通过子组件的model属性来配置修改

          但是一个组件只能使用一次v-model，如果有多个数据需要实现类似于 v-model 的效果，可以使用属性的 .sync的修饰符
          -->
          <FollowUser :user-id="article.aut_id" class="follow-btn" v-model="article.is_followed"></FollowUser>
          <!-- <van-button v-if="article.is_followed" class="follow-btn" round size="small" :loading="followLoading" @click="onFollow">已关注</van-button>
          <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" :loading="followLoading" @click="onFollow">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="articleContent"></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论列表 -->
        <CommentList :source="article.art_id" :list="commentList" @onload-success="totalCommentCount = $event.total_count"></CommentList>

        <!-- 底部区域，推荐放到这里，需要等到数据全部加载完毕，再渲染底部区域视图 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <van-icon name="comment-o" :info="totalCommentCount" />
          <CollectArticle class="btn-item" v-model="article.is_collected" :article-id="article.art_id"></CollectArticle>
          <!-- <van-icon color="#777" name="star-o" /> -->
          <LikeArticle class="btn-item" v-model="article.attitude" :article-id="article.art_id"></LikeArticle>
          <!-- <van-button icon="good-job-o" class="btn-item" /> -->
          <van-icon name="share"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost :target="article.art_id" @post-success="onPostSuccess"></CommentPost>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      // 文章详情
      article: {},
      loading: true, // 加载中的loading状态
      errStatus: 0, // 失败的状态码
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [] // 评论列表
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // 测试加载失败：未知错误
        if (Math.random() > 0.9) {
          JSON.parse('ddkjflskjfkljdslkjflk')
        }

        this.article = data.data

        // 需要等到DOM重新渲染后，在执行回调函数（没有用）
        // this.$nextTick(() => {
        //   console.log(this.$refs.articleContent)
        // })

        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取数据失败', error)
      }
      // 关闭loading
      this.loading = false
    },
    previewImage() {
      // 得到所有的img节点
      const articleContent = this.$refs.articleContent
      const imgs = articleContent.querySelectorAll('img')

      // 获取所有的img地址
      const imgUrls = []
      imgs.forEach((img, index) => {
        imgUrls.push(img.src)

        // 给每一个img注册点击事件，在处理函数中调用图片预览
        img.onclick = () => {
          ImagePreview({
            images: imgUrls,
            startPosition: index
          })
        }
      })
      // console.log(imgUrls)
    },
    onPostSuccess(data) {
      // 关闭弹出层
      // 将发布内容显示到列表顶部
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./github-markdown.css');
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .btn-item {
      border: none;
      padding: 0;
    }
    /deep/ .van-icon {
      font-size: 40px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
