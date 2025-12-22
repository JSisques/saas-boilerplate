import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseDeleteCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command';
import { TenantDatabaseDeleteCommandHandler } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command-handler';
import { ITenantDatabaseDeleteCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-delete/tenant-database-delete-command.dto';
import { TenantDatabaseNotFoundException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-not-found/tenant-database-not-found.exception';
import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseWriteRepository } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { EventBus } from '@nestjs/cqrs';

describe('TenantDatabaseDeleteCommandHandler', () => {
  let handler: TenantDatabaseDeleteCommandHandler;
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

    handler = new TenantDatabaseDeleteCommandHandler(
      mockTenantDatabaseWriteRepository,
      mockEventBus,
      mockAssertTenantDatabaseExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete tenant database successfully when tenant database exists', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ITenantDatabaseDeleteCommandDto = {
        id: tenantDatabaseId,
      };

      const command = new TenantDatabaseDeleteCommand(commandDto);
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
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const deleteSpy = jest.spyOn(existingTenantDatabase, 'delete');
      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        existingTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockTenantDatabaseWriteRepository.delete).toHaveBeenCalledWith(
        tenantDatabaseId,
      );
      expect(mockTenantDatabaseWriteRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      deleteSpy.mockRestore();
    });

    it('should throw exception when tenant database does not exist', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantDatabaseDeleteCommandDto = {
        id: tenantDatabaseId,
      };

      const command = new TenantDatabaseDeleteCommand(commandDto);
      const error = new TenantDatabaseNotFoundException(tenantDatabaseId);

      mockAssertTenantDatabaseExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertTenantDatabaseExsistsService.execute,
      ).toHaveBeenCalledWith(tenantDatabaseId);
      expect(mockTenantDatabaseWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should generate delete event when deleting tenant database', async () => {
      const tenantDatabaseId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ITenantDatabaseDeleteCommandDto = {
        id: tenantDatabaseId,
      };

      const command = new TenantDatabaseDeleteCommand(commandDto);
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
          schemaVersion: null,
          lastMigrationAt: null,
          errorMessage: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertTenantDatabaseExsistsService.execute.mockResolvedValue(
        existingTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const uncommittedEvents = existingTenantDatabase.getUncommittedEvents();
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(uncommittedEvents);
    });
  });
});
