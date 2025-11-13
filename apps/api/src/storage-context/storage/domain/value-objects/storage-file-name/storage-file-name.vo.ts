import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * StorageFileNameValueObject represents the file name of the storage.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class StorageFileNameValueObject extends StringValueObject {
  constructor(value: string) {
    super(value, {
      minLength: 1,
      maxLength: 255,
      allowEmpty: false,
      trim: true,
    });
  }
}
