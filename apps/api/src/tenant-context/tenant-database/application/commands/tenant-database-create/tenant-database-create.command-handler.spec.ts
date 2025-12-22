import { TenantDatabaseCreateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-create/tenant-database-create.command';
import { TenantDatabaseCreateCommandHandler } from '@/tenant-context/tenant-database/application/commands/tenant-database-create/tenant-database-create.command-handler';
import { ITenantDatabaseCreateCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-create/tenant-database-create-command.dto';
import { TenantDatabaseAlreadyExistsException } from '@/tenant-context/tenant-database/application/exceptions/tenant-database-already-exists/tenant-database-already-exists.exception';
import { AssertTenantDatabaseNotExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-not-exsits/assert-tenant-database-not-exsits.service';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import {
  TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
  TenantDatabaseWriteRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { FindTenantByIdQuery } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query';
import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { EventBus, QueryBus } from '@nestjs/cqrs';

describe('TenantDatabaseCreateCommandHandler', () => {
  let handler: TenantDatabaseCreateCommandHandler;
  let mockTenantDatabaseWriteRepository: jest.Mocked<TenantDatabaseWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockTenantDatabaseAggregateFactory: jest.Mocked<TenantDatabaseAggregateFactory>;
  let mockAssertTenantDatabaseNotExsistsService: jest.Mocked<AssertTenantDatabaseNotExsistsService>;

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

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockTenantDatabaseAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantDatabaseAggregateFactory>;

    mockAssertTenantDatabaseNotExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantDatabaseNotExsistsService>;

    handler = new TenantDatabaseCreateCommandHandler(
      mockTenantDatabaseWriteRepository,
      mockEventBus,
      mockQueryBus,
      mockTenantDatabaseAggregateFactory,
      mockAssertTenantDatabaseNotExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create tenant database successfully when tenant exists and database does not exist', async () => {
      const commandDto: ITenantDatabaseCreateCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
      };

      const command = new TenantDatabaseCreateCommand(commandDto);
      const mockTenantDatabase = new TenantDatabaseAggregate(
        {
          id: command.id,
          tenantId: command.tenantId,
          databaseName: command.databaseName,
          readDatabaseName: command.readDatabaseName,
          status: command.status,
          schemaVersion: command.schemaVersion,
          lastMigrationAt: command.lastMigrationAt,
          errorMessage: command.errorMessage,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertTenantDatabaseNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue({} as any);
      mockTenantDatabaseAggregateFactory.create.mockReturnValue(
        mockTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockTenantDatabase.id.value);
      expect(
        mockAssertTenantDatabaseNotExsistsService.execute,
      ).toHaveBeenCalledWith(command.id.value);
      expect(
        mockAssertTenantDatabaseNotExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantByIdQuery),
      );
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      expect(mockTenantDatabaseAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: command.id,
          tenantId: command.tenantId,
          databaseName: command.databaseName,
          readDatabaseName: command.readDatabaseName,
          status: command.status,
          schemaVersion: command.schemaVersion,
          lastMigrationAt: command.lastMigrationAt,
          errorMessage: command.errorMessage,
        }),
      );
      const createCall =
        mockTenantDatabaseAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(mockTenantDatabaseWriteRepository.save).toHaveBeenCalledWith(
        mockTenantDatabase,
      );
      expect(mockTenantDatabaseWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockTenantDatabase.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when tenant database already exists', async () => {
      const commandDto: ITenantDatabaseCreateCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
      };

      const command = new TenantDatabaseCreateCommand(commandDto);
      const error = new TenantDatabaseAlreadyExistsException(command.id.value);

      mockAssertTenantDatabaseNotExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertTenantDatabaseNotExsistsService.execute,
      ).toHaveBeenCalledWith(command.id.value);
      expect(mockTenantDatabaseAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockTenantDatabaseWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should throw exception when tenant does not exist', async () => {
      const commandDto: ITenantDatabaseCreateCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
      };

      const command = new TenantDatabaseCreateCommand(commandDto);
      const error = new TenantNotFoundException(command.tenantId.value);

      mockAssertTenantDatabaseNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertTenantDatabaseNotExsistsService.execute,
      ).toHaveBeenCalledWith(command.id.value);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantByIdQuery),
      );
      expect(mockTenantDatabaseAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockTenantDatabaseWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should create tenant database with PROVISIONING status by default', async () => {
      const commandDto: ITenantDatabaseCreateCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        databaseName: 'tenant_db_001',
      };

      const command = new TenantDatabaseCreateCommand(commandDto);
      const mockTenantDatabase = new TenantDatabaseAggregate(
        {
          id: command.id,
          tenantId: command.tenantId,
          databaseName: command.databaseName,
          readDatabaseName: command.readDatabaseName,
          status: command.status,
          schemaVersion: command.schemaVersion,
          lastMigrationAt: command.lastMigrationAt,
          errorMessage: command.errorMessage,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertTenantDatabaseNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue({} as any);
      mockTenantDatabaseAggregateFactory.create.mockReturnValue(
        mockTenantDatabase,
      );
      mockTenantDatabaseWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(command.status.value).toBe(TenantDatabaseStatusEnum.PROVISIONING);
      expect(mockTenantDatabaseAggregateFactory.create).toHaveBeenCalled();
    });
  });
});
