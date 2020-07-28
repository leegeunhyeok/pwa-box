import Vue from 'vue';
import Vuex, { Store, StoreOptions } from 'vuex';
import { RouteDirection, StartType, Level } from '@/enums';
import { provide, inject } from '@vue/composition-api';

import DataModule from '@/store/data';

Vue.use(Vuex);

export interface RootState {
  routeEffectDirection: RouteDirection;
  startType: StartType;
  alertLevel: Level;
  alertMessage: string;
}

const store: StoreOptions<RootState> = {
  state: {
    routeEffectDirection: RouteDirection.INIT,
    startType: StartType.QUICK,
    alertLevel: Level.DEBUG,
    alertMessage: '',
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
    START_QUICK(state) {
      state.startType = StartType.QUICK;
    },
    START_MANUAL(state) {
      state.startType = StartType.MANUAL;
    },
    SET_ALERT_MESSAGE(state, { level, message }) {
      state.alertLevel = level || Level.DEBUG;
      state.alertMessage = message;
    },
  },
  actions: {},
  modules: {
    DataModule,
  },
};

export const StoreSymbol = Symbol();
export const provideStore = (store: Store<RootState>) => {
  provide(StoreSymbol, store);
};

export const useStore = () => {
  const store = inject<Store<RootState>>(StoreSymbol);
  if (!store) {
    throw Error('No store provided');
  }
  return store;
};

export default new Vuex.Store(store);
