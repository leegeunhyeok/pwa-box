<template>
  <button :class="buttonClass" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop() color: string | undefined;
  private buttonClass: string;

  constructor() {
    super();
    this.buttonClass = '';
  }

  created() {
    if (this.color) {
      this.buttonClass = `button--${this.color}`;
    } else {
      this.buttonClass = 'button';
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/common';

$radius: 0.2rem;

@mixin button($background, $text) {
  @include transition(0.3s, background-color);
  cursor: pointer;
  outline: none;
  padding: 0.6rem 1rem;
  background-color: $background;
  color: $text;
  border-radius: $radius;
  border: none;

  &:hover {
    background-color: darken($background, 10%);
  }
}

.button {
  @include button($gray, #000);

  &--red {
    @include button($red, #fff);
  }

  &--yellow {
    @include button($blue, #333);
  }

  &--green {
    @include button($blue, #fff);
  }

  &--blue {
    @include button($blue, #fff);
  }

  &--purple {
    @include button($blue, #fff);
  }
}
</style>
