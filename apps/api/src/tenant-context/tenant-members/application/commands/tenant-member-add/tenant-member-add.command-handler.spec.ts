import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { ITenantMemberAddCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-add/tenant-member-add-command.dto';
import { TenantMemberAlreadyExistsException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-already-exists/tenant-member-already-exists.exception';
import { AssertTenantMemberNotExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-not-exsits/assert-tenant-member-not-exsits.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberWriteRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { FindTenantByIdQuery } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { TenantMemberAddCommand } from './tenant-member-add.command';
import { TenantMemberAddCommandHandler } from './tenant-member-add.command-handler';

describe('TenantMemberAddCommandHandler', () => {
  let handler: TenantMemberAddCommandHandler;
  let mockTenantMemberWriteRepository: jest.Mocked<TenantMemberWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockTenantMemberAggregateFactory: jest.Mocked<TenantMemberAggregateFactory>;
  let mockAssertTenantMemberNotExsistsService: jest.Mocked<AssertTenantMemberNotExsistsService>;

  beforeEach(() => {
    mockTenantMemberWriteRepository = {
      findById: jest.fn(),
      findByTenantIdAndUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockTenantMemberAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberAggregateFactory>;

    mockAssertTenantMemberNotExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantMemberNotExsistsService>;

    handler = new TenantMemberAddCommandHandler(
      mockTenantMemberWriteRepository,
      mockEventBus,
      mockQueryBus,
      mockTenantMemberAggregateFactory,
      mockAssertTenantMemberNotExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create tenant member successfully when tenant member does not exist', async () => {
      const commandDto: ITenantMemberAddCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
      };

      const command = new TenantMemberAddCommand(commandDto);
      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(command.id.value),
          tenantId: command.tenantId,
          userId: command.userId,
          role: command.role,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockAssertTenantMemberNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue(undefined);
      mockTenantMemberAggregateFactory.create.mockReturnValue(mockTenantMember);
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockTenantMember.id.value);
      expect(
        mockAssertTenantMemberNotExsistsService.execute,
      ).toHaveBeenCalledWith({
        tenantId: command.tenantId.value,
        userId: command.userId.value,
      });
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindTenantByIdQuery),
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(UserFindByIdQuery),
      );
      expect(mockTenantMemberAggregateFactory.create).toHaveBeenCalled();
      expect(mockTenantMemberWriteRepository.save).toHaveBeenCalledWith(
        mockTenantMember,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockTenantMember.getUncommittedEvents(),
      );
    });

    it('should throw exception when tenant member already exists', async () => {
      const commandDto: ITenantMemberAddCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
      };

      const command = new TenantMemberAddCommand(commandDto);
      const error = new TenantMemberAlreadyExistsException(
        command.tenantId.value,
        command.userId.value,
      );

      mockAssertTenantMemberNotExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertTenantMemberNotExsistsService.execute,
      ).toHaveBeenCalledWith({
        tenantId: command.tenantId.value,
        userId: command.userId.value,
      });
      expect(mockTenantMemberAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockTenantMemberWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish TenantMemberAddedEvent when tenant member is created', async () => {
      const commandDto: ITenantMemberAddCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
      };

      const command = new TenantMemberAddCommand(commandDto);
      const now = new Date();

      // Verify that aggregate creation generates the event
      const testTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(command.id.value),
          tenantId: command.tenantId,
          userId: command.userId,
          role: command.role,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );
      const eventsAfterCreation = testTenantMember.getUncommittedEvents();
      expect(eventsAfterCreation).toHaveLength(1);
      expect(eventsAfterCreation[0]).toBeInstanceOf(TenantMemberAddedEvent);
      testTenantMember.commit();

      // Now test the handler
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(command.id.value),
          tenantId: command.tenantId,
          userId: command.userId,
          role: command.role,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockAssertTenantMemberNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue(undefined);
      mockTenantMemberAggregateFactory.create.mockReturnValue(mockTenantMember);
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Note: We can't verify the events here because commit() clears them
      // But we verified above that aggregate creation generates the event correctly
    });

    it('should save tenant member before publishing events', async () => {
      const commandDto: ITenantMemberAddCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
      };

      const command = new TenantMemberAddCommand(commandDto);
      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(command.id.value),
          tenantId: command.tenantId,
          userId: command.userId,
          role: command.role,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockAssertTenantMemberNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue(undefined);
      mockTenantMemberAggregateFactory.create.mockReturnValue(mockTenantMember);
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockTenantMemberWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should return the created tenant member id', async () => {
      const commandDto: ITenantMemberAddCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.OWNER,
      };

      const command = new TenantMemberAddCommand(commandDto);
      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(command.id.value),
          tenantId: command.tenantId,
          userId: command.userId,
          role: command.role,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockAssertTenantMemberNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue(undefined);
      mockTenantMemberAggregateFactory.create.mockReturnValue(mockTenantMember);
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockTenantMember.id.value);
    });

    it('should verify tenant and user exist before creating tenant member', async () => {
      const commandDto: ITenantMemberAddCommandDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.GUEST,
      };

      const command = new TenantMemberAddCommand(commandDto);
      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(command.id.value),
          tenantId: command.tenantId,
          userId: command.userId,
          role: command.role,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        true,
      );

      mockAssertTenantMemberNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockQueryBus.execute.mockResolvedValue(undefined);
      mockTenantMemberAggregateFactory.create.mockReturnValue(mockTenantMember);
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.objectContaining({
            value: command.tenantId.value,
          }),
        }),
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.objectContaining({
            value: command.userId.value,
          }),
        }),
      );
    });
  });
});
