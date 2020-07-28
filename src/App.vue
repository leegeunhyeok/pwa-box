<template>
  <div id="app">
    <transition :name="direction" mode="in-out">
      <router-view />
    </transition>
    <transition name="alert">
      <Alert :message="alert.message" :color="alert.color" v-show="show" />
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watch, onMounted } from '@vue/composition-api';
import store, { provideStore } from '@/store';
import router, { provideRouter } from '@/router';
import { Level } from '@/enums';
import Alert, { useAlert } from '@/components/Alert.vue';
import Bus from '@/event-bus';

interface MessageEvent {
  message: string;
  color?: Level;
}

export default {
  name: 'App',
  components: {
    Alert,
  },
  setup() {
    provideStore(store);
    provideRouter(router);
    const direction = ref(store.state.routeEffectDirection);
    const { show, updateAlert } = useAlert();
    const alert = reactive({
      message: '',
      color: Level.DEBUG,
    });

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

    Bus.$on('@message', (messageEvent: MessageEvent) => {
      alert.message = messageEvent.message;
      alert.color = messageEvent.color || Level.DEBUG;
      updateAlert();
    });

    return {
      direction,
      alert,
      show,
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
