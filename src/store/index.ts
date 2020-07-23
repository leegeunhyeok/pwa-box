import Vue from 'vue';
import Vuex from 'vuex';
import { RouteDirection } from '@/enums';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routeEffectDirection: RouteDirection.INIT,
  },
  getters: {
    routeEffectDirection: state => state.routeEffectDirection,
  },
  mutations: {
    SET_ROUTE_EFFECT_TO_LEFT(state) {
      state.routeEffectDirection = RouteDirection.TO_LEFT;
    },
    SET_ROUTE_EFFECT_TO_RIGHT(state) {
      state.routeEffectDirection = RouteDirection.TO_RIGHT;
    },
  },
  actions: {},
  modules: {},
});
