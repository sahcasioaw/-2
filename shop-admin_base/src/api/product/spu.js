import request from '@/utils/request'

// 获取Spu列表
export function getSpuList({ page, limit, category3Id }) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: {
      // 携带就是query参数
      category3Id
    }
  })
}


export function getBaseSaleAttrList() {
    return request({
      url: `/admin/product/baseSaleAttrList`,
      method: 'get'
    })
  }

  export function getAllTrademarkList() {
    return request({
      url: `/admin/product/baseTrademark/getTrademarkList`,
      method: 'get'
    })
  }

  export function saveSpu(data) {
    return request({
      url: `/admin/product/saveSpuInfo`,
      method: 'post',
      data
    })
  }