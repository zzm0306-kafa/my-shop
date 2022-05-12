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