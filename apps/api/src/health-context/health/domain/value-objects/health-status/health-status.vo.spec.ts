import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('HealthStatusValueObject', () => {
  it('should accept valid enum values', () => {
    const valueObject = new HealthStatusValueObject(HealthStatusEnum.OK);

    expect(valueObject.value).toBe(HealthStatusEnum.OK);
    expect(valueObject.is(HealthStatusEnum.OK)).toBe(true);
    expect(valueObject.getKey()).toBe('OK');
  });

  it('should throw when value is invalid', () => {
    expect(() => new HealthStatusValueObject('INVALID')).toThrow(
      InvalidEnumValueException,
    );
  });

  it('should compare equality with other value objects', () => {
    const valueObject = new HealthStatusValueObject(HealthStatusEnum.WARNING);
    const other = new HealthStatusValueObject(HealthStatusEnum.WARNING);

    expect(valueObject.equals(other)).toBe(true);
    expect(
      valueObject.equals(new HealthStatusValueObject(HealthStatusEnum.ERROR)),
    ).toBe(false);
  });
});
