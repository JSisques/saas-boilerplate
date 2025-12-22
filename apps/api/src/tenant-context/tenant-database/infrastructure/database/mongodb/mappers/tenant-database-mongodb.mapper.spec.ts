import { TenantDatabaseMongoDBMapper } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/mappers/tenant-database-mongodb.mapper';
import { TenantDatabaseViewModelFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-view-model/tenant-database-view-model.factory';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseMongoDbDto } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/dtos/tenant-database-mongodb.dto';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';

describe('TenantDatabaseMongoDBMapper', () => {
  let mapper: TenantDatabaseMongoDBMapper;
  let mockTenantDatabaseViewModelFactory: jest.Mocked<TenantDatabaseViewModelFactory>;

  beforeEach(() => {
    mockTenantDatabaseViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseViewModelFactory>;

    mapper = new TenantDatabaseMongoDBMapper(
      mockTenantDatabaseViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const lastMigrationAt = new Date('2024-01-01T10:00:00Z');

      const mongoDoc: TenantDatabaseMongoDbDto = {
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockTenantDatabaseViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockTenantDatabaseViewModelFactory.create).toHaveBeenCalledWith({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
      expect(mockTenantDatabaseViewModelFactory.create).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert MongoDB document with null optional properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const mongoDoc: TenantDatabaseMongoDbDto = {
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockTenantDatabaseViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockTenantDatabaseViewModelFactory.create).toHaveBeenCalledWith({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert MongoDB document with error message', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const mongoDoc: TenantDatabaseMongoDbDto = {
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Connection timeout',
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Connection timeout',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockTenantDatabaseViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockTenantDatabaseViewModelFactory.create).toHaveBeenCalledWith({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Connection timeout',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const lastMigrationAt = new Date('2024-01-01T10:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: lastMigrationAt,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert view model with null optional properties', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert view model with error message', () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174001';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Migration failed',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: tenantDatabaseId,
        tenantId: tenantId,
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Migration failed',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });
  });
});
