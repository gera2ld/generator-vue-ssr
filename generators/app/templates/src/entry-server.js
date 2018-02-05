import store from '#/services/store';
import createApp from './app';

export default context => new Promise((resolve, reject) => {
  const { app, router } = createApp();
  router.push(context.url);
  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    if (!matchedComponents.length) {
      return reject({ status: '404' });
    }
    Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
      store,
      route: router.currentRoute,
    })))
    .then(() => {
      context.state = store;
      resolve(app);
    }, err => {
      reject(err);
    });
  }, reject);
});
