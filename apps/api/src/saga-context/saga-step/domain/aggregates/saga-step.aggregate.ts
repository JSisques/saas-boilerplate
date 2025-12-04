import { ISagaStepCreateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-create/saga-step-create.dto';
import { ISagaStepUpdateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-update/saga-step-update.dto';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepPrimitives } from '@/saga-context/saga-step/domain/primitives/saga-step.primitives';
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
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaStepAggregate extends BaseAggregate {
  private readonly _id: SagaStepUuidValueObject;
  private readonly _sagaInstanceId: SagaInstanceUuidValueObject;
  private _name: SagaStepNameValueObject;
  private _order: SagaStepOrderValueObject;
  private _status: SagaStepStatusValueObject;
  private _startDate: SagaStepStartDateValueObject | null;
  private _endDate: SagaStepEndDateValueObject | null;
  private _errorMessage: SagaStepErrorMessageValueObject | null;
  private _retryCount: SagaStepRetryCountValueObject;
  private _maxRetries: SagaStepMaxRetriesValueObject;
  private _payload: SagaStepPayloadValueObject;
  private _result: SagaStepResultValueObject | null;

  constructor(props: ISagaStepCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);
    this._id = props.id;
    this._sagaInstanceId = props.sagaInstanceId;
    this._name = props.name;
    this._order = props.order;
    this._status = props.status;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._errorMessage = props.errorMessage;
    this._retryCount = props.retryCount;
    this._maxRetries = props.maxRetries;
    this._payload = props.payload;
    this._result = props.result;

    if (generateEvent) {
      this.apply(
        new SagaStepCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the saga step.
   *
   * @param props - The properties to update.
   * @param generateEvent - Whether to generate the saga step updated event. Default is true.
   */
  public update(
    props: ISagaStepUpdateDto,
    generateEvent: boolean = true,
  ): void {
    this._name = props.name !== undefined ? props.name : this._name;
    this._order = props.order !== undefined ? props.order : this._order;
    this._status = props.status !== undefined ? props.status : this._status;
    this._startDate =
      props.startDate !== undefined ? props.startDate : this._startDate;
    this._endDate = props.endDate !== undefined ? props.endDate : this._endDate;
    this._errorMessage =
      props.errorMessage !== undefined
        ? props.errorMessage
        : this._errorMessage;
    this._retryCount =
      props.retryCount !== undefined ? props.retryCount : this._retryCount;
    this._maxRetries =
      props.maxRetries !== undefined ? props.maxRetries : this._maxRetries;
    this._payload = props.payload !== undefined ? props.payload : this._payload;
    this._result = props.result !== undefined ? props.result : this._result;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the saga step.
   *
   * @param generateEvent - Whether to generate the saga step deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true): void {
    if (generateEvent) {
      this.apply(
        new SagaStepDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga step as completed.
   *
   * @param generateEvent - Whether to generate the saga step status changed event. Default is true.
   */
  public markAsCompleted(generateEvent: boolean = true): void {
    this._status = new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED);
    this._endDate = new SagaStepEndDateValueObject(new Date());
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga step as failed.
   *
   * @param errorMessage - Optional error message to set when marking as failed.
   * @param generateEvent - Whether to generate the saga step status changed event. Default is true.
   */
  public markAsFailed(
    errorMessage?: string,
    generateEvent: boolean = true,
  ): void {
    this._status = new SagaStepStatusValueObject(SagaStepStatusEnum.FAILED);
    this._endDate = new SagaStepEndDateValueObject(new Date());
    if (errorMessage) {
      this._errorMessage = new SagaStepErrorMessageValueObject(errorMessage);
    }
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga step as pending.
   *
   * @param generateEvent - Whether to generate the saga step status changed event. Default is true.
   */
  public markAsPending(generateEvent: boolean = true): void {
    this._status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);
    this._startDate = null;
    this._endDate = null;
    this._errorMessage = null;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga step as started.
   *
   * @param generateEvent - Whether to generate the saga step status changed event. Default is true.
   */
  public markAsStarted(generateEvent: boolean = true): void {
    this._status = new SagaStepStatusValueObject(SagaStepStatusEnum.STARTED);
    this._startDate = new SagaStepStartDateValueObject(new Date());
    this._endDate = null;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga step as running.
   *
   * @param generateEvent - Whether to generate the saga step status changed event. Default is true.
   */
  public markAsRunning(generateEvent: boolean = true): void {
    this._status = new SagaStepStatusValueObject(SagaStepStatusEnum.RUNNING);
    this._endDate = null;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Increment the retry count.
   *
   * @param generateEvent - Whether to generate the saga step updated event. Default is true.
   */
  public incrementRetryCount(generateEvent: boolean = true): void {
    this._retryCount = new SagaStepRetryCountValueObject(
      this._retryCount.value + 1,
    );
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaStepUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaStepAggregate.name,
            eventType: SagaStepUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Convert the saga step aggregate to its primitive representation.
   *
   * @returns The primitive representation of the saga step aggregate.
   */
  public toPrimitives(): SagaStepPrimitives {
    return {
      id: this._id.value,
      sagaInstanceId: this._sagaInstanceId.value,
      name: this._name.value,
      order: this._order.value,
      status: this._status.value,
      startDate: this._startDate?.value ?? null,
      endDate: this._endDate?.value ?? null,
      errorMessage: this._errorMessage?.value ?? null,
      retryCount: this._retryCount.value,
      maxRetries: this._maxRetries.value,
      payload: this._payload.value,
      result: this._result?.value ?? null,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  /**
   * Get the id of the saga step.
   *
   * @returns The id of the saga step.
   */
  public get id(): SagaStepUuidValueObject {
    return this._id;
  }

  /**
   * Get the saga instance id of the saga step.
   *
   * @returns The saga instance id of the saga step.
   */
  public get sagaInstanceId(): SagaInstanceUuidValueObject {
    return this._sagaInstanceId;
  }

  /**
   * Get the name of the saga step.
   *
   * @returns The name of the saga step.
   */
  public get name(): SagaStepNameValueObject {
    return this._name;
  }

  /**
   * Get the order of the saga step.
   *
   * @returns The order of the saga step.
   */
  public get order(): SagaStepOrderValueObject {
    return this._order;
  }

  /**
   * Get the status of the saga step.
   *
   * @returns The status of the saga step.
   */
  public get status(): SagaStepStatusValueObject {
    return this._status;
  }

  /**
   * Get the start date of the saga step.
   *
   * @returns The start date of the saga step.
   */
  public get startDate(): SagaStepStartDateValueObject | null {
    return this._startDate;
  }

  /**
   * Get the end date of the saga step.
   *
   * @returns The end date of the saga step.
   */
  public get endDate(): SagaStepEndDateValueObject | null {
    return this._endDate;
  }

  /**
   * Get the error message of the saga step.
   *
   * @returns The error message of the saga step.
   */
  public get errorMessage(): SagaStepErrorMessageValueObject | null {
    return this._errorMessage;
  }

  /**
   * Get the retry count of the saga step.
   *
   * @returns The retry count of the saga step.
   */
  public get retryCount(): SagaStepRetryCountValueObject {
    return this._retryCount;
  }

  /**
   * Get the max retries of the saga step.
   *
   * @returns The max retries of the saga step.
   */
  public get maxRetries(): SagaStepMaxRetriesValueObject {
    return this._maxRetries;
  }

  /**
   * Get the payload of the saga step.
   *
   * @returns The payload of the saga step.
   */
  public get payload(): SagaStepPayloadValueObject {
    return this._payload;
  }

  /**
   * Get the result of the saga step.
   *
   * @returns The result of the saga step.
   */
  public get result(): SagaStepResultValueObject | null {
    return this._result;
  }
}
