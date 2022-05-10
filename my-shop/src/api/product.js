import request from '@/utils/request'
// 商品列表
export const getProductList = params => {
    return request({
      method: 'get',
      url: '/products',
      params
    })
}