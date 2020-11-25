  
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    notes: null,
    userID: null
  },
  mutations: {
    LOGIN: (state, { userID }) => {
      Vue.set(state, "userID", userID);

    },
    LOGOUT: state => {
      state.userID = null;
    }
  },
  actions: {
    LOGIN({ commit }, payload) {
      commit("LOGIN", payload);
    },
    LOGOUT({ commit }) {
      commit("LOGOUT");
    }
  },
  modules: {}
});