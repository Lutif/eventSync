# Blog: Solving Unnecessary Rerenders in React with eventsync

React Context is a popular way to share state globally in React apps. But if you've ever used Context for anything beyond simple themes, you may have noticed a frustrating problem: **updating one value in Context causes all consumers to rerender—even those that don't use the updated value.**

Let's see why this happens, and how `react-eventsync` solves it for you.

---

## The Problem: Context Rerenders Everything

Suppose you have a Context that holds both a `counter` and a `user` object:

```tsx
// context.tsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [counter, setCounter] = useState(0);
  const [user, setUser] = useState({ name: '', email: '' });
  return (
    <AppContext.Provider value={{ counter, setCounter, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
```

Now, imagine two components:

```tsx
// Counter.tsx
import { useAppContext } from './context';

const Counter = () => {
  const { counter, setCounter } = useAppContext();
  console.info('Counter rerendered');
  return (
    <button onClick={() => setCounter(counter + 1)}>{counter}</button>
  );
};

// UserName.tsx
import { useAppContext } from './context';

const UserName = () => {
  const { user } = useAppContext();
  console.info('UserName rerendered');
  return <div>{user.name}</div>;
};
```

**If you update the counter, both `Counter` and `UserName` rerender!**

Why? Because React Context triggers a rerender for all consumers whenever the context value changes—even if only one field changed. This can lead to performance issues and unnecessary UI updates.

---

## The Solution: eventsync

`react-eventsync` avoids this problem by letting you subscribe to only the specific state fields you care about. Under the hood, it uses DOM events to notify only the relevant components.

Here's how you would write the same example with eventsync:

```tsx
// App.tsx
import { initGlobalState } from 'eventsync';
import Counter from './Counter';
import UserName from './UserName';

initGlobalState({
  counter: 0,
  user: { name: '', email: '' }
});

function App() {
  return (
    <>
      <Counter />
      <UserName />
    </>
  );
}

// Counter.tsx
import { useGlobalState } from 'eventsync';

const Counter = () => {
  const [{ counter }, { setCounter }] = useGlobalState(["counter"]);
  console.info('Counter rerendered');
  return (
    <button onClick={() => setCounter(counter + 1)}>{counter}</button>
  );
};

// UserName.tsx
import { useGlobalState } from 'eventsync';

const UserName = () => {
  const [username] = useGlobalState('user.name');
  console.info('UserName rerendered');
  return <div>{username}</div>;
};
```

Now, when you update the counter, **only the `Counter` component rerenders**. `UserName` stays untouched, because it isn't subscribed to `counter`.

---

## Why This Matters

- **Better performance:** Only components that care about a state field rerender when it changes.
- **Cleaner code:** No need to split up your context or use selectors.
- **No context headaches:** State is global, but updates are precise.
- **Powered by DOM events:** eventsync uses browser events to broadcast updates, so React's context limitations don't apply.

---

## Conclusion

If you've struggled with unnecessary rerenders in React Context, try `react-eventsync`. You'll get global state, but with fine-grained, efficient updates—no more wasted renders!

For more, see the [Getting Started guide](./getting-started.md).
