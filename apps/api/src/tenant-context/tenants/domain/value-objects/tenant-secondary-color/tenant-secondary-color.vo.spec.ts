import { TenantSecondaryColorValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-secondary-color/tenant-secondary-color.vo';
import { ColorValueObject } from '@/shared/domain/value-objects/color/color.vo';

describe('TenantSecondaryColorValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantSecondaryColorValueObject', () => {
      const color = new TenantSecondaryColorValueObject('#00FF00');
      expect(color).toBeInstanceOf(TenantSecondaryColorValueObject);
      expect(color).toBeInstanceOf(ColorValueObject);
      expect(color.value).toBe('#00FF00');
    });

    it('should create a TenantSecondaryColorValueObject with lowercase hex', () => {
      const color = new TenantSecondaryColorValueObject('#00ff00');
      expect(color.value).toBe('#00ff00');
    });

    it('should create a TenantSecondaryColorValueObject with short hex', () => {
      const color = new TenantSecondaryColorValueObject('#0F0');
      expect(color.value).toBe('#0F0');
    });
  });

  describe('equals', () => {
    it('should return true for equal colors', () => {
      const color1 = new TenantSecondaryColorValueObject('#00FF00');
      const color2 = new TenantSecondaryColorValueObject('#00FF00');
      expect(color1.equals(color2)).toBe(true);
    });

    it('should return false for different colors', () => {
      const color1 = new TenantSecondaryColorValueObject('#00FF00');
      const color2 = new TenantSecondaryColorValueObject('#0000FF');
      expect(color1.equals(color2)).toBe(false);
    });
  });
});
