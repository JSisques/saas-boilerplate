import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * StoragePathValueObject represents the path of the stored file.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class StoragePathValueObject extends StringValueObject {
  constructor(value: string) {
    super(value, {
      minLength: 1,
      maxLength: 1000,
      allowEmpty: false,
      trim: true,
    });
  }

  /**
   * Gets the directory path (without filename)
   * @returns The directory path
   */
  public getDirectory(): string {
    const lastSlash = this.value.lastIndexOf('/');
    return lastSlash !== -1 ? this.value.substring(0, lastSlash) : '';
  }

  /**
   * Gets the filename from the path
   * @returns The filename
   */
  public getFilename(): string {
    const lastSlash = this.value.lastIndexOf('/');
    return lastSlash !== -1 ? this.value.substring(lastSlash + 1) : this.value;
  }

  /**
   * Gets the file extension
   * @returns The file extension (without dot)
   */
  public getExtension(): string {
    const filename = this.getFilename();
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot + 1) : '';
  }

  /**
   * Joins the path with additional segments
   * @param segments - Additional path segments
   * @returns A new StoragePathValueObject with joined path
   */
  public join(...segments: string[]): StoragePathValueObject {
    const parts = [this.value, ...segments].filter(Boolean);
    return new StoragePathValueObject(parts.join('/'));
  }
}
