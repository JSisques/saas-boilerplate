import { ISubscriptionPlanFindByIdQueryDto } from '@/billing-context/subscription-plan/application/dtos/queries/subscription-plan-find-by-id/subscription-plan-find-by-id-query.dto';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

export class FindSubscriptionPlanByIdQuery {
  readonly id: SubscriptionPlanUuidValueObject;

  constructor(props: ISubscriptionPlanFindByIdQueryDto) {
    this.id = new SubscriptionPlanUuidValueObject(props.id);
  }
}
