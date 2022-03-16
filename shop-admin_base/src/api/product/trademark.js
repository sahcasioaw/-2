import request from '@/utils/request'

export function getTrademarkList(page,limit){
        return request({
         url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'

        })
}


export function addTrademark(tmName, logoUrl) {
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: 'post',
      data: {
        tmName,
        logoUrl
      }
    })
  }


  export function delTrademark(id) {
    return request({
      url: `/admin/product/baseTrademark/remove/${id}`,
      method: 'delete'
    })
  }

export function updateTrademark(data) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: 'put',
      data
    })
  }