import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class BaseAggregate extends AggregateRoot {
  protected readonly _createdAt: DateValueObject;
  protected _updatedAt: DateValueObject;

  constructor(createdAt: DateValueObject, updatedAt: DateValueObject) {
    super();
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Get the created at of the aggregate.
   *
   * @returns The created at of the aggregate.
   */
  public get createdAt(): DateValueObject {
    return this._createdAt;
  }

  /**
   * Get the updated at of the aggregate.
   *
   * @returns The updated at of the aggregate.
   */
  public get updatedAt(): DateValueObject {
    return this._updatedAt;
  }
}
