import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';

describe('TenantDatabaseSchemaVersionValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantDatabaseSchemaVersionValueObject with a valid version', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version.value).toBe('1.0.0');
    });

    it('should trim whitespace from the version', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('  1.0.0  ');
      expect(version.value).toBe('1.0.0');
    });

    it('should create a TenantDatabaseSchemaVersionValueObject with empty string (default behavior)', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('');
      expect(version.value).toBe('');
    });

    it('should create a TenantDatabaseSchemaVersionValueObject with only whitespace (trims to empty)', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('   ');
      expect(version.value).toBe('');
    });

    it('should create a TenantDatabaseSchemaVersionValueObject with null value (converts to empty string)', () => {
      const version = new TenantDatabaseSchemaVersionValueObject(null as any);
      expect(version.value).toBe('');
    });

    it('should create a TenantDatabaseSchemaVersionValueObject with undefined value (converts to empty string)', () => {
      const version = new TenantDatabaseSchemaVersionValueObject(
        undefined as any,
      );
      expect(version.value).toBe('');
    });

    it('should handle semantic versioning format', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('2.1.3');
      expect(version.value).toBe('2.1.3');
    });

    it('should handle version with pre-release identifiers', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0-beta');
      expect(version.value).toBe('1.0.0-beta');
    });

    it('should handle version with build metadata', () => {
      const version = new TenantDatabaseSchemaVersionValueObject(
        '1.0.0+build.1',
      );
      expect(version.value).toBe('1.0.0+build.1');
    });
  });

  describe('equals', () => {
    it('should return true for equal versions', () => {
      const version1 = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      const version2 = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version1.equals(version2)).toBe(true);
    });

    it('should return false for different versions', () => {
      const version1 = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      const version2 = new TenantDatabaseSchemaVersionValueObject('2.0.0');
      expect(version1.equals(version2)).toBe(false);
    });

    it('should return true for versions with different whitespace (after trim)', () => {
      const version1 = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      const version2 = new TenantDatabaseSchemaVersionValueObject('  1.0.0  ');
      expect(version1.equals(version2)).toBe(true);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version.length()).toBe(5);
    });

    it('should check if empty correctly', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version.isEmpty()).toBe(false);
      expect(version.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version.contains('1.0')).toBe(true);
      expect(version.contains('2.0')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version.startsWith('1')).toBe(true);
      expect(version.startsWith('2')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const version = new TenantDatabaseSchemaVersionValueObject('1.0.0');
      expect(version.endsWith('0.0')).toBe(true);
      expect(version.endsWith('1.0')).toBe(false);
    });
  });
});
