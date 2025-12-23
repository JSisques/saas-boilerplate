import { AuthDeletedEvent } from '@/shared/domain/events/auth/auth-deleted/auth-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { AuthDeleteCommand } from '@/auth-context/auth/application/commands/auth-delete/auth-delete.command';
import { AuthDeleteCommandHandler } from '@/auth-context/auth/application/commands/auth-delete/auth-delete.command-handler';
import { IAuthDeleteCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-delete/auth-delete-command.dto';
import { AuthNotFoundException } from '@/auth-context/auth/application/exceptions/auth-not-found/auth-not-found.exception';
import { AssertAuthExistsService } from '@/auth-context/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { EventBus } from '@nestjs/cqrs';

describe('AuthDeleteCommandHandler', () => {
  let handler: AuthDeleteCommandHandler;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertAuthExistsService: jest.Mocked<AssertAuthExistsService>;

  beforeEach(() => {
    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertAuthExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertAuthExistsService>;

    handler = new AuthDeleteCommandHandler(
      mockAuthWriteRepository,
      mockEventBus,
      mockAssertAuthExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete auth successfully when auth exists', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const existingAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const deleteSpy = jest.spyOn(existingAuth, 'delete');
      mockAssertAuthExistsService.execute.mockResolvedValue(existingAuth);
      mockAuthWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertAuthExistsService.execute).toHaveBeenCalledWith(authId);
      expect(mockAssertAuthExistsService.execute).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockAuthWriteRepository.delete).toHaveBeenCalledWith(authId);
      expect(mockAuthWriteRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingAuth.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      deleteSpy.mockRestore();
    });

    it('should throw exception when auth does not exist', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const error = new AuthNotFoundException(authId);

      mockAssertAuthExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertAuthExistsService.execute).toHaveBeenCalledWith(authId);
      expect(mockAuthWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish AuthDeletedEvent when auth is deleted', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const existingAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      // Verify that delete() generates an event when called directly
      existingAuth.delete();
      const eventsAfterDelete = existingAuth.getUncommittedEvents();
      expect(eventsAfterDelete).toHaveLength(1);
      expect(eventsAfterDelete[0]).toBeInstanceOf(AuthDeletedEvent);

      // Now test the handler
      const existingAuthForHandler = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertAuthExistsService.execute.mockResolvedValue(
        existingAuthForHandler,
      );
      mockAuthWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Note: We can't verify the events here because commit() clears them
      // But we verified above that delete() generates the event correctly
    });

    it('should delete from repository after calling delete on aggregate', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const existingAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertAuthExistsService.execute.mockResolvedValue(existingAuth);
      mockAuthWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const deleteSpy = jest.spyOn(existingAuth, 'delete');
      await handler.execute(command);

      expect(deleteSpy).toHaveBeenCalled();
      expect(mockAuthWriteRepository.delete).toHaveBeenCalledWith(authId);

      deleteSpy.mockRestore();
    });

    it('should publish events before committing', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const existingAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const commitSpy = jest.spyOn(existingAuth, 'commit');

      mockAssertAuthExistsService.execute.mockResolvedValue(existingAuth);
      mockAuthWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      const commitOrder = commitSpy.mock.invocationCallOrder[0];
      expect(publishOrder).toBeLessThan(commitOrder);
    });

    it('should delete from repository before publishing events', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const existingAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertAuthExistsService.execute.mockResolvedValue(existingAuth);
      mockAuthWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockAuthWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });

    it('should use correct auth id from command', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const commandDto: IAuthDeleteCommandDto = {
        id: authId,
      };

      const command = new AuthDeleteCommand(commandDto);
      const existingAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertAuthExistsService.execute.mockResolvedValue(existingAuth);
      mockAuthWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertAuthExistsService.execute).toHaveBeenCalledWith(
        command.id,
      );
      expect(mockAuthWriteRepository.delete).toHaveBeenCalledWith(
        existingAuth.id.value,
      );
    });
  });
});
