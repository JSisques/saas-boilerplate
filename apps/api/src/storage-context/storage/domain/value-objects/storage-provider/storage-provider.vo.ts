import { EnumValueObject } from '@/shared/domain/value-objects/enum.vo';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';

/**
 * StorageProviderValueObject represents the storage provider.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class StorageProviderValueObject extends EnumValueObject<
  typeof StorageProviderEnum
> {
  protected get enumObject(): typeof StorageProviderEnum {
    return StorageProviderEnum;
  }
}
