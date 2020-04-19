const localStorage = global.window.localStorage;

export const get = (key) => localStorage.getItem(key);

export const set = (key, value) => {
  value === null
    ? localStorage.removeItem(key)
    : localStorage.setItem(key, value);
};
