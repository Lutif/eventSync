# eventsync

> React-compatible global state management via DOM event streams. No context, no prop-drilling, no re-render headaches.

---

## Features

- **Global state** shared across your React app, powered by DOM CustomEvents
- **No React Context**: avoids unnecessary re-renders
- **Subscribe to any state path**: use dot-paths like `user.name`
- **Multiple fields per component**: subscribe to as many as you want
- **Immutable updates**: never mutates your state
- **Tiny bundle**: no dependencies except React

---

## Installation

```sh
npm install eventsync
```

---

## Usage

```js
import { useGlobalState, setGlobalState } from 'eventsync';

// Subscribe to global state fields
const [{ user_name, counter }, { setUser_name, setCounter }] = useGlobalState([
  'user.name',
  'counter'
]);

// Read values
console.log(user_name, counter);

// Update values
setUser_name('Alice');
setCounter(42);

// Or programmatically update global state anywhere
setGlobalState('user.name', 'Bob');
```

---

## API

### `useGlobalState(paths: string[])`

- `paths`: Array of dot-path strings (e.g., `['user.name', 'counter']`)
- Returns `[values, setters]`:
  - `values`: Object with state pieces, keys auto-prefixed (e.g., `user_name`)
  - `setters`: Object with setter functions (e.g., `setUser_name`)

### `setGlobalState(path: string, value: any)`

- Updates global state at the given path
- Triggers a DOM CustomEvent (`__eventsync_update__`) to notify subscribers

---

## How It Works

- Global state is held in memory
- Updates are broadcast via DOM CustomEvents
- Components only re-render when their subscribed state changes (shallow equality)
- Dot-path access for deep state
- No state collisions: returned keys are auto-prefixed (e.g., `user.name` → `user_name`)

---

## Example

```js
import { useGlobalState } from 'eventsync';

function Profile() {
  const [{ user_name }, { setUser_name }] = useGlobalState(['user.name']);
  return (
    <div>
      <span>{user_name}</span>
      <button onClick={() => setUser_name('Charlie')}>Change Name</button>
    </div>
  );
}
```

---

## Advanced

- **Deep nested state**: subscribe to any depth (e.g., `settings.theme.color`)
- **Multiple fields**: subscribe to as many as you want per component
- **Programmatic updates**: use `setGlobalState` anywhere
- **SSR-compatible import**: You can safely import and use eventsync in server-side rendering (SSR) code, but global state features (state updates, subscriptions) only work in the browser after hydration. No DOM or window access occurs during SSR.

---

## License

MIT
