import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';

export const SUBSCRIPTION_WRITE_REPOSITORY_TOKEN = Symbol(
  'SubscriptionWriteRepository',
);

export interface SubscriptionWriteRepository {
  findById(id: string): Promise<SubscriptionAggregate | null>;
  findByTenantId(tenantId: string): Promise<SubscriptionAggregate | null>;
  save(subscription: SubscriptionAggregate): Promise<SubscriptionAggregate>;
  delete(id: string): Promise<boolean>;
}
