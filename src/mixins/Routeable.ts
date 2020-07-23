import Vue from 'vue';

export default class Routeable extends Vue {
  toNext(path: string) {
    this.$store.commit('SET_ROUTE_EFFECT_TO_LEFT');
    this.$router.push({ path });
  }

  toPrevious(path: string) {
    this.$store.commit('SET_ROUTE_EFFECT_TO_RIGHT');
    this.$router.push({ path });
  }
}
