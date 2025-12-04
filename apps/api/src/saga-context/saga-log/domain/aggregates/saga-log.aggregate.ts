import { ISagaLogCreateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-create/saga-log-create.dto';
import { ISagaLogUpdateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-update/saga-log-update.dto';
import { SagaLogPrimitives } from '@/saga-context/saga-log/domain/primitives/saga-log.primitives';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { SagaLogCreatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-created/saga-log-created.event';
import { SagaLogDeletedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-deleted/saga-log-deleted.event';
import { SagaLogUpdatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-updated/saga-log-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaLogAggregate extends BaseAggregate {
  private readonly _id: SagaLogUuidValueObject;
  private readonly _sagaInstanceId: SagaInstanceUuidValueObject;
  private readonly _sagaStepId: SagaStepUuidValueObject;
  private _type: SagaLogTypeValueObject;
  private _message: SagaLogMessageValueObject;

  constructor(props: ISagaLogCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);
    this._id = props.id;
    this._sagaInstanceId = props.sagaInstanceId;
    this._sagaStepId = props.sagaStepId;
    this._type = props.type;
    this._message = props.message;

    if (generateEvent) {
      this.apply(
        new SagaLogCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaLogAggregate.name,
            eventType: SagaLogCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the saga log.
   *
   * @param props - The properties to update.
   * @param generateEvent - Whether to generate the saga log updated event. Default is true.
   */
  public update(props: ISagaLogUpdateDto, generateEvent: boolean = true): void {
    this._type = props.type !== undefined ? props.type : this._type;
    this._message = props.message !== undefined ? props.message : this._message;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaLogUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaLogAggregate.name,
            eventType: SagaLogUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the saga log.
   *
   * @param generateEvent - Whether to generate the saga log deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true): void {
    if (generateEvent) {
      this.apply(
        new SagaLogDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaLogAggregate.name,
            eventType: SagaLogDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Convert the saga log aggregate to its primitive representation.
   *
   * @returns The primitive representation of the saga log aggregate.
   */
  public toPrimitives(): SagaLogPrimitives {
    return {
      id: this._id.value,
      sagaInstanceId: this._sagaInstanceId.value,
      sagaStepId: this._sagaStepId.value,
      type: this._type.value,
      message: this._message.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  /**
   * Get the id of the saga log.
   *
   * @returns The id of the saga log.
   */
  public get id(): SagaLogUuidValueObject {
    return this._id;
  }

  /**
   * Get the saga instance id of the saga log.
   *
   * @returns The saga instance id of the saga log.
   */
  public get sagaInstanceId(): SagaInstanceUuidValueObject {
    return this._sagaInstanceId;
  }

  /**
   * Get the saga step id of the saga log.
   *
   * @returns The saga step id of the saga log.
   */
  public get sagaStepId(): SagaStepUuidValueObject {
    return this._sagaStepId;
  }

  /**
   * Get the type of the saga log.
   *
   * @returns The type of the saga log.
   */
  public get type(): SagaLogTypeValueObject {
    return this._type;
  }

  /**
   * Get the message of the saga log.
   *
   * @returns The message of the saga log.
   */
  public get message(): SagaLogMessageValueObject {
    return this._message;
  }
}
