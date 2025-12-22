import { TenantDatabaseCreatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-created/tenant-database-created.event';
import { TenantDatabaseCreatedEventHandler } from '@/tenant-context/tenant-database/application/event-handlers/tenant-database-created/tenant-database-created.event-handler';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseViewModelFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-view-model/tenant-database-view-model.factory';
import { TenantDatabasePrimitives } from '@/tenant-context/tenant-database/domain/primitives/tenant-database.primitives';
import { TenantDatabaseReadRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';

describe('TenantDatabaseCreatedEventHandler', () => {
  let handler: TenantDatabaseCreatedEventHandler;
  let mockTenantDatabaseReadRepository: jest.Mocked<TenantDatabaseReadRepository>;
  let mockTenantDatabaseViewModelFactory: jest.Mocked<TenantDatabaseViewModelFactory>;

  beforeEach(() => {
    mockTenantDatabaseReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseReadRepository>;

    mockTenantDatabaseViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseViewModelFactory>;

    handler = new TenantDatabaseCreatedEventHandler(
      mockTenantDatabaseReadRepository,
      mockTenantDatabaseViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save tenant database view model when event is handled', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantDatabasePrimitives: TenantDatabasePrimitives = {
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const event = new TenantDatabaseCreatedEvent(
        {
          aggregateId: tenantDatabaseId,
          aggregateType: 'TenantDatabaseAggregate',
          eventType: 'TenantDatabaseCreatedEvent',
        },
        tenantDatabasePrimitives,
      );

      const mockViewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.ACTIVE,
        schemaVersion: '1.0.0',
        lastMigrationAt: new Date('2024-01-01T10:00:00Z'),
        errorMessage: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });

      mockTenantDatabaseViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockTenantDatabaseReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockTenantDatabaseViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(tenantDatabasePrimitives);
      expect(
        mockTenantDatabaseViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
      expect(mockTenantDatabaseReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
      expect(mockTenantDatabaseReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with null optional fields', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantDatabasePrimitives: TenantDatabasePrimitives = {
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const event = new TenantDatabaseCreatedEvent(
        {
          aggregateId: tenantDatabaseId,
          aggregateType: 'TenantDatabaseAggregate',
          eventType: 'TenantDatabaseCreatedEvent',
        },
        tenantDatabasePrimitives,
      );

      const mockViewModel = new TenantDatabaseViewModel({
        id: tenantDatabaseId,
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.PROVISIONING,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });

      mockTenantDatabaseViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockTenantDatabaseReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockTenantDatabaseViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(tenantDatabasePrimitives);
      expect(mockTenantDatabaseReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });
  });
});
