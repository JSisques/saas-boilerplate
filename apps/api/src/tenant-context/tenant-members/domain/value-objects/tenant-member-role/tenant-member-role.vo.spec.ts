import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';

describe('TenantMemberRoleValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantMemberRoleValueObject with OWNER role', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER);
      expect(role.value).toBe(TenantMemberRoleEnum.OWNER);
    });

    it('should create a valid TenantMemberRoleValueObject with ADMIN role', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN);
      expect(role.value).toBe(TenantMemberRoleEnum.ADMIN);
    });

    it('should create a valid TenantMemberRoleValueObject with MEMBER role', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER);
      expect(role.value).toBe(TenantMemberRoleEnum.MEMBER);
    });

    it('should create a valid TenantMemberRoleValueObject with GUEST role', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.GUEST);
      expect(role.value).toBe(TenantMemberRoleEnum.GUEST);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new TenantMemberRoleValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new TenantMemberRoleValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid role', () => {
      expect(() => {
        new TenantMemberRoleValueObject('INVALID_ROLE' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new TenantMemberRoleValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new TenantMemberRoleValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal roles', () => {
      const role1 = new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN);
      const role2 = new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN);
      expect(role1.equals(role2)).toBe(true);
    });

    it('should return false for different roles', () => {
      const role1 = new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN);
      const role2 = new TenantMemberRoleValueObject(
        TenantMemberRoleEnum.MEMBER,
      );
      expect(role1.equals(role2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER);
      expect(role.value).toBe('MEMBER');
    });

    it('should validate all enum values correctly', () => {
      const ownerRole = new TenantMemberRoleValueObject(
        TenantMemberRoleEnum.OWNER,
      );
      expect(ownerRole.value).toBe('OWNER');

      const adminRole = new TenantMemberRoleValueObject(
        TenantMemberRoleEnum.ADMIN,
      );
      expect(adminRole.value).toBe('ADMIN');

      const memberRole = new TenantMemberRoleValueObject(
        TenantMemberRoleEnum.MEMBER,
      );
      expect(memberRole.value).toBe('MEMBER');

      const guestRole = new TenantMemberRoleValueObject(
        TenantMemberRoleEnum.GUEST,
      );
      expect(guestRole.value).toBe('GUEST');
    });

    it('should support is method to check specific enum value', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN);
      expect(role.is(TenantMemberRoleEnum.ADMIN)).toBe(true);
      expect(role.is(TenantMemberRoleEnum.MEMBER)).toBe(false);
    });

    it('should support isOneOf method to check multiple enum values', () => {
      const role = new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN);
      expect(
        role.isOneOf([TenantMemberRoleEnum.OWNER, TenantMemberRoleEnum.ADMIN]),
      ).toBe(true);
      expect(
        role.isOneOf([TenantMemberRoleEnum.MEMBER, TenantMemberRoleEnum.GUEST]),
      ).toBe(false);
    });
  });
});
