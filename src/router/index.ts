import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { provide, inject } from '@vue/composition-api';

import Home from '@/views/Home.vue';
import AppName from '@/views/AppName.vue';
import AppIcon from '@/views/AppIcon.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/name',
    name: 'AppName',
    component: AppName,
  },
  {
    path: '/icon',
    name: 'AppIcon',
    component: AppIcon,
  },
];

export const RouterSymbol = Symbol();
export const provideRouter = (routes: VueRouter) => {
  provide(RouterSymbol, routes);
};

export const useRouter = () => {
  const router = inject<VueRouter>(RouterSymbol);
  if (!router) {
    throw Error('No router provided');
  }
  return router;
};

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
