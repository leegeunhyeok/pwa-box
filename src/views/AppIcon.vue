<template>
  <div class="app-name">
    <div class="app-name__wrap">
      <input placeholder="App Name" spellcheck="false" v-model="name" />
      <Button color="blue" @click="nextHandler" :disabled="!isNameAvailable">Next</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from '@vue/composition-api';
import { useStore } from '@/store';
import { Level } from '@/enums';
import Routeable from '@/mixins/Routeable';
import Button from '@/components/Button.vue';
import Bus from '@/event-bus';

const useAppName = () => {
  const name = ref('');
  const isNameAvailable = computed(() => !!name.value);

  return {
    name,
    isNameAvailable,
  };
};

export default {
  name: 'AppIcon',
  components: {
    Button,
  },
  setup() {
    const { name, isNameAvailable } = useAppName();
    const { toNext } = Routeable();
    const store = useStore();

    const nextHandler = () => {
      if (isNameAvailable) {
        store.commit('data/SET_NAME', name);
        toNext('/');
      } else {
        Bus.$emit('@message', {
          message: 'App name not available.',
          color: Level.ERROR,
        });
      }
    };

    return {
      name,
      isNameAvailable,
      nextHandler,
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/common';

@include theme {
  .app-name {
    @include container;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: t('background');

    &__wrap {
      input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
