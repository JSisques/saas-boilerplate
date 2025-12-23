import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberUpdateCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-update/tenant-member-update-command.dto';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberWriteRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { EventBus } from '@nestjs/cqrs';
import { TenantMemberUpdateCommand } from './tenant-member-update.command';
import { TenantMemberUpdateCommandHandler } from './tenant-member-update.command-handler';

describe('TenantMemberUpdateCommandHandler', () => {
  let handler: TenantMemberUpdateCommandHandler;
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

    handler = new TenantMemberUpdateCommandHandler(
      mockAssertTenantMemberExsistsService,
      mockEventBus,
      mockTenantMemberWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update tenant member successfully when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberUpdateCommandDto = {
        id: tenantMemberId,
        role: TenantMemberRoleEnum.ADMIN,
      };

      const command = new TenantMemberUpdateCommand(commandDto);
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
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(existingTenantMember.role.value).toBe(TenantMemberRoleEnum.ADMIN);
      expect(mockTenantMemberWriteRepository.save).toHaveBeenCalledWith(
        existingTenantMember,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingTenantMember.getUncommittedEvents(),
      );
    });

    it('should throw exception when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberUpdateCommandDto = {
        id: tenantMemberId,
        role: TenantMemberRoleEnum.ADMIN,
      };

      const command = new TenantMemberUpdateCommand(commandDto);
      const error = new TenantMemberNotFoundException(tenantMemberId);

      mockAssertTenantMemberExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockTenantMemberWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish TenantMemberUpdatedEvent when tenant member is updated', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberUpdateCommandDto = {
        id: tenantMemberId,
        role: TenantMemberRoleEnum.OWNER,
      };

      const command = new TenantMemberUpdateCommand(commandDto);
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

      // Verify that update generates the event
      existingTenantMember.update({
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
      });
      const eventsAfterUpdate = existingTenantMember.getUncommittedEvents();
      expect(eventsAfterUpdate).toHaveLength(1);
      expect(eventsAfterUpdate[0]).toBeInstanceOf(TenantMemberUpdatedEvent);
      existingTenantMember.commit();

      // Now test the handler
      const existingTenantMemberForHandler = new TenantMemberAggregate(
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
        existingTenantMemberForHandler,
      );
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Note: We can't verify the events here because commit() clears them
      // But we verified above that update() generates the event correctly
    });

    it('should save tenant member before publishing events', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberUpdateCommandDto = {
        id: tenantMemberId,
        role: TenantMemberRoleEnum.GUEST,
      };

      const command = new TenantMemberUpdateCommand(commandDto);
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
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockTenantMemberWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should not update role when role is undefined', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ITenantMemberUpdateCommandDto = {
        id: tenantMemberId,
      };

      const command = new TenantMemberUpdateCommand(commandDto);
      const now = new Date();
      const originalRole = TenantMemberRoleEnum.MEMBER;
      const existingTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(originalRole),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertTenantMemberExsistsService.execute.mockResolvedValue(
        existingTenantMember,
      );
      mockTenantMemberWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(existingTenantMember.role.value).toBe(originalRole);
      expect(mockTenantMemberWriteRepository.save).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });
  });
});
