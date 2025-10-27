import { AuthViewModel } from '@/auth/domain/view-models/auth.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const AUTH_READ_REPOSITORY_TOKEN = Symbol('AuthReadRepository');

export interface AuthReadRepository {
  findById(id: string): Promise<AuthViewModel | null>;
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<AuthViewModel>>;
  save(authViewModel: AuthViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
