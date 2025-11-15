/**
 * A value object representing a date.
 * This class encapsulates a Date instance and provides methods for comparison and formatting.
 */
export class DateValueObject {
  private readonly _value: Date;

  constructor(date?: Date) {
    this._value = date ?? new Date();
  }

  public get value(): Date {
    return this._value;
  }

  /**
   * @description Converts the date to an ISO string.
   * @returns The ISO string representation of the date.
   */
  public toISOString(): string {
    return this._value.toISOString();
  }

  /**
   *
   * @param other - Another DateValueObject to compare with.
   * @description Compares this date with another DateValueObject for equality.
   * @returns True if the dates are equal, false otherwise.
   */
  public equals(other: DateValueObject): boolean {
    return this._value.getTime() === other.value.getTime();
  }
}
