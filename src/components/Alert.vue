<template>
  <transition name="alert">
    <div :class="alertClass" v-show="show">{{ msg }}</div>
  </transition>
</template>

<script lang="ts">
import { ref, watch, computed } from '@vue/composition-api';

const KEEP = 3;
const EFFECT = 0.75;

interface AlertProps {
  color?: string;
  message?: string;
}

const useAlertState = (props: AlertProps) => {
  const message = ref('');
  const show = ref(false);
  let timeout = -1;

  const hideAlert = () => {
    window.clearTimeout(timeout);
    show.value = false;
  };

  const showAlert = () => {
    if (show.value) {
      hideAlert();
      timeout = window.setTimeout(() => {
        message.value = props.message || '';
        show.value = true;
        timeout = window.setTimeout(hideAlert, KEEP * 1000);
      }, EFFECT * 1000);
    } else {
      message.value = props.message || '';
      show.value = true;
      timeout = window.setTimeout(hideAlert, KEEP * 1000);
    }
  };

  watch(() => props.message, showAlert);

  return { msg: message, show };
};

export default {
  props: {
    message: String,
  },
  setup(props: AlertProps) {
    const { msg, show } = useAlertState(props);

    return {
      alertClass: computed(() => (props.color ? `alert--${props.color}` : `alert`)),
      msg,
      show,
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
    @include alert($blue, #333);
  }

  &--green {
    @include alert($blue, #fff);
  }

  &--blue {
    @include alert($blue, #fff);
  }

  &--purple {
    @include alert($blue, #fff);
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
