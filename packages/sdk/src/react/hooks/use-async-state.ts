import { useCallback, useState } from 'react';

export type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  success: boolean;
};

export type UseAsyncStateReturn<T, Args extends unknown[] = unknown[]> =
  AsyncState<T> & {
    execute: (...args: Args) => Promise<T | null>;
    reset: () => void;
  };

/**
 * Generic hook for managing async operations with loading, error, and data states
 */
export function useAsyncState<T, Args extends unknown[] = unknown[]>(
  asyncFn: (...args: Args) => Promise<T>,
): UseAsyncStateReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
    success: false,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({
        data: null,
        error: null,
        loading: true,
        success: false,
      });

      try {
        const result = await asyncFn(...args);
        setState({
          data: result,
          error: null,
          loading: false,
          success: true,
        });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({
          data: null,
          error: err,
          loading: false,
          success: false,
        });
        return null;
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
