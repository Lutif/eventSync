# Getting Started with eventsync

This guide will help you quickly set up and use **eventsync** for global state management in your React app.

---

## 1. Initialize Global State

First, initialize your global state at the root of your app (e.g., in `index.tsx` or `App.tsx`).

```tsx
import { initGlobalState } from 'eventsync';

interface Store {
  user: {
    name: string;
    email: string;
  };
  counter: number;
}

initGlobalState<Store>({
  counter: 0,
  user: {
    email: '',
    name: ''
  }
});
```

---

## 2. Use State in Components

### Counter Example

```tsx
import React from 'react';
import { useGlobalState } from 'eventsync';

const Counter = () => {
  const [{ counter }, { setCounter }] = useGlobalState(["counter"]);

  const handleIncrement = () => setCounter(counter + 1);
  const handleDecrement = () => setCounter(counter - 1);

  return (
    <div style={{ margin: '1rem 0' }}>
      <button onClick={handleDecrement}>-</button>
      <span style={{ margin: '0 1rem' }}>{counter}</span>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
};

export default Counter;
```

---

### User Form Example

```tsx
import React from 'react';
import { useGlobalState } from 'eventsync';

const UserForm = () => {
  const [user, setUser] = useGlobalState<{ name: string; email: string }>('user');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <form style={{ margin: '1rem 0' }}>
      <div>
        <label>Name: </label>
        <input name="name" value={user.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email: </label>
        <input name="email" value={user.email} onChange={handleChange} />
      </div>
      <button type="submit">Update User</button>
    </form>
  );
};

export default UserForm;
```

---

### User Name Display Example

```tsx
import React from 'react';
import { useGlobalState } from 'eventsync';

const UserName = () => {
  const [username] = useGlobalState<string>('user.name');
  return (
    <div style={{ margin: '1rem 0', fontWeight: 'bold' }}>
      User Name: {username}
    </div>
  );
};

export default UserName;
```

---

## 3. App Integration Example

```tsx
import './App.css';
import { initGlobalState } from 'eventsync';
import Counter from './Counter';
import UserForm from './UserForm';
import UserName from './UserName';

// ...initGlobalState as above...

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>hello</p>
        <Counter />
        <UserForm />
        <UserName />
      </header>
    </div>
  );
}

export default App;
```

---


## Rerender Behavior

One of the core benefits of **eventsync** is precise control over React component rerenders:

- **Only components that subscribe to a changed state field will rerender.**
  - For example, if you use `useGlobalState(["counter"])` in a component, it will only rerender when `counter` changes, not when unrelated state (like `user.name`) changes.
- **Nested subscriptions are supported.**
  - You can subscribe to a whole object (e.g., `'user'`) or a nested field (e.g., `'user.name'`).
  - If you subscribe to `'user.name'`, your component will only rerender when `user.name` changes, not when `user.email` or other state changes.
- **Shallow equality checks** are used to prevent unnecessary rerenders when the value has not actually changed.
- **No React Context re-render problem:** Unlike React Context, updating one part of the state does not cause all consumers to rerender—only those that care about the changed field.

### Example: Rerender Logging

```tsx
const Counter = () => {
  const [{ counter }, { setCounter }] = useGlobalState(["counter"]);
  console.info("Counter rerendered");
  // ...
}

const UserForm = () => {
  const [user, setUser] = useGlobalState<{ name: string; email: string }>('user');
  console.info("UserForm rerendered", { user });
  // ...
}

const UserName = () => {
  const [username] = useGlobalState<string>('user.name');
  console.info("UserName rerendered", { username });
  // ...
}
```

Try updating only the counter, or only the user name/email, and observe in your console which components rerender. This demonstrates the fine-grained update model of eventsync.

---

## Notes
- Each component only rerenders when its subscribed state changes.
- You can subscribe to nested fields (e.g., `'user.name'`) or whole objects (e.g., `'user'`).
- State updates are immutable and global.

For more details, see the main [documentation](./index.md) or the project README.
