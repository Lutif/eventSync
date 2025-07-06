
# eventsync 

> **eventsync** is a React-compatible global state management library powered by DOM event streams. It solves the React Context re-render problem and makes global state simple, efficient, and precise.

---

## Why eventsync?

- **No more unnecessary re-renders:** Only components that subscribe to a changed state field will re-render. No more React Context headaches!
- **Fine-grained subscriptions:** Subscribe to exactly the state you need, even deep nested fields.
- **Immutable, global, and minimal:** State updates are immutable, global, and the library is tiny with no dependencies (except React).
- **Powered by DOM events:** Updates are broadcast using browser events for maximum efficiency.

Curious why this matters? Read our blog: [Why React Context Causes Unnecessary Rerenders (and how eventsync fixes it)](./blog-context-vs-eventsync.md)

---

## Quick Start

### 1. Install

```bash
npm install react-eventsync
```

### 2. Initialize Global State

```js
import { initGlobalState } from 'react-eventsync';

initGlobalState({
  counter: 0,
  user: { name: '', email: '' }
});
```

### 3. Use State in Components

```js
import { useGlobalState, setGlobalState } from 'react-eventsync';

const [{ user_name, counter }, { setUser_name, setCounter }] = useGlobalState([
  'user.name',
  'counter'
]);

setGlobalState('user.name', 'Alice');
```

---

## Learn More

- **Getting Started:** [Step-by-step guide & examples](./getting-started.md)
- **API Reference:**
  - `useGlobalState(paths: string[])` — Subscribe to one or more state fields by dot-path. Returns `[values, setters]`.
  - `setGlobalState(path: string, value: any)` — Programmatically update state at the specified path.
- **Blog:** [Why React Context Causes Unnecessary Rerenders (and how eventsync fixes it)](./blog-context-vs-eventsync.md)
- **Project README:** [../README.md](../README.md)

---

## FAQ

**Q: How is this different from React Context?**
A: Context causes all consumers to re-render on any value change. eventsync only re-renders components that subscribe to the changed state field.

**Q: Is it safe for deep state?**
A: Yes! Subscribe to any nested field using dot-paths (e.g., 'user.name').

**Q: Is it fast?**
A: Yes. Updates are broadcast via DOM events and only relevant components update.

---

For more, see the [Getting Started guide](./getting-started.md) or the [blog post](./blog-context-vs-eventsync.md).
