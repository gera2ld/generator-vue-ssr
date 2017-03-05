import store from 'src/services/store';
import { app, router } from './app';

export default (context) => {
  router.push(context.url);
  const matchedComponents = router.getMatchedComponents();
  if (!matchedComponents.length) {
    return Promise.reject({ status: '404' });
  }
  return Promise.all(matchedComponents.map((comp) => {
    if (comp.prefetch) {
      return comp.prefetch(store, router.currentRoute);
    }
  }))
  .then(() => {
    context.initialState = store;
    return app;
  }, (err) => {
    console.error(err);
  });
};
