<template>
  <div class="home">
    <div class="home__wrap">
      <div class="home__logo">
        <img alt="logo" src="../assets/logo.png" />
      </div>
      <div class="home__menu" ref="menu">
        <Button :class="hidden" color="blue" @click="quickStartHandler">Quick Start</Button>
        <Button :class="hidden" @click="manuallyStartHandler">Set Manually</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from '@vue/composition-api';
import { useStore } from '@/store';
import Routeable from '@/mixins/Routeable';
import Button from '@/components/Button.vue';

export default {
  components: {
    Button,
  },
  setup() {
    const store = useStore();
    const menu = ref(null);
    const showButton = ref(false);
    const { toNext, toPrevious } = Routeable();

    const quickStartHandler = () => {
      store.commit('START_QUICK');
      toNext('/name');
    };

    const manuallyStartHandler = () => {
      store.commit('START_MANUAL');
      toPrevious('/choose');
    };

    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (menu!.value! as Element).addEventListener('animationend', () => {
        showButton.value = true;
      });
    });

    return {
      menu,
      hidden: computed(() => (showButton.value ? null : 'hidden')),
      showButton,
      quickStartHandler,
      manuallyStartHandler,
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/common';
@import '@/styles/effects';

@include theme() {
  .home {
    @include container;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: t('background');

    &__wrap {
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
    }

    &__logo {
      width: 60%;
      max-width: auto;
      margin: auto;
      margin-bottom: 1rem;

      @include screen-size(md) {
        width: 100%;
        max-width: 250px;
      }

      img {
        width: 100%;
      }
    }

    &__menu {
      margin: auto;
      width: 160px;
      max-height: 0;
      overflow: hidden;
      -webkit-animation: welcome 1s 1s forwards;
      animation: welcome 1s 1s forwards;

      & button {
        display: block;
        width: 100%;
        margin: 0.5rem 0;

        &.hidden {
          opacity: 0;
        }
      }
    }
  }

  @-webkit-keyframes welcome {
    100% {
      max-height: 100px;
    }
  }

  @keyframes welcome {
    100% {
      max-height: 100px;
    }
  }
}
</style>
