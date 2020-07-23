<template>
  <div id="app">
    <transition :name="routeEffectDirection" mode="in-out">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['routeEffectDirection']),
  },
})
export default class App extends Vue {
  mounted() {
    this.$router.push({ path: '/' }).catch(() => void '');
  }
}
</script>

<style lang="scss">
@import '@/styles/common';

html,
body {
  @include container;
  padding: 0;
  margin: 0;
}

#app {
  @include container;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/* Route transition */
.route-left-enter-active {
  z-index: get-elevation('medium');
  transition: transform 1s ease;
}
.route-left-enter {
  transform: translateX(100%);
}
.route-left-leave-active {
  display: none !important;
}

.route-right-enter-active {
  z-index: get-elevation('medium');
  transition: transform 1s ease;
}
.route-right-enter {
  transform: translateX(-100%);
}
.route-right-leave-active {
  display: none !important;
}
</style>
