import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN = Symbol(
  'SubscriptionPlanReadRepository',
);

export interface SubscriptionPlanReadRepository {
  findById(id: string): Promise<SubscriptionPlanViewModel | null>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SubscriptionPlanViewModel>>;
  save(subscriptionPlanViewModel: SubscriptionPlanViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
