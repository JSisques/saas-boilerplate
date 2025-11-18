/**
 * Generic base service interface for any service implementation.
 * T - Input type (e.g., command, DTO, etc.)
 * R - Return type (e.g., result, entity, etc.)
 */
export interface IBaseService<T = unknown, R = unknown> {
  execute(input: T): Promise<R>;
}
