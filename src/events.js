// src/events.js
// DOM event helpers for eventsync

export const EVENTSYNC_EVENT = '__eventsync_update__';

export function dispatchEvent(detail) {
  window.dispatchEvent(new CustomEvent(EVENTSYNC_EVENT, { detail }));
}

export function addEventListener(handler) {
  window.addEventListener(EVENTSYNC_EVENT, handler);
}

export function removeEventListener(handler) {
  window.removeEventListener(EVENTSYNC_EVENT, handler);
}
