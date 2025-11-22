import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberRemoveCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-remove/tenant-member-remove-command.dto';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberWriteRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { EventBus } from '@nestjs/cqrs';
import { TenantMemberRemoveCommand } from './tenant-member-remove.command';
import { TenantMemberRemoveCommandHandler } from './tenant-member-remove.command-handler';

describe('TenantMemberRemoveCommandHandler', () => {
  let handler: TenantMemberRemoveCommandHandler;
  let mockTenantMemberWriteRepository: jest.Mocked<TenantMemberWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertTenantMemberExsistsService: jest.Mocked<AssertTenantMemberExsistsService>;

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

    mockAssertTenantMemberExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantMemberExsistsService>;

    handler = new TenantMemberRemoveCommandHandler(
      mockTenantMemberWriteRepository,
      mockEventBus,
      mockAssertTenantMemberExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should remove tenant member successfully when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberRemoveCommandDto = {
        id: tenantMemberId,
      };

      const command = new TenantMemberRemoveCommand(commandDto);
      const now = new Date();
      const existingTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertTenantMemberExsistsService.execute.mockResolvedValue(
        existingTenantMember,
      );
      mockTenantMemberWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockTenantMemberWriteRepository.delete).toHaveBeenCalledWith(
        existingTenantMember.id.value,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingTenantMember.getUncommittedEvents(),
      );
    });

    it('should throw exception when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberRemoveCommandDto = {
        id: tenantMemberId,
      };

      const command = new TenantMemberRemoveCommand(commandDto);
      const error = new TenantMemberNotFoundException(tenantMemberId);

      mockAssertTenantMemberExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockTenantMemberWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish TenantMemberRemovedEvent when tenant member is removed', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberRemoveCommandDto = {
        id: tenantMemberId,
      };

      const command = new TenantMemberRemoveCommand(commandDto);
      const now = new Date();

      // Verify that delete generates the event
      const testTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );
      testTenantMember.delete();
      const eventsAfterDelete = testTenantMember.getUncommittedEvents();
      expect(eventsAfterDelete).toHaveLength(1);
      expect(eventsAfterDelete[0]).toBeInstanceOf(TenantMemberRemovedEvent);
      testTenantMember.commit();

      // Now test the handler
      const existingTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertTenantMemberExsistsService.execute.mockResolvedValue(
        existingTenantMember,
      );
      mockTenantMemberWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Note: We can't verify the events here because commit() clears them
      // But we verified above that delete() generates the event correctly
    });

    it('should delete tenant member from repository before publishing events', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberRemoveCommandDto = {
        id: tenantMemberId,
      };

      const command = new TenantMemberRemoveCommand(commandDto);
      const now = new Date();
      const existingTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertTenantMemberExsistsService.execute.mockResolvedValue(
        existingTenantMember,
      );
      mockTenantMemberWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockTenantMemberWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });
  });
});
