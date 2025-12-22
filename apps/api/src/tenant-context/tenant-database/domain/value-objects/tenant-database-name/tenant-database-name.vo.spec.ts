import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';

describe('TenantDatabaseNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantDatabaseNameValueObject with a valid name', () => {
      const name = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name.value).toBe('tenant_db_001');
    });

    it('should trim whitespace from the name', () => {
      const name = new TenantDatabaseNameValueObject('  tenant_db_001  ');
      expect(name.value).toBe('tenant_db_001');
    });

    it('should create a TenantDatabaseNameValueObject with empty string (default behavior)', () => {
      const name = new TenantDatabaseNameValueObject('');
      expect(name.value).toBe('');
    });

    it('should create a TenantDatabaseNameValueObject with only whitespace (trims to empty)', () => {
      const name = new TenantDatabaseNameValueObject('   ');
      expect(name.value).toBe('');
    });

    it('should create a TenantDatabaseNameValueObject with null value (converts to empty string)', () => {
      const name = new TenantDatabaseNameValueObject(null as any);
      expect(name.value).toBe('');
    });

    it('should create a TenantDatabaseNameValueObject with undefined value (converts to empty string)', () => {
      const name = new TenantDatabaseNameValueObject(undefined as any);
      expect(name.value).toBe('');
    });

    it('should handle long database names', () => {
      const longName =
        'tenant_database_with_very_long_name_that_exceeds_normal_length';
      const name = new TenantDatabaseNameValueObject(longName);
      expect(name.value).toBe(longName);
    });

    it('should handle database names with special characters', () => {
      const nameWithSpecialChars = 'tenant-db_001';
      const name = new TenantDatabaseNameValueObject(nameWithSpecialChars);
      expect(name.value).toBe(nameWithSpecialChars);
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = new TenantDatabaseNameValueObject('tenant_db_001');
      const name2 = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = new TenantDatabaseNameValueObject('tenant_db_001');
      const name2 = new TenantDatabaseNameValueObject('tenant_db_002');
      expect(name1.equals(name2)).toBe(false);
    });

    it('should return true for names with different whitespace (after trim)', () => {
      const name1 = new TenantDatabaseNameValueObject('tenant_db_001');
      const name2 = new TenantDatabaseNameValueObject('  tenant_db_001  ');
      expect(name1.equals(name2)).toBe(true);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const name = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name.length()).toBe(13);
    });

    it('should check if empty correctly', () => {
      const name = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name.isEmpty()).toBe(false);
      expect(name.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const name = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name.contains('tenant')).toBe(true);
      expect(name.contains('db_002')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const name = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name.startsWith('tenant')).toBe(true);
      expect(name.startsWith('db')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const name = new TenantDatabaseNameValueObject('tenant_db_001');
      expect(name.endsWith('001')).toBe(true);
      expect(name.endsWith('002')).toBe(false);
    });
  });
});
