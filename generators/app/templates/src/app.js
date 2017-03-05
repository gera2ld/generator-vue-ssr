import Vue from 'vue';
import App from './components/app';
import router from './router';

Vue.config.productionTip = false;

const app = new Vue({
  router,
  render: h => h(App),
});

export { app, router };
