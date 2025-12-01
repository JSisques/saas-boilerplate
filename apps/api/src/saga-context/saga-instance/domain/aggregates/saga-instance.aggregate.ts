import { ISagaInstanceCreateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-create/saga-instance-create.dto';
import { ISagaInstanceUpdateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-update/saga-instance-update.dto';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstancePrimitives } from '@/saga-context/saga-instance/domain/primitives/saga-instance.primitives';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class SagaInstanceAggregate extends BaseAggregate {
  private readonly _id: SagaInstanceUuidValueObject;
  private _name: SagaInstanceNameValueObject;
  private _status: SagaInstanceStatusValueObject;
  private _startDate: SagaInstanceStartDateValueObject | null;
  private _endDate: SagaInstanceEndDateValueObject | null;

  constructor(props: ISagaInstanceCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);
    this._id = props.id;
    this._name = props.name;
    this._status = props.status;
    this._startDate = props.startDate;
    this._endDate = props.endDate;

    if (generateEvent) {
      this.apply(
        new SagaInstanceCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  public update(
    props: ISagaInstanceUpdateDto,
    generateEvent: boolean = true,
  ): void {
    this._name = props.name !== undefined ? props.name : this._name;
    this._status = props.status !== undefined ? props.status : this._status;
    this._startDate =
      props.startDate !== undefined ? props.startDate : this._startDate;
    this._endDate = props.endDate !== undefined ? props.endDate : this._endDate;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the saga instance.
   *
   * @param generateEvent - Whether to generate the saga instance deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true): void {
    if (generateEvent) {
      this.apply(
        new SagaInstanceDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as completed.
   *
   * @returns The saga instance.
   */
  public markAsCompleted(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.COMPLETED,
    );
    this._endDate = new SagaInstanceEndDateValueObject(new Date());
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as failed.
   *
   * @returns The saga instance.
   */
  public markAsFailed(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.FAILED,
    );
    this._endDate = new SagaInstanceEndDateValueObject(new Date());
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as compensated.
   *
   * @returns The saga instance.
   */
  public markAsCompensated(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.COMPENSATED,
    );
    this._endDate = new SagaInstanceEndDateValueObject(new Date());
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as compensating.
   *
   * @returns The saga instance.
   */
  public markAsCompensating(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.COMPENSATING,
    );
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as pending.
   *
   * @returns The saga instance.
   */
  public markAsPending(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.PENDING,
    );
    this._startDate = null;
    this._endDate = null;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as started.
   *
   * @returns The saga instance.
   */
  public markAsStarted(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.STARTED,
    );
    this._startDate = new SagaInstanceStartDateValueObject(new Date());
    this._endDate = null;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Mark the saga instance as running.
   *
   * @param generateEvent - Whether to generate the saga instance marked as running event. Default is true.
   */
  public markAsRunning(generateEvent: boolean = true): void {
    this._status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.RUNNING,
    );
    this._endDate = null;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new SagaInstanceStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SagaInstanceAggregate.name,
            eventType: SagaInstanceStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Convert the saga instance aggregate to its primitive representation.
   *
   * @returns The primitive representation of the saga instance aggregate.
   */
  public toPrimitives(): SagaInstancePrimitives {
    return {
      id: this._id.value,
      name: this._name.value,
      status: this._status.value,
      startDate: this._startDate?.value ?? null,
      endDate: this._endDate?.value ?? null,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  /**
   * Get the id of the saga instance.
   *
   * @returns The id of the saga instance.
   */
  public get id(): SagaInstanceUuidValueObject {
    return this._id;
  }

  /**
   * Get the name of the saga instance.
   *
   * @returns The name of the saga instance.
   */
  public get name(): SagaInstanceNameValueObject {
    return this._name;
  }

  /**
   * Get the status of the saga instance.
   *
   * @returns The status of the saga instance.
   */
  public get status(): SagaInstanceStatusValueObject {
    return this._status;
  }

  /**
   * Get the start date of the saga instance.
   *
   * @returns The start date of the saga instance.
   */
  public get startDate(): SagaInstanceStartDateValueObject | null {
    return this._startDate;
  }

  /**
   * Get the end date of the saga instance.
   *
   * @returns The end date of the saga instance.
   */
  public get endDate(): SagaInstanceEndDateValueObject | null {
    return this._endDate;
  }
}
