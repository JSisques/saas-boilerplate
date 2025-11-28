import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * StorageFileSizeValueObject represents the file size in bytes.
 * It extends the NumberValueObject to leverage common number functionalities.
 */
export class StorageFileSizeValueObject extends NumberValueObject {
  constructor(value: number) {
    super(value, {
      min: 0,
    });
  }

  /**
   * Converts bytes to kilobytes
   * @returns Size in kilobytes
   */
  public toKilobytes(): number {
    return this.value / 1024;
  }

  /**
   * Converts bytes to megabytes
   * @returns Size in megabytes
   */
  public toMegabytes(): number {
    return this.value / (1024 * 1024);
  }

  /**
   * Converts bytes to gigabytes
   * @returns Size in gigabytes
   */
  public toGigabytes(): number {
    return this.value / (1024 * 1024 * 1024);
  }

  /**
   * Gets human-readable file size
   * @returns Formatted string (e.g., "1.5 MB")
   */
  public toHumanReadable(): string {
    const bytes = this.value;
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
