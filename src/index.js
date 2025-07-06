// src/index.js
// Public API for eventsync

import { useEffect, useRef, useState } from 'react';
import { getByPath, pathToKey } from './utils.js';
import { addEventListener, removeEventListener } from './events.js';
import { setGlobalState as setGlobalStateImpl, getGlobalState as getGlobalStateImpl, initGlobalState as initGlobalStateImpl } from './store.js';

// useGlobalState hook
export function useGlobalState(pathsInput) {
  const isSingle = typeof pathsInput === 'string';
  const paths = isSingle ? [pathsInput] : pathsInput;

  const [state, setState] = useState(() => {
    if (isSingle) {
      return getGlobalStateImpl(pathsInput);
    } else {
      const obj = {};
      for (const path of paths) {
        obj[pathToKey(path)] = getGlobalStateImpl(path);
      }
      return obj;
    }
  });

  // Always use latest paths
  const pathsRef = useRef(paths);
  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);

  // Helper: get root key from dot-path
  function getRootKey(path) {
    return path.split('.')[0];
  }

  // Collect all root keys from paths
  const rootKeys = Array.from(new Set(paths.map(getRootKey)));

  // Store previous values for all paths
  const prevValuesRef = useRef({});

  useEffect(() => {
    // Initialize prevValuesRef
    const vals = {};
    for (const path of paths) {
      vals[path] = getGlobalStateImpl(path);
    }
    prevValuesRef.current = vals;
  }, [paths]);

  useEffect(() => {
    const handler = (e) => {
      const { path: eventPath } = e.detail;
      // Only handle if eventPath is a root key we care about
      if (!rootKeys.includes(getRootKey(eventPath))) return;
      if (isSingle) {
        const newValue = getGlobalStateImpl(pathsInput);
        if (state !== newValue) setState(newValue);
      } else {
        let shouldUpdate = false;
        const newState = { ...state };
        for (const path of paths) {
          const newValue = getGlobalStateImpl(path);
          if (prevValuesRef.current[path] !== newValue) {
            newState[pathToKey(path)] = newValue;
            prevValuesRef.current[path] = newValue;
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          setState(newState);
        }
      }
    };
    addEventListener(handler);
    return () => removeEventListener(handler);
  }, [state, paths, rootKeys]);

  // Setters
  if (isSingle) {
    return [state, v => setGlobalStateImpl(pathsInput, v)];
  } else {
    const setters = {};
    for (const path of paths) {
      const key = pathToKey(path);
      setters['set' + key.charAt(0).toUpperCase() + key.slice(1)] = v => setGlobalStateImpl(path, v);
    }
    return [state, setters];
  }
}


// Export setGlobalState, getGlobalState, and initGlobalState
export { setGlobalStateImpl as setGlobalState };
export { getGlobalStateImpl as getGlobalState };
export { initGlobalStateImpl as initGlobalState };
