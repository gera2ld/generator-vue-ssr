import store from './store';

export function setTitle(title) {
  if (process.env.VUE_ENV === 'server') {
    store._meta = {
      ...store._meta,
      title,
    };
  } else {
    document.title = title;
  }
}
