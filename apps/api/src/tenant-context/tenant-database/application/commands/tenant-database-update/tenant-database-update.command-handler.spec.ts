import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import { TenantDatabaseUpdateCommandHandler } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command-handler';
import { ITenantDatabaseUpdateCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-update/tenant-database-update-command.dto';
import { TenantDatabaseNotFoundException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-not-found/tenant-database-not-found.exception';
import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseWriteRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { EventBus } from '@nestjs/cqrs';

describe('TenantDatabaseUpdateCommandHandler', () => {
  let handler: TenantDatabaseUpdateCommandHandler;
  let mockTenantDatabaseWriteRepository: jest.Mocked<TenantDatabaseWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertTenantDatabaseExsistsService: jest.Mocked<AssertTenantDatabaseExsistsService>;

  beforeEach(() => {
    mockTenantDatabaseWriteRepository = {
      findById: jest.fn(),
      findByTenantId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertTenantDatabaseExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantDatabaseExsistsService>;

    handler = new TenantDatabaseUpdateCommandHandler(
      mockAssertTenantDatabaseExsistsService,
      mockEventBus,
      mockTenantDatabaseWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update tenant database successfully when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ITenantDatabaseUpdateCommandDto = {
        id: tenantDatabaseId,
        databaseName: 'tenant_db_updated',
        status: TenantDatabaseStatusEnum.ACTIVE,
      };

      const command = new TenantDatabaseUpdateCommand(commandDto);
      const existingTenantDatabase = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174001',
          ),
          databaseName: new TenantDatabaseNameValueObject('tenant_db_original'),
          readDatabaseName: new TenantDatabaseNameValueObject(
            'tenant_db_read_original',
          ),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.PROVISIONING,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingTenantDatabase, 'update');
      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        existingTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalled();
      expect(mockTenantDatabaseWriteRepository.save).toHaveBeenCalledWith(
        existingTenantDatabase,
      );
      expect(mockTenantDatabaseWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantDatabaseUpdateCommandDto = {
        id: tenantDatabaseId,
        databaseName: 'tenant_db_updated',
      };

      const command = new TenantDatabaseUpdateCommand(commandDto);
      const error = new TenantDatabaseNotFoundException(tenantDatabaseId);

      mockAssertTenantDatabaseExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(mockTenantDatabaseWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ITenantDatabaseUpdateCommandDto = {
        id: tenantDatabaseId,
        databaseName: 'tenant_db_updated',
        status: TenantDatabaseStatusEnum.ACTIVE,
      };

      const command = new TenantDatabaseUpdateCommand(commandDto);
      const existingTenantDatabase = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174001',
          ),
          databaseName: new TenantDatabaseNameValueObject('tenant_db_original'),
          readDatabaseName: new TenantDatabaseNameValueObject(
            'tenant_db_read_original',
          ),
          status: new TenantDatabaseStatusValueObject(
            TenantDatabaseStatusEnum.PROVISIONING,
          ),
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingTenantDatabase, 'update');
      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        existingTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(updateSpy).toHaveBeenCalled();
      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).toHaveProperty('databaseName');
      expect(updateCall).toHaveProperty('status');
      expect(updateCall).not.toHaveProperty('id');
      expect(mockTenantDatabaseWriteRepository.save).toHaveBeenCalledWith(
        existingTenantDatabase,
      );

      updateSpy.mockRestore();
    });

    it('should update schema version and last migration at', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ITenantDatabaseUpdateCommandDto = {
        id: tenantDatabaseId,
        schemaVersion: '2.0.0',
        lastMigrationAt: new Date('2024-02-01T10:00:00Z'),
      };

      const command = new TenantDatabaseUpdateCommand(commandDto);
      const existingTenantDatabase = new TenantDatabaseAggregate(
        {
          id: new TenantDatabaseUuidValueObject(tenantDatabaseId),
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
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingTenantDatabase, 'update');
      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        existingTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(updateSpy).toHaveBeenCalled();
      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).toHaveProperty('schemaVersion');
      expect(updateCall).toHaveProperty('lastMigrationAt');

      updateSpy.mockRestore();
    });
  });
});
