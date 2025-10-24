import { EventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { randomUUID } from 'crypto';

export abstract class BaseIntegrationEvent<TData> {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly ocurredAt: Date;
  protected readonly _data: TData;

  constructor(metadata: EventMetadata, data: TData) {
    this.eventId = randomUUID();
    this.eventType = metadata.eventType;
    this.aggregateId = metadata.aggregateId;
    this.aggregateType = metadata.aggregateType;
    this.ocurredAt = new Date();
    this._data = data;
  }

  public get data(): TData {
    return this._data;
  }
}
