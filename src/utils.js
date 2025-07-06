// src/utils.js
// Path helpers for eventsync

// Get value by dot-path (e.g., 'user.name')
export function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

// Set value by dot-path immutably
export function setByPath(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  let curr = newObj;
  for (const key of keys) {
    if (!(key in curr) || typeof curr[key] !== 'object' || curr[key] === null) {
      curr[key] = {};
    }
    curr[key] = Array.isArray(curr[key]) ? [...curr[key]] : { ...curr[key] };
    curr = curr[key];
  }
  curr[lastKey] = value;
  return newObj;
}

// Convert dot-path to safe key (e.g., 'user.name' -> 'user_name')
export function pathToKey(path) {
  return path.replace(/\./g, '_');
}
