// src/index.d.ts
declare module 'eventsync' {
  import { Dispatch, SetStateAction } from 'react';

  /**
   * useGlobalState hook for subscribing to global state fields.
   * Accepts a single path or an array of paths.
   * @param paths Dot-path string or array of dot-path strings for state fields (e.g., 'user.name' or ['user.name', 'counter'])
   * @returns [values, setters] tuple
   */
  export function useGlobalState<T = any, Path extends string = string>(
    path: Path
  ): [
    // Direct value for single path
    T,
    (value: T) => void
  ];

  export function useGlobalState<
    T = any,
    Paths extends string[] = string[]
  >(
    paths: [...Paths]
  ): [
    // Object for multiple paths
    Record<
      Paths[number] extends string
        ? `${Paths[number] extends infer P ? P extends string ? P : never : never}`
        : never,
      T
    >,
    Record<
      Paths[number] extends string
        ? `set${Capitalize<
            Paths[number] extends infer P
              ? P extends string
                ? P extends `${infer A}.${infer B}`
                  ? `${A}_${B}`
                  : P
                : never
              : never
          >}`
        : never,
      (value: T) => void
    >
  ];

  /**
   * Programmatically update state at the specified path.
   * @param path Dot-path string for state field
   * @param value New value
   */
  export function setGlobalState(path: string, value: any): void;

  /**
   * Read-only access to global state at a path (optional API)
   * @param path Dot-path string for state field
   * @returns Value at the path
   */
  export function getGlobalState(path: string): any;

  /**
   * Initialize the global state and its type. Call once at app startup.
   * @param initialState Optional initial state object
   */
  export function initGlobalState<T extends object>(initialState?: T): void;
}
