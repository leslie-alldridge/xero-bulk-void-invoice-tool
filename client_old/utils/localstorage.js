const localStorage = global.window.localStorage;

function get(key) {
  return localStorage.getItem(key);
}

function set(key, value) {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

module.exports = {
  get,
  set
};
