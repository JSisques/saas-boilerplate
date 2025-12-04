import { ISagaStepUpdateCommandDto } from '@/saga-context/saga-step/application/dtos/commands/saga-step-update/saga-step-update-command.dto';
import { SagaStepEndDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';
import { SagaStepErrorMessageValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-error-message/saga-step-error-message.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepStartDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-start-date/saga-step-start-date.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaStepUpdateCommand {
  readonly id: SagaStepUuidValueObject;
  readonly name?: SagaStepNameValueObject;
  readonly order?: SagaStepOrderValueObject;
  readonly status?: SagaStepStatusValueObject;
  readonly startDate?: SagaStepStartDateValueObject | null;
  readonly endDate?: SagaStepEndDateValueObject | null;
  readonly errorMessage?: SagaStepErrorMessageValueObject | null;
  readonly retryCount?: SagaStepRetryCountValueObject;
  readonly maxRetries?: SagaStepMaxRetriesValueObject;
  readonly payload?: SagaStepPayloadValueObject;
  readonly result?: SagaStepResultValueObject;

  constructor(props: ISagaStepUpdateCommandDto) {
    this.id = new SagaStepUuidValueObject(props.id);

    if (props.name !== undefined) {
      this.name = new SagaStepNameValueObject(props.name);
    }
    if (props.order !== undefined) {
      this.order = new SagaStepOrderValueObject(props.order);
    }
    if (props.status !== undefined) {
      this.status = new SagaStepStatusValueObject(props.status);
    }
    if (props.startDate !== undefined) {
      this.startDate = props.startDate
        ? new SagaStepStartDateValueObject(props.startDate)
        : null;
    }
    if (props.endDate !== undefined) {
      this.endDate = props.endDate
        ? new SagaStepEndDateValueObject(props.endDate)
        : null;
    }
    if (props.errorMessage !== undefined) {
      this.errorMessage = props.errorMessage
        ? new SagaStepErrorMessageValueObject(props.errorMessage)
        : null;
    }
    if (props.retryCount !== undefined) {
      this.retryCount = new SagaStepRetryCountValueObject(props.retryCount);
    }
    if (props.maxRetries !== undefined) {
      this.maxRetries = new SagaStepMaxRetriesValueObject(props.maxRetries);
    }
    if (props.payload !== undefined) {
      this.payload = new SagaStepPayloadValueObject(props.payload);
    }
    if (props.result !== undefined) {
      this.result = new SagaStepResultValueObject(props.result);
    }
  }
}
