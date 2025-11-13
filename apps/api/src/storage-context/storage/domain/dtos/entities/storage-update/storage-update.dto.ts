import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';

export interface IStorageUpdateDto {
  fileName?: StorageFileNameValueObject;
  fileSize?: StorageFileSizeValueObject;
  mimeType?: StorageMimeTypeValueObject;
  provider?: StorageProviderValueObject;
  url?: StorageUrlValueObject;
  path?: StoragePathValueObject;
}
