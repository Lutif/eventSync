# eventsync Documentation

Welcome to the documentation for **eventsync** – a React-compatible global state management library powered by DOM event streams.

## Overview

- **Global state sharing** across React apps
- **No React Context** re-render problems
- **Dot-path strings** for nested state access
- **Immutable updates**
- **Minimal bundle size**

## Installation

```bash
npm install react-eventsync
```

## Usage

```js
import { useGlobalState, setGlobalState } from 'react-eventsync';

const [{ user_name, counter }, { setUser_name, setCounter }] = useGlobalState([
  'user.name',
  'counter'
]);

// Update state programmatically
setGlobalState('user.name', 'Alice');
```

## API

### useGlobalState(paths: string[])
- Subscribe to one or more state fields by dot-path
- Returns `[values, setters]`

### setGlobalState(path: string, value: any)
- Programmatically update state at the specified path

## More
- See the [README](../README.md) for full details.
