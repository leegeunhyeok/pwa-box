<template>
  <div class="home">
    <div class="home__logo">
      <img alt="logo" src="../assets/logo.png" />
    </div>
    <div class="home__menu" ref="menu">
      <Button :class="hidden" color="blue">Quick Start</Button>
      <Button :class="hidden">Set Manually</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Button from '@/components/Button.vue';

@Component({
  components: {
    Button,
  },
})
export default class Home extends Vue {
  private showButton: boolean;

  constructor() {
    super();
    this.showButton = false;
  }

  get hidden() {
    return this.showButton ? null : 'hidden';
  }

  mounted() {
    const animationEndHandler = () => {
      setTimeout(() => {
        this.showButton = true;
      });
    };

    (this.$refs.menu as Element).addEventListener('animationend', animationEndHandler);
  }
}
</script>

<style lang="scss">
@import '@/styles/common';
@import '@/styles/effects';

.home {
  @include container;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;

  &__logo {
    width: 300px;
    margin: auto;
    margin-bottom: 1rem;

    @include screen-size(md) {
      width: 50%;
    }

    @include screen-size(sm) {
      width: 60%;
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
    margin-bottom: 100px;

    & button {
      display: block;
      width: 100%;
      margin: 0.5rem 0;
      @include transition(0.5s, opacity);

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
</style>
