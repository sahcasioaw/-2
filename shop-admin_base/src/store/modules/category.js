import {
    getCategory1List,
    getCategory2List,
    getCategory3List
  } from '@/api/product/category'
  
  // 多个组件共享的状态数据
  const state = {
    category1Id: '',
    category2Id: '',
    category3Id: '',
    category1List: [],
    category2List: [],
    category3List: []
  }
  
  // 用来发送请求的异步函数
  const actions = {
    async getCategory1List({ commit }) {
      const res = await getCategory1List()
      commit('GET_CATEGORY1_LIST', res.data)
    },
    async getCategory2List({ commit }, category1Id) {
      const res = await getCategory2List(category1Id)
      commit('GET_CATEGORY2_LIST', {
        category2List: res.data,
        category1Id
      })
    },
    async getCategory3List({ commit }, category2Id) {
      const res = await getCategory3List(category2Id)
      commit('GET_CATEGORY3_LIST', {
        category3List: res.data,
        category2Id
      })
    }
  }
  
  // 用来直接更新的函数
  const mutations = {
    GET_CATEGORY1_LIST(state, category1List) {
      state.category1List = category1List
    },
    GET_CATEGORY2_LIST(state, { category2List, category1Id }) {
      state.category2List = category2List
      state.category1Id = category1Id
      // 第二次重新选中一级分类时，要清空后面的数据
      state.category2Id = ''
      state.category3Id = ''
      state.category3List = []
    },
    GET_CATEGORY3_LIST(state, { category3List, category2Id }) {
      state.category3List = category3List
      state.category2Id = category2Id
  
      // 第二次重新选中二级分类时，要清空后面的数据
      state.category3Id = ''
    },
    SET_CATEGORY3_ID(state, category3Id) {
      state.category3Id = category3Id
    },
    RESET(state) {
      state.category1Id = ''
      state.category2Id = ''
      state.category3Id = ''
      state.category1List = []
      state.category2List = []
      state.category3List = []
    }
  }
  
  export default {
    namespaced: true, // 开启命名空间
    state,
    mutations,
    actions
  }