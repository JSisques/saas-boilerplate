import { TenantPrimaryColorValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-primary-color/tenant-primary-color.vo';
import { ColorValueObject } from '@/shared/domain/value-objects/color/color.vo';

describe('TenantPrimaryColorValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantPrimaryColorValueObject', () => {
      const color = new TenantPrimaryColorValueObject('#FF0000');
      expect(color).toBeInstanceOf(TenantPrimaryColorValueObject);
      expect(color).toBeInstanceOf(ColorValueObject);
      expect(color.value).toBe('#ff0000');
    });

    it('should create a TenantPrimaryColorValueObject with lowercase hex', () => {
      const color = new TenantPrimaryColorValueObject('#ff0000');
      expect(color.value).toBe('#ff0000');
    });

    it('should create a TenantPrimaryColorValueObject with short hex', () => {
      const color = new TenantPrimaryColorValueObject('#F00');
      expect(color.value).toBe('#f00');
    });
  });

  describe('equals', () => {
    it('should return true for equal colors', () => {
      const color1 = new TenantPrimaryColorValueObject('#FF0000');
      const color2 = new TenantPrimaryColorValueObject('#FF0000');
      expect(color1.equals(color2)).toBe(true);
    });

    it('should return false for different colors', () => {
      const color1 = new TenantPrimaryColorValueObject('#FF0000');
      const color2 = new TenantPrimaryColorValueObject('#00FF00');
      expect(color1.equals(color2)).toBe(false);
    });
  });
});
