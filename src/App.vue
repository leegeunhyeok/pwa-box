<template>
  <div id="app">
    <transition :name="direction" mode="in-out">
      <router-view />
    </transition>
    <Alert :message="message" :color="color" />
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from '@vue/composition-api';
import store, { provideStore } from '@/store';
import router, { provideRouter } from '@/router';
import Alert from '@/components/Alert.vue';

export default {
  components: {
    Alert,
  },
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
      message: computed(() => store.state.alertMessage),
      color: computed(() => store.state.alertLevel),
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
  transition: transform 0.8s ease;
}
.route-left-enter {
  transform: translateX(100%);
}
.route-left-leave-active {
  display: none !important;
}

.route-right-enter-active {
  z-index: get-elevation('medium');
  transition: transform 0.8s ease;
}
.route-right-enter {
  transform: translateX(-100%);
}
.route-right-leave-active {
  display: none !important;
}
</style>
