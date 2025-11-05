import { ISubscriptionCreateCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-create/subscription-create-command.dto';

/**
 * Data Transfer Object for updating a subscription by id via command layer.
 *
 * @interface ISubscriptionUpdateCommandDto
 * @property {string} id - The id of the subscription to update.
 * @extends Partial<ISubscriptionCreateCommandDto>
 */
export interface ISubscriptionUpdateCommandDto
  extends Partial<ISubscriptionCreateCommandDto> {
  id: string;
  trialEndDate: Date | null;
  status: string;
}
