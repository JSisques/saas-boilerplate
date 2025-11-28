import { IStorageUploadFileCommandProps } from '@/storage-context/storage/application/dtos/commands/storage-upload-file/storage-upload-file-command.dto';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';

export class StorageUploadFileCommand {
  readonly buffer: Buffer;
  readonly fileName: StorageFileNameValueObject;
  readonly mimetype: StorageMimeTypeValueObject;
  readonly size: StorageFileSizeValueObject;

  constructor(props: IStorageUploadFileCommandProps) {
    this.buffer = props.buffer;
    this.fileName = new StorageFileNameValueObject(props.fileName);
    this.mimetype = new StorageMimeTypeValueObject(props.mimetype);
    this.size = new StorageFileSizeValueObject(props.size);
  }
}
