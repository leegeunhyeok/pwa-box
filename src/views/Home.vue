<template>
  <div class="home">
    <div class="home__wrap">
      <div class="home__logo">
        <img alt="logo" src="../assets/logo.png" />
      </div>
      <div class="home__menu" ref="menu">
        <Button :class="hidden" color="blue">Quick Start</Button>
        <Button :class="hidden">Set Manually</Button>
      </div>
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
  justify-content: center;
  align-items: center;

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
</style>
