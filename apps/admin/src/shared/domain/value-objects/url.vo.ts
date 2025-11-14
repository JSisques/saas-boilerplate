import { InvalidUrlException } from '@/shared/domain/exceptions/value-objects/invalid-url.exception';

/**
 * Url Value Object
 * This value object is responsible for encapsulating the URL of a resource.
 * It ensures that the URL is a valid URL and that it is not empty.
 * @param value - The URL of the resource.
 * @returns A new instance of the UrlValueObject.
 */
export class UrlValueObject {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: UrlValueObject): boolean {
    return this._value === other._value;
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkIsUrl(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value) {
      throw new InvalidUrlException('URL cannot be empty');
    }
  }

  private checkIsUrl(value: string): void {
    if (!value.startsWith('http')) {
      throw new InvalidUrlException('URL must start with http');
    }
  }
}
