import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';

export const SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN = Symbol(
  'SubscriptionPlanWriteRepository',
);

export interface SubscriptionPlanWriteRepository {
  findById(id: string): Promise<SubscriptionPlanAggregate | null>;
  findBySlug(slug: string): Promise<SubscriptionPlanAggregate | null>;
  save(
    subscriptionPlan: SubscriptionPlanAggregate,
  ): Promise<SubscriptionPlanAggregate>;
  delete(id: string): Promise<boolean>;
}
