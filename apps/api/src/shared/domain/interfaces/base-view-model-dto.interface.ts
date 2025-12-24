/**
 * Base interface for ViewModel DTOs.
 * Provides common properties: id, createdAt, and updatedAt.
 *
 * All ViewModel DTOs should extend this interface to ensure consistency
 * across the application.
 */
export interface IBaseViewModelDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
