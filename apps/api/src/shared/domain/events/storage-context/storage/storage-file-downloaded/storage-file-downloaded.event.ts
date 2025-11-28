import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IStorageEventData } from '@/shared/domain/events/storage-context/storage/interfaces/storage-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class StorageFileDownloadedEvent extends BaseEvent<IStorageEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IStorageEventData) {
    super(metadata, data);
  }
}
