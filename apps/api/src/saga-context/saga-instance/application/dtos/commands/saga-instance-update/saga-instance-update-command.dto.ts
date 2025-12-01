import { ISagaInstanceCreateCommandDto } from '@/saga-context/saga-instance/application/dtos/commands/saga-instance-create/saga-instance-create-command.dto';

/**
 * Data Transfer Object f r updating a saga instance via command layer.
 *
 * @interface ISagaInstanceUpdateCommandDto
 * @property {string} id - The id of the saga instance to update.
 * @extends Partial<ISagaInstanceCreateCommandDto>
 */
export interface ISagaInstanceUpdateCommandDto
  extends Partial<Omit<ISagaInstanceCreateCommandDto, 'id'>> {
  id: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}
