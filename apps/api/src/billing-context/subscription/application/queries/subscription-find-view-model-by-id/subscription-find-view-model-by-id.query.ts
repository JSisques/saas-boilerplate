import { ISubscriptionFindByIdQueryDto } from '@/billing-context/subscription/application/dtos/queries/subscription-find-by-id/subscription-find-by-id-query.dto';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';

export class FindSubscriptionViewModelByIdQuery {
  readonly id: SubscriptionUuidValueObject;

  constructor(props: ISubscriptionFindByIdQueryDto) {
    this.id = new SubscriptionUuidValueObject(props.id);
  }
}
