<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
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
</style>
