<template>
  <div class="app-name">
    <div class="app-name__wrap">
      <input placeholder="App Name" spellcheck="false" @v-model="name" />
      <Button color="blue" @click="nextHandler" :disabled="!isNameAvailable">Next</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from '@vue/composition-api';
import Routeable from '@/mixins/Routeable';
import Button from '@/components/Button.vue';

const useAppName = () => {
  const name = ref('sample');
  const isNameAvailable = computed(() => !!name.value);
  return {
    name,
    isNameAvailable,
  };
};

export default {
  components: {
    Button,
  },
  setup() {
    const { name, isNameAvailable } = useAppName();
    const { toNext, toPrevious } = Routeable();

    const nextHandler = () => {
      if (isNameAvailable) {
        // TODO
      }
      toPrevious('/');
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
