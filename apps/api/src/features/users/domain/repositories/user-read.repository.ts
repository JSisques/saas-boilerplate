import { UserViewModel } from '@/features/users/domain/view-models/user.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const USER_READ_REPOSITORY_TOKEN = Symbol('UserReadRepository');

export interface UserReadRepository {
  findById(id: string): Promise<UserViewModel | null>;
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<UserViewModel>>;
  save(userViewModel: UserViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
