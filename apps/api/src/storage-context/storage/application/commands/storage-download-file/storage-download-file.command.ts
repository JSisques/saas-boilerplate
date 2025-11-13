import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { IStorageDownloadFileCommandDto } from '@/storage-context/storage/application/dtos/commands/storage-download-file/storage-download-file-command.dto';

/**
 * Command class for downloading a file by id.
 *
 * @class StorageDownloadFileCommand
 * @param props - The properties for the command.
 * @property {StorageUuidValueObject} id - The id of the storage to download.
 */
export class StorageDownloadFileCommand {
  readonly id: StorageUuidValueObject;

  constructor(props: IStorageDownloadFileCommandDto) {
    this.id = new StorageUuidValueObject(props.id);
  }
}
