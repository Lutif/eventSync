// src/store.js
// Global state logic for eventsync

import { getByPath, setByPath } from './utils.js';
import { dispatchEvent } from './events.js';


let globalState = {};
let initialized = false;

// Initialize the global state and optionally set initial values
export function initGlobalState(initialState = {}) {
  if (initialized) throw new Error('Global state already initialized');
  globalState = { ...initialState };
  initialized = true;
}

export function getGlobalState(path) {
  return getByPath(globalState, path);
}

export function setGlobalState(path, value) {
  const prev = getByPath(globalState, path);
  if (prev === value) return;
  globalState = setByPath(globalState, path, value);
  dispatchEvent({ path, value });
}

export function _getAllState() {
  return globalState;
}
