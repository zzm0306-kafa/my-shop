import request from '@/utils/request'
// 首页数据初始化
export const getIndexList = () => {
  return request({
    method: 'GET',
    url: '/v2/diy/get_diy/moren'
  })
}