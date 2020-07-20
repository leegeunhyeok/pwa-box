<template>
  <div class="home">
    <div class="home__wrap" ref="logo">
      <div class="home__logo">
        <img alt="logo" src="../assets/logo.png" />
      </div>
      <div class="home__menu">
        <Button color="blue">Quick Start</Button>
        <Button>Set Manually</Button>
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
  private showMenu: boolean;

  constructor() {
    super();
    this.showMenu = false;
  }

  mounted() {
    const animationEndHandler = () => {
      setTimeout(() => {
        this.showMenu = true;
      }, 250);
    };

    (this.$refs.logo as Element).addEventListener('animationend', animationEndHandler);
  }
}
</script>

<style lang="scss">
@import '@/styles/common';
@import '@/styles/effects';

.home {
  @include container;
  display: flex;
  align-items: center;
  justify-content: center;

  &__wrap {
    -webkit-animation: welcome 1s 1s forwards;
    animation: welcome 1s 1s forwards;
  }

  &__logo {
    width: 300px;
    margin: auto;
    margin-bottom: 2rem;

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
    height: 80px;
    opacity: 0;
    -webkit-animation: delay 0.5s 2s forwards;
    animation: delay 0.5s 2s forwards;

    & button {
      display: block;
      width: 100%;
      margin: 0.5rem 0;
    }
  }
}

@-webkit-keyframes welcome {
  100% {
    margin-top: -10vh;
  }
}

@keyframes welcome {
  100% {
    margin-top: -10vh;
  }
}

@-webkit-keyframes delay {
  100% {
    opacity: 1;
  }
}

@keyframes delay {
  100% {
    opacity: 1;
  }
}
</style>
