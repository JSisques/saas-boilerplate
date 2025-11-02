import { ISubscriptionPlanCreateCommandDto } from '@/billing-context/subscription-plan/application/dtos/commands/subscription-plan-create/subscription-plan-create-command.dto';

/**
 * Data Transfer Object for updating a subscription plan by id via command layer.
 *
 * @interface ISubscriptionPlanUpdateCommandDto
 * @property {string} id - The id of the subscription plan to update.
 * @extends Partial<ISubscriptionPlanCreateCommandDto>
 */
export interface ISubscriptionPlanUpdateCommandDto
  extends Partial<ISubscriptionPlanCreateCommandDto> {
  id: string;
}
