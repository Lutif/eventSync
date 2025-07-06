<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

⸻

Copilot Instructions for eventsync Global State Library

This project is called eventsync, a React-compatible global state management library powered by DOM event streams, designed to avoid React Context re-render problems.

Copilot should follow these rules and specs to help build the library:

⸻

Project Overview
	•	eventsync provides global state sharing across React apps
	•	State changes propagate via custom DOM events
	•	Components only re-render when subscribed state pieces change
	•	Dot-path strings (e.g., "user.name") are used to access nested state
	•	Supports subscribing to multiple state fields per component
	•	Immutable state updates, no mutations
	•	Minimal bundle size, no external dependencies beyond React

⸻

Public API

useGlobalState(paths: string[]): [values, setters]
	•	paths: array of dot-path strings for state fields
	•	Returns:
	•	values: object containing state pieces, auto-prefixed keys to avoid clashes
	•	setters: object with setter functions named set<Key> for each state piece

Example Usage

const [{ user_name, counter }, { setUser_name, setCounter }] = useGlobalState([
  'user.name',
  'counter'
])


⸻

setGlobalState(path: string, value: any)
	•	Programmatically update state at the specified path
	•	Dispatches a DOM CustomEvent to trigger re-renders

⸻

Internal Requirements
	•	Global state is an object held in memory
	•	DOM events (CustomEvent) are used to broadcast updates
	•	Event name:

const EVENTSYNC_EVENT = '__eventsync_update__'


	•	Components listen for this event and update reactively
	•	Dot-path based access for nested state
	•	Auto-prefix returned keys with underscores for safety (e.g., "user.name" → user_name)
	•	Shallow equality prevents redundant re-renders
	•	Immutable updates by cloning affected state branches only

⸻

File Structure

eventsync/
├── src/
│   ├── index.js         // Public exports
│   ├── store.js         // Global state logic
│   ├── utils.js         // Path helpers (getByPath, setByPath)
│   ├── events.js        // DOM event helpers
├── package.json
├── README.md
├── copilot-instructions.md


⸻

Behavior Requirements

✅ Deep nested state supported
✅ Only subscribed components re-render on relevant updates
✅ DOM CustomEvent name fixed as '__eventsync_update__'
✅ Supports subscribing to multiple independent state fields
✅ Safe from state collisions via key prefixing
✅ Small, dependency-free bundle (except React)

⸻

Stretch Goals (Optional)

Copilot may extend features to include:
	•	Custom aliases for returned keys
	•	getGlobalState(path) for read-only access
	•	Dev-only logging of state changes
	•	Minimal test coverage using /test folder
	•	TypeScript typings if requested

⸻

Coding Guidelines
	•	Code must use ES Modules (ESM)
	•	React 18+ compatible
	•	Keep code functional and pure where possible
	•	Public API exports only what’s needed (useGlobalState, setGlobalState)

⸻

End of Copilot Instructions

Copilot or any AI assistant should follow these rules exactly when generating code for eventsync.

⸻

