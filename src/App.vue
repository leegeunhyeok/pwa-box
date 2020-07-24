<template>
  <div id="app">
    <transition :name="direction" mode="in-out">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted } from '@vue/composition-api';
import store, { provideStore } from '@/store';
import router, { provideRouter } from '@/router';

export default {
  setup() {
    provideStore(store);
    provideRouter(router);
    const direction = ref(store.state.routeEffectDirection);

    watch(
      () => store.state.routeEffectDirection,
      value => {
        direction.value = value;
      },
    );

    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      router.push({ path: '/' }).catch(() => {});
    });

    return {
      direction,
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/common';

html,
body {
  @include container;
  padding: 0;
  margin: 0;
}

#app {
  @include container;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Route transition */
.route-left-enter-active {
  z-index: get-elevation('medium');
  transition: transform 1s ease;
}
.route-left-enter {
  transform: translateX(100%);
}
.route-left-leave-active {
  display: none !important;
}

.route-right-enter-active {
  z-index: get-elevation('medium');
  transition: transform 1s ease;
}
.route-right-enter {
  transform: translateX(-100%);
}
.route-right-leave-active {
  display: none !important;
}
</style>
