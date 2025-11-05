import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const SUBSCRIPTION_READ_REPOSITORY_TOKEN = Symbol(
  'SubscriptionReadRepository',
);

export interface SubscriptionReadRepository {
  findById(id: string): Promise<SubscriptionViewModel | null>;
  findByTenantId(tenantId: string): Promise<SubscriptionViewModel | null>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SubscriptionViewModel>>;
  save(subscriptionViewModel: SubscriptionViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
