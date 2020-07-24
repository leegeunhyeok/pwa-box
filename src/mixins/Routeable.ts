import Vue from 'vue';
import { useStore } from '@/store';
import { useRouter } from '@/router';

interface RoutableFunctions {
  toNext: Function;
  toPrevious: Function;
}

export default (): RoutableFunctions => {
  const store = useStore();
  const router = useRouter();

  const toNext = (path: string) => {
    store.commit('SET_ROUTE_EFFECT_TO_LEFT');
    Vue.nextTick(() => {
      router.push({ path });
    });
  };

  const toPrevious = (path: string) => {
    store.commit('SET_ROUTE_EFFECT_TO_RIGHT');
    Vue.nextTick(() => {
      router.push({ path });
    });
  };

  return {
    toNext,
    toPrevious,
  };
};
