const state = {
    attr: {}
  }
  
  // 用来发送请求的异步函数
  const actions = {}
  
  // 用来直接更新的函数
  const mutations = {
    SET_ATTR(state, attr) {
      state.attr = attr
      console.log( state.attr);
    }
  }
  
  export default {
    namespaced: true, // 开启命名空间
    state,
    mutations,
    actions
  }