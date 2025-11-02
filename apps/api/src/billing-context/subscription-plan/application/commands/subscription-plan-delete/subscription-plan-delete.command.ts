import { ISubscriptionPlanDeleteCommandDto } from '@/billing-context/subscription-plan/application/dtos/commands/subscription-plan-delete/subscription-plan-delete-command.dto';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

export class SubscriptionPlanDeleteCommand {
  readonly id: SubscriptionPlanUuidValueObject;

  constructor(props: ISubscriptionPlanDeleteCommandDto) {
    this.id = new SubscriptionPlanUuidValueObject(props.id);
  }
}
