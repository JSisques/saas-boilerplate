/**
 * Generic service result type
 * @template T - The type of the data
 */
export type ServiceResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  success: boolean;
};
