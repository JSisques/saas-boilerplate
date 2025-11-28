/**
 * Base Domain Exception
 * This is the base class for all domain layer exceptions.
 * It provides a common structure for domain layer-specific errors.
 */
export class BaseDomainException extends Error {
  public readonly layer: string = 'Domain';
  public readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
  }

  /**
   * Gets a detailed error description
   * @returns A formatted error description
   */
  public getDetailedMessage(): string {
    return `[${this.layer}] ${this.name}: ${this.message}`;
  }

  /**
   * Converts the exception to JSON
   * @returns JSON representation of the exception
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      layer: this.layer,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
