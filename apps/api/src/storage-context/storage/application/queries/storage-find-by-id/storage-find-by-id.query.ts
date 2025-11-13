import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { IStorageFindByIdQueryDto } from '@/storage-context/storage/application/dtos/queries/storage-find-by-id/storage-find-by-id-query.dto';

export class StorageFindByIdQuery {
  readonly id: StorageUuidValueObject;

  constructor(props: IStorageFindByIdQueryDto) {
    this.id = new StorageUuidValueObject(props.id);
  }
}
