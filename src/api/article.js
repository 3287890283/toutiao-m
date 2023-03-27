// 文章请求模块

import request from '@/utils/request'

// 请求获取文章列表数据
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

// 获取文章详情
export const getArticleById = (id) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${id}`
  })
}

// 收藏文章
export const addCollect = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

// 取消收藏文章
export const deleteCollect = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

// 对文章点赞
export const addLike = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}
// 取消文章点赞
export const deleteLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/dislikes/${target}`
  })
}
