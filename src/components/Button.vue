<template>
  <button :class="buttonClass" @click="$emit('click')" :disabled="isDisabled">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { ref, watch, computed } from '@vue/composition-api';

interface ButtonProps {
  color?: string;
  disabled?: boolean;
}

export default {
  props: {
    color: String,
    disabled: Boolean,
  },
  setup(props: ButtonProps) {
    const color = ref(props.color);
    const disabled = ref(props.disabled);

    watch(
      () => props.color,
      value => {
        color.value = value;
      },
    );

    watch(
      () => props.disabled,
      value => {
        disabled.value = value;
      },
    );

    return {
      buttonClass: computed(() => (color.value ? `button--${color.value}` : 'button')),
      isDisabled: disabled,
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/common';

@mixin button($background, $text) {
  @include transition(all, 0.2s);
  cursor: pointer;
  outline: none;
  padding: 0.6rem 1rem;
  background-color: $background;
  color: $text;
  border-radius: $radius;
  border: none;
  font-size: 0.9rem;

  &:hover {
    background-color: darken($background, 10%);
  }

  &:disabled {
    cursor: not-allowed;
    color: #777;
    background-color: #ddd;
  }
}

.button {
  @include button($gray, #000);

  &--red {
    @include button($red, #fff);
  }

  &--yellow {
    @include button($yellow, #333);
  }

  &--green {
    @include button($green, #fff);
  }

  &--blue {
    @include button($blue, #fff);
  }

  &--purple {
    @include button($purple, #fff);
  }
}
</style>
