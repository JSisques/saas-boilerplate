import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { randomUUID } from 'crypto';

export abstract class BaseEvent<TData> {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly ocurredAt: Date;
  readonly isReplay?: boolean;
  protected readonly _data: TData;

  constructor(metadata: IEventMetadata, data: TData) {
    this.eventId = randomUUID();
    this.eventType = metadata.eventType;
    this.aggregateId = metadata.aggregateId;
    this.aggregateType = metadata.aggregateType;
    this.ocurredAt = new Date();
    this.isReplay = metadata.isReplay;
    this._data = data;
  }

  public get data(): TData {
    return this._data;
  }
}
