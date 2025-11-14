/**
 * Generic base service interface for any service implementation.
 * T - Input type (e.g., command, DTO, etc.)
 * R - Return type (e.g., result, entity, etc.)
 */
export interface IBaseService<T = any, R = any> {
  execute(input: T): Promise<R>;
}
