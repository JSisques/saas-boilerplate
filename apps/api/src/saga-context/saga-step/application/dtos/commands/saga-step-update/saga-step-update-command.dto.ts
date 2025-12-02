import { ISagaStepCreateCommandDto } from '@/saga-context/saga-step/application/dtos/commands/saga-step-create/saga-step-create-command.dto';

/**
 * Data Transfer Object for updating a saga step via command layer.
 *
 * @interface ISagaStepUpdateCommandDto
 * @property {string} id - The id of the saga step to update.
 * @extends Partial<Omit<ISagaStepCreateCommandDto, 'sagaInstanceId'>>
 */
export interface ISagaStepUpdateCommandDto
  extends Partial<Omit<ISagaStepCreateCommandDto, 'sagaInstanceId'>> {
  id: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
}
