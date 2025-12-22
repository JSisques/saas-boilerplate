import { TenantDatabaseCreatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-created/tenant-database-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { ITenantDatabaseCreateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-create/tenant-database-create.dto';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import { TenantDatabasePrimitives } from '@/tenant-context/tenant-database/domain/primitives/tenant-database.primitives';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

describe('TenantDatabaseAggregateFactory', () => {
  let factory: TenantDatabaseAggregateFactory;

  beforeEach(() => {
    factory = new TenantDatabaseAggregateFactory();
  });

  describe('create', () => {
    it('should create a TenantDatabaseAggregate from DTO with all fields and generate event by default', () => {
      const dto: ITenantDatabaseCreateDto = {
        id: new TenantDatabaseUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        databaseName: new TenantDatabaseNameValueObject('tenant_db_001'),
        readDatabaseName: new TenantDatabaseNameValueObject(
          'tenant_db_read_001',
        ),
        status: new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.ACTIVE,
        ),
        schemaVersion: new TenantDatabaseSchemaVersionValueObject('1.0.0'),
        lastMigrationAt: new TenantDatabaseLastMigrationAtValueObject(
          new Date('2024-01-01T10:00:00Z'),
        ),
        errorMessage: null,
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.databaseName.value).toBe(dto.databaseName.value);
      expect(aggregate.readDatabaseName.value).toBe(dto.readDatabaseName.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.schemaVersion?.value).toBe(dto.schemaVersion?.value);
      expect(aggregate.lastMigrationAt?.value).toEqual(
        dto.lastMigrationAt?.value,
      );
      expect(aggregate.errorMessage).toBeNull();

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(TenantDatabaseCreatedEvent);
    });

    it('should create a TenantDatabaseAggregate from DTO without generating event when generateEvent is false', () => {
      const dto: ITenantDatabaseCreateDto = {
        id: new TenantDatabaseUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        databaseName: new TenantDatabaseNameValueObject('tenant_db_001'),
        readDatabaseName: new TenantDatabaseNameValueObject(
          'tenant_db_read_001',
        ),
        status: new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.PROVISIONING,
        ),
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.databaseName.value).toBe(dto.databaseName.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a TenantDatabaseAggregate from DTO with null optional fields', () => {
      const dto: ITenantDatabaseCreateDto = {
        id: new TenantDatabaseUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        databaseName: new TenantDatabaseNameValueObject('tenant_db_001'),
        readDatabaseName: new TenantDatabaseNameValueObject(
          'tenant_db_read_001',
        ),
        status: new TenantDatabaseStatusValueObject(
          TenantDatabaseStatusEnum.PROVISIONING,
        ),
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: null,
        createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.schemaVersion).toBeNull();
      expect(aggregate.lastMigrationAt).toBeNull();
      expect(aggregate.errorMessage).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a TenantDatabaseAggregate from primitives with all fields', () => {
      const primitives: TenantDatabasePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.tenantId.value).toBe(primitives.tenantId);
      expect(aggregate.databaseName.value).toBe(primitives.databaseName);
      expect(aggregate.readDatabaseName.value).toBe(
        primitives.readDatabaseName,
      );
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.schemaVersion?.value).toBe(primitives.schemaVersion);
      expect(aggregate.lastMigrationAt?.value).toEqual(
        primitives.lastMigrationAt,
      );
      expect(aggregate.errorMessage).toBeNull();
    });

    it('should create a TenantDatabaseAggregate from primitives with null optional fields', () => {
      const primitives: TenantDatabasePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.schemaVersion).toBeNull();
      expect(aggregate.lastMigrationAt).toBeNull();
      expect(aggregate.errorMessage).toBeNull();
    });

    it('should create a TenantDatabaseAggregate from primitives with error message', () => {
      const primitives: TenantDatabasePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
        readDatabaseName: 'tenant_db_read_001',
        status: TenantDatabaseStatusEnum.FAILED,
        schemaVersion: null,
        lastMigrationAt: null,
        errorMessage: 'Connection timeout',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(TenantDatabaseAggregate);
      expect(aggregate.errorMessage?.value).toBe('Connection timeout');
      expect(aggregate.status.value).toBe(TenantDatabaseStatusEnum.FAILED);
    });

    it('should create a TenantDatabaseAggregate from primitives with all status values', () => {
      const statuses = [
        TenantDatabaseStatusEnum.PROVISIONING,
        TenantDatabaseStatusEnum.ACTIVE,
        TenantDatabaseStatusEnum.MIGRATING,
        TenantDatabaseStatusEnum.FAILED,
        TenantDatabaseStatusEnum.SUSPENDED,
      ];

      statuses.forEach((status) => {
        const primitives: TenantDatabasePrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174001',
          databaseName: 'tenant_db_001',
          readDatabaseName: 'tenant_db_read_001',
          status,
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        };

        const aggregate = factory.fromPrimitives(primitives);
        expect(aggregate.status.value).toBe(status);
      });
    });
  });
});
