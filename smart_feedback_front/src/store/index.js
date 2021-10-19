import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAdmin: null,
    user_name: null,
    student_id: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.email
      state.isAdmin = payload.isAdmin
      state.user_name = payload.user_name
      state.student_id = payload.student_id
    }
  },
  actions: {
  },
  getters: {
    isAuth(state) {
      return state.user !== null && state.user !== undefined
    },
    isAdmin(state) {
      return state.isAdmin == true
    },
  },
  plugins: [
    createPersistedState()
  ]
})
