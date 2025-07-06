import { useGlobalState, setGlobalState } from '../src/index.js';
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { initGlobalState } from 'eventsync';

// Helper to flush React state updates
function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe('eventsync', () => {
  beforeEach(() => {
    // Reset global state for each test
    setGlobalState('user.name', 'Alice');
    setGlobalState('counter', 0);
  });

  it('should provide initial state and update via setter', async () => {
    let values, setters;
    function TestComponent() {
      [values, setters] = useGlobalState(['user.name', 'counter']);
      return null;
    }
    render(<TestComponent />);

    // Verify initial state
    expect(values.user_name).toBe('Alice');
    expect(values.counter).toBe(0);

    // Update state via setter - one at a time to ensure events are processed
    act(() => {
      setters.setUser_name('Bob');
    });
    await flushPromises();

    act(() => {
      setters.setCounter(10);
    });
    await flushPromises();

    // Verify updated state
    expect(values.user_name).toBe('Bob');
    expect(values.counter).toBe(10);
  });

  it('should update state via setGlobalState and notify subscribers', async () => {
    let values;
    function TestComponent() {
      [values] = useGlobalState(['user.name']);
      return null;
    }
    render(<TestComponent />);
    expect(values.user_name).toBe('Alice');
    act(() => {
      setGlobalState('user.name', 'Charlie');
    });
    await flushPromises();
    expect(values.user_name).toBe('Charlie');
  });

  it('should only re-render when subscribed state changes', async () => {
    let renderCount = 0;
    let values;
    function TestComponent() {
      renderCount++;
      [values] = useGlobalState(['counter']);
      return null;
    }
    render(<TestComponent />);
    expect(renderCount).toBe(1);
    act(() => {
      setGlobalState('user.name', 'Zoe');
    });
    await flushPromises();
    expect(renderCount).toBe(1); // Should not re-render
    act(() => {
      setGlobalState('counter', 42);
    });
    await flushPromises();
    expect(renderCount).toBe(2); // Should re-render
    expect(values.counter).toBe(42);
  });

  it('should not re-render unrelated components when state changes', async () => {
    let userRenderCount = 0;
    let counterRenderCount = 0;
    let userValues, counterValues;

    function UserComponent() {
      userRenderCount++;
      [userValues] = useGlobalState(['user.name']);
      return null;
    }
    function CounterComponent() {
      counterRenderCount++;
      [counterValues] = useGlobalState(['counter']);
      return null;
    }

    render(<>
      <UserComponent />
      <CounterComponent />
    </>);

    expect(userRenderCount).toBe(1);
    expect(counterRenderCount).toBe(1);

    act(() => {
      setGlobalState('counter', 100);
    });
    await flushPromises();
    expect(userRenderCount).toBe(1); // UserComponent should not re-render
    expect(counterRenderCount).toBe(2); // CounterComponent should re-render
    expect(counterValues.counter).toBe(100);

    act(() => {
      setGlobalState('user.name', 'Eve');
    });
    await flushPromises();
    expect(userRenderCount).toBe(2); // UserComponent should re-render
    expect(counterRenderCount).toBe(2); // CounterComponent should not re-render
    expect(userValues.user_name).toBe('Eve');
  });
});
