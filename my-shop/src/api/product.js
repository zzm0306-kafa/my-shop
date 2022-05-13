import request from '@/utils/request'
// 商品列表
export const getProductList = params => {
    return request({
      method: 'get',
      url: '/products',
      params
    })
}
// 商品详情页 /product/detail/:productId
export const getProductDeatail = productId => {
  return request({
    method: 'get',
    url: `/product/detail/${productId}`
  })
}
// 获取评价个数/reply/config/:productId
export const getCommentCount = productId => {
  return request({
    method: 'get',
    url:`/reply/config/${productId}`
  })
}
// 根据分类获取评价：/reply/list/:productId
export const getCommentByTag = (productId, params) => {
  return request({
    method: 'get',
    url: `/reply/list/${productId}`,
    params
  })
}