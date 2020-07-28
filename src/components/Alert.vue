<template>
  <div :class="alertClass">{{ message }}</div>
</template>

<script lang="ts">
import { ref, computed } from '@vue/composition-api';

const KEEP = 3;
const EFFECT = 0.75;

interface AlertProps {
  color?: string;
  message?: string;
}

export const useAlert = () => {
  const show = ref(false);
  let timeout = -1;

  const hideAlert = () => {
    show.value = false;
    window.clearTimeout(timeout);
  };

  const updateAlert = () => {
    if (show.value) {
      hideAlert();
      timeout = window.setTimeout(() => {
        show.value = true;
        timeout = window.setTimeout(hideAlert, KEEP * 1000);
      }, EFFECT * 1000);
    } else {
      show.value = true;
      timeout = window.setTimeout(hideAlert, KEEP * 1000);
    }
  };

  return { show, updateAlert };
};

export default {
  props: {
    message: String,
    color: String,
  },
  setup(props: AlertProps) {
    return {
      alertClass: computed(() => (props.color ? `alert--${props.color}` : `alert`)),
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/common';

@mixin alert($background, $text) {
  @include transition(transform, 0.5s);
  position: fixed;
  top: 0;
  width: 100%;
  padding: 0.6rem 1rem;
  background-color: $background;
  color: $text;
  text-align: center;
  z-index: get-elevation('high');
}

.alert {
  @include alert($gray, #000);

  &--red {
    @include alert($red, #fff);
  }

  &--yellow {
    @include alert($yellow, #333);
  }

  &--green {
    @include alert($green, #fff);
  }

  &--blue {
    @include alert($blue, #fff);
  }

  &--purple {
    @include alert($purple, #fff);
  }
}

.alert-enter-active,
.alert-leave-active {
  transition: transform 0.5s;
}
.alert-enter,
.alert-leave-to {
  transform: translateY(-100%);
}
</style>
