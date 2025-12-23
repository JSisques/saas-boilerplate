import { IFeatureCreateDto } from '@/feature-context/features/domain/dtos/entities/feature-create/feature-create.dto';
import { IFeatureUpdateDto } from '@/feature-context/features/domain/dtos/entities/feature-update/feature-update.dto';
import { FeaturePrimitives } from '@/feature-context/features/domain/primitives/feature.primitives';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { FeatureCreatedEvent } from '@/shared/domain/events/feature-context/features/feature-created/feature-created.event';
import { FeatureDeletedEvent } from '@/shared/domain/events/feature-context/features/feature-deleted/feature-deleted.event';
import { FeatureStatusChangedEvent } from '@/shared/domain/events/feature-context/features/feature-status-changed/feature-status-changed.event';
import { FeatureUpdatedEvent } from '@/shared/domain/events/feature-context/features/feature-updated/feature-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';

export class FeatureAggregate extends BaseAggregate {
  private readonly _id: FeatureUuidValueObject;
  private _key: FeatureKeyValueObject;
  private _name: FeatureNameValueObject;
  private _description: FeatureDescriptionValueObject | null;
  private _status: FeatureStatusValueObject;

  constructor(props: IFeatureCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);

    // 01: Set the properties
    this._id = props.id;
    this._key = props.key;
    this._name = props.name;
    this._description = props.description;
    this._status = props.status;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new FeatureCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: FeatureAggregate.name,
            eventType: FeatureCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the feature.
   *
   * @param props - The properties to update the feature.
   * @param props.key - The key of the feature.
   * @param props.name - The name of the feature.
   * @param props.description - The description of the feature.
   * @param props.status - The status of the feature.
   * @param generateEvent - Whether to generate the feature updated event. Default is true.
   */
  public update(props: IFeatureUpdateDto, generateEvent: boolean = true) {
    // 01: Update the properties
    this._key = props.key !== undefined ? props.key : this._key;
    this._name = props.name !== undefined ? props.name : this._name;
    this._description =
      props.description !== undefined ? props.description : this._description;
    this._status = props.status !== undefined ? props.status : this._status;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new FeatureUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: FeatureAggregate.name,
            eventType: FeatureUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Change the status of the feature.
   *
   * @param status - The new status of the feature.
   * @param generateEvent - Whether to generate the feature status changed event. Default is true.
   */
  public changeStatus(
    status: FeatureStatusValueObject,
    generateEvent: boolean = true,
  ) {
    this._status = status;
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new FeatureStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: FeatureAggregate.name,
            eventType: FeatureStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the feature.
   *
   * @param generateEvent - Whether to generate the feature deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new FeatureDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: FeatureAggregate.name,
            eventType: FeatureDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Get the id of the feature.
   *
   * @returns The id of the feature.
   */
  public get id(): FeatureUuidValueObject {
    return this._id;
  }

  /**
   * Get the key of the feature.
   *
   * @returns The key of the feature.
   */
  public get key(): FeatureKeyValueObject {
    return this._key;
  }

  /**
   * Get the name of the feature.
   *
   * @returns The name of the feature.
   */
  public get name(): FeatureNameValueObject {
    return this._name;
  }

  /**
   * Get the description of the feature.
   *
   * @returns The description of the feature.
   */
  public get description(): FeatureDescriptionValueObject | null {
    return this._description;
  }

  /**
   * Get the status of the feature.
   *
   * @returns The status of the feature.
   */
  public get status(): FeatureStatusValueObject {
    return this._status;
  }

  /**
   * Convert the feature aggregate to primitives.
   *
   * @returns The primitives of the feature.
   */
  public toPrimitives(): FeaturePrimitives {
    return {
      id: this._id.value,
      key: this._key.value,
      name: this._name.value,
      description: this._description ? this._description.value : null,
      status: this._status.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
