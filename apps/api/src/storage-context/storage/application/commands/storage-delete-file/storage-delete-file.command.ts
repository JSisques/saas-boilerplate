import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { IStorageDeleteFileCommandDto } from '@/storage-context/storage/application/dtos/commands/storage-delete-file/storage-delete-file-command.dto';

/**
 * Command class for deleting a file by id.
 *
 * @class StorageDeleteFileCommand
 * @param props - The properties for the command.
 * @property {StorageUuidValueObject} id - The id of the storage to delete.
 */
export class StorageDeleteFileCommand {
  readonly id: StorageUuidValueObject;

  /**
   * Constructor for the StorageDeleteFileCommand class.
   *
   * @param props - The properties for the command.
   * @property {StorageUuidValueObject} id - The id of the storage to delete.
   */
  constructor(props: IStorageDeleteFileCommandDto) {
    this.id = new StorageUuidValueObject(props.id);
  }
}
