import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAdmin: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.email
      state.isAdmin = payload.isAdmin
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
