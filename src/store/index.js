import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    adminSidebarOpen: true
  },
  mutations: {
    toggleAdminSidebar(state) {
      state.adminSidebarOpen = !state.adminSidebarOpen
    },
    setAdminSidebarOpen(state, value) {
      state.adminSidebarOpen = value
    }
  },
  actions: {
    toggleAdminSidebar({ commit }) {
      commit('toggleAdminSidebar')
    }
  },
  getters: {
    isAdminSidebarOpen: state => state.adminSidebarOpen
  }
})