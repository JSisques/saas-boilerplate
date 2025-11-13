import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * StorageMimeTypeValueObject represents the MIME type of the storage file.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class StorageMimeTypeValueObject extends StringValueObject {
  constructor(value: string) {
    super(value, {
      minLength: 1,
      maxLength: 100,
      allowEmpty: false,
      trim: true,
      pattern:
        /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/,
    });
  }

  /**
   * Gets the main type (e.g., "image" from "image/png")
   * @returns The main MIME type
   */
  public getMainType(): string {
    return this.value.split('/')[0];
  }

  /**
   * Gets the subtype (e.g., "png" from "image/png")
   * @returns The MIME subtype
   */
  public getSubType(): string {
    return this.value.split('/')[1];
  }

  /**
   * Checks if the MIME type is an image
   * @returns True if it's an image
   */
  public isImage(): boolean {
    return this.getMainType() === 'image';
  }

  /**
   * Checks if the MIME type is a video
   * @returns True if it's a video
   */
  public isVideo(): boolean {
    return this.getMainType() === 'video';
  }

  /**
   * Checks if the MIME type is audio
   * @returns True if it's audio
   */
  public isAudio(): boolean {
    return this.getMainType() === 'audio';
  }

  /**
   * Checks if the MIME type is a document
   * @returns True if it's a document
   */
  public isDocument(): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return documentTypes.includes(this.value);
  }
}
