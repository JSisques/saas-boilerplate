import { InvalidIpException } from '@repo/shared/domain/exceptions/value-objects/invalid-ip.exception';

/**
 * IP Value Object
 * This value object is responsible for encapsulating IP addresses.
 * It supports both IPv4 and IPv6 addresses.
 * @param value - The IP address.
 * @returns A new instance of the IpValueObject.
 */
export class IpValueObject {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: IpValueObject): boolean {
    return this._value === other._value;
  }

  /**
   * Checks if the IP is IPv4
   * @returns True if IPv4
   */
  public isIPv4(): boolean {
    return this._value.includes('.') && !this._value.includes(':');
  }

  /**
   * Checks if the IP is IPv6
   * @returns True if IPv6
   */
  public isIPv6(): boolean {
    return this._value.includes(':');
  }

  /**
   * Checks if the IP is a private address
   * @returns True if private
   */
  public isPrivate(): boolean {
    if (this.isIPv4()) {
      return this.isPrivateIPv4();
    }
    if (this.isIPv6()) {
      return this.isPrivateIPv6();
    }
    return false;
  }

  /**
   * Checks if the IP is a loopback address
   * @returns True if loopback
   */
  public isLoopback(): boolean {
    if (this.isIPv4()) {
      return this._value.startsWith('127.') || this._value === '::1';
    }
    if (this.isIPv6()) {
      return this._value === '::1';
    }
    return false;
  }

  /**
   * Gets the IP version (4 or 6)
   * @returns The IP version
   */
  public getVersion(): 4 | 6 {
    return this.isIPv4() ? 4 : 6;
  }

  private validate(value: string): void {
    this.checkIsEmpty(value);
    this.checkIsValidIp(value);
  }

  private checkIsEmpty(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidIpException('IP address cannot be empty');
    }
  }

  private checkIsValidIp(value: string): void {
    const trimmedValue = value.trim();

    if (this.isValidIPv4(trimmedValue) || this.isValidIPv6(trimmedValue)) {
      return;
    }

    throw new InvalidIpException('Invalid IP address format');
  }

  private isValidIPv4(ip: string): boolean {
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipv4Pattern);

    if (!match) return false;

    return match.slice(1).every((octet) => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }

  private isValidIPv6(ip: string): boolean {
    // Simplified IPv6 validation - full validation would be more complex
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const ipv6CompressedPattern =
      /^([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;

    return ipv6Pattern.test(ip) || ipv6CompressedPattern.test(ip);
  }

  private isPrivateIPv4(): boolean {
    const parts = this._value.split('.').map(Number);

    // 10.0.0.0/8
    if (parts[0] === 10) return true;

    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;

    return false;
  }

  private isPrivateIPv6(): boolean {
    // fc00::/7 (unique local addresses)
    return this._value.startsWith('fc') || this._value.startsWith('fd');
  }
}
