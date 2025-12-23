import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN = Symbol(
  'SubscriptionPlanWriteRepository',
);

export interface SubscriptionPlanWriteRepository
  extends IBaseWriteRepository<SubscriptionPlanAggregate> {
  findBySlug(slug: string): Promise<SubscriptionPlanAggregate | null>;
  findByType(
    type: SubscriptionPlanTypeEnum,
  ): Promise<SubscriptionPlanAggregate | null>;
}
