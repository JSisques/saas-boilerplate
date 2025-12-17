import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

/**
 * Base interface for read repositories.
 * Provides common methods that all read repositories should implement.
 *
 * @template TViewModel - The view model or primitives type
 * @template TId - The identifier type (usually a UUID value object or string)
 *
 * @interface IBaseReadRepository
 */
export interface IBaseReadRepository<TViewModel> {
  /**
   * Find a view model by its id.
   *
   * @param id - The id of the view model to find.
   * @returns Promise that resolves to the view model or null if not found.
   */
  findById(id: string): Promise<TViewModel | null>;

  /**
   * Find a view model by its key.
   *
   * @param key - The key of the view model to find.
   * @returns Promise that resolves to the view model or null if not found.
   */
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<TViewModel>>;

  /**
   * Save a view model (for read model updates).
   *
   * @param viewModel - The view model to save.
   * @returns Promise that resolves when the view model is saved.
   */
  save(viewModel: TViewModel): Promise<void>;

  /**
   * Delete a view model by id.
   *
   * @param id - The id of the view model to delete.
   * @returns Promise that resolves when the view model is deleted.
   */
  delete(id: string): Promise<void>;
}
