
export default {
  namespaced: true,
  state: () => ({
    uploadImg: [], // 上传的图片
    workList: [], // 处理过的图片
    history: [], //下载过的历史记录
  }),
  mutations: {
    addUploadImg(state, payload) {
      state.uploadImg.push(payload)
    }
  },
  actions: {
    // 添加上传的图片
    addUploadImg({commit}, payload) {
      commit('addUploadImg', payload)
    }
  }
}