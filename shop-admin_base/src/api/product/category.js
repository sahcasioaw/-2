import request from '@/utils/request'
// 获取一级分类列表


export function getCategory1List() {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'get'
  })
}

// 获取二级分类列表
export function getCategory2List(category1Id) {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  })
}

// 获取三级分类列表
export function getCategory3List(category2Id) {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  })
}