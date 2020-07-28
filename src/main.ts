import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import VueKonva from 'vue-konva';
import App from './App.vue';
import store from '@/store';
import router from '@/router';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(VueKonva);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
