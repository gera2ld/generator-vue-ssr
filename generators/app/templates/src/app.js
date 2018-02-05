import Vue from 'vue';
import App from './components/app';
import createRouter from './router';

Vue.config.productionTip = false;

export default function createApp() {
  const router = createRouter();
  const app = new Vue({
    router,
    render: h => h(App),
  });

  return { app, router };
}
