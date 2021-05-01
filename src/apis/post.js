import axios from '@/utils/request.js'

// 1、获取文章列表
export const getPostList = (params) => {
  return axios({
    url: "/post",
    params
  })
}

// 2.发布文章
export const publishThisPost = (data) => {
  return axios({
    url: "/post",
    method: 'post',
    data
  })
}