import { IpValueObject } from '@/shared/domain/value-objects/ip/ip.vo';
import { InvalidIpException } from '@/shared/domain/exceptions/value-objects/invalid-ip/invalid-ip.exception';

describe('IpValueObject', () => {
  describe('constructor', () => {
    it('should create an IP value object with valid IPv4', () => {
      const ip = new IpValueObject('192.168.1.1');

      expect(ip.value).toBe('192.168.1.1');
    });

    it('should create an IP value object with valid IPv6', () => {
      const ip = new IpValueObject('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

      expect(ip.value).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    });

    it('should trim whitespace', () => {
      const ip = new IpValueObject('  192.168.1.1  ');

      expect(ip.value).toBe('192.168.1.1');
    });

    it('should throw InvalidIpException for empty string', () => {
      expect(() => new IpValueObject('')).toThrow(InvalidIpException);
    });

    it('should throw InvalidIpException for invalid IPv4', () => {
      expect(() => new IpValueObject('256.256.256.256')).toThrow(
        InvalidIpException,
      );
      expect(() => new IpValueObject('192.168.1')).toThrow(
        InvalidIpException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal IPs', () => {
      const ip1 = new IpValueObject('192.168.1.1');
      const ip2 = new IpValueObject('192.168.1.1');

      expect(ip1.equals(ip2)).toBe(true);
    });

    it('should return false for different IPs', () => {
      const ip1 = new IpValueObject('192.168.1.1');
      const ip2 = new IpValueObject('192.168.1.2');

      expect(ip1.equals(ip2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if IP is IPv4', () => {
      expect(new IpValueObject('192.168.1.1').isIPv4()).toBe(true);
      expect(
        new IpValueObject('2001:0db8:85a3:0000:0000:8a2e:0370:7334').isIPv4(),
      ).toBe(false);
    });

    it('should check if IP is IPv6', () => {
      expect(
        new IpValueObject('2001:0db8:85a3:0000:0000:8a2e:0370:7334').isIPv6(),
      ).toBe(true);
      expect(new IpValueObject('192.168.1.1').isIPv6()).toBe(false);
    });

    it('should check if IP is private', () => {
      expect(new IpValueObject('192.168.1.1').isPrivate()).toBe(true);
      expect(new IpValueObject('10.0.0.1').isPrivate()).toBe(true);
      expect(new IpValueObject('8.8.8.8').isPrivate()).toBe(false);
    });

    it('should check if IP is loopback', () => {
      expect(new IpValueObject('127.0.0.1').isLoopback()).toBe(true);
      expect(new IpValueObject('192.168.1.1').isLoopback()).toBe(false);
    });

    it('should get IP version', () => {
      expect(new IpValueObject('192.168.1.1').getVersion()).toBe(4);
      expect(
        new IpValueObject('2001:0db8:85a3:0000:0000:8a2e:0370:7334').getVersion(),
      ).toBe(6);
    });
  });
});

