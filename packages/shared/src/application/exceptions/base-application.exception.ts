/**
 * Base Application Exception
 * This is the base class for all application exceptions.
 * It provides a common structure for application-specific errors.
 */
export class BaseApplicationException extends Error {
  public readonly domain: string = 'Application';
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
    return `[${this.domain}] ${this.name}: ${this.message}`;
  }

  /**
   * Converts the exception to JSON
   * @returns JSON representation of the exception
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      domain: this.domain,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
