<template>
  <div class="about">
    <div @click="toHome">This is an about page</div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Routeable from '@/mixins/Routeable';

@Component
export default class About extends Routeable {
  toHome() {
    this.toPrevious('/');
  }
}
</script>

<style>
.about {
  width: 100%;
  height: 100%;
  background-color: dodgerblue;
}
</style>
