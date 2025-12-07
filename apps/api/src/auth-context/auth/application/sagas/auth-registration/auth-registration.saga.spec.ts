import { AuthCreateCommand } from '@/auth-context/auth/application/commands/auth-create/auth-create.command';
import { AuthDeleteCommand } from '@/auth-context/auth/application/commands/auth-delete/auth-delete.command';
import { AuthRegistrationSaga } from '@/auth-context/auth/application/sagas/auth-registration/auth-registration.saga';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/prisma/master/client';
import { SagaInstanceChangeStatusCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command';
import { SagaInstanceCreateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command';
import { AuthRegistrationRequestedEvent } from '@/shared/domain/events/auth/auth-registration-requested/auth-registration-requested.event';
import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { TenantMemberAddCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-add/tenant-member-add.command';
import { TenantCreateCommand } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantDeleteCommand } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command';
import { UserDeleteCommand } from '@/user-context/users/application/commands/delete-user/delete-user.command';
import { UserCreateCommand } from '@/user-context/users/application/commands/user-create/user-create.command';
import { CommandBus } from '@nestjs/cqrs';

describe('AuthRegistrationSaga', () => {
  let saga: AuthRegistrationSaga;
  let mockCommandBus: jest.Mocked<CommandBus>;

  const authId = '123e4567-e89b-12d3-a456-426614174000';
  const userId = '123e4567-e89b-12d3-a456-426614174001';
  const tenantId = '223e4567-e89b-12d3-a456-426614174000';
  const tenantMemberId = '323e4567-e89b-12d3-a456-426614174000';
  const sagaInstanceId = '423e4567-e89b-12d3-a456-426614174000';
  const sagaStepId = '523e4567-e89b-12d3-a456-426614174000';

  const createEvent = (tenantName?: string): AuthRegistrationRequestedEvent => {
    const eventData: IAuthEventData = {
      id: authId,
      userId: userId,
      email: 'test@example.com',
      emailVerified: false,
      phoneNumber: null,
      lastLoginAt: null,
      password: null,
      provider: AuthProviderEnum.LOCAL,
      providerId: null,
      twoFactorEnabled: false,
      tenantName: tenantName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new AuthRegistrationRequestedEvent(
      {
        aggregateId: authId,
        aggregateType: AuthAggregate.name,
        eventType: AuthRegistrationRequestedEvent.name,
      },
      eventData,
    );
  };

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    saga = new AuthRegistrationSaga(mockCommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should complete registration successfully without tenant', async () => {
      const event = createEvent();

      // Mock saga instance creation
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockResolvedValueOnce(userId) // UserCreateCommand
        .mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 2
        .mockResolvedValueOnce(undefined) // update step 2 to RUNNING
        .mockResolvedValueOnce(authId) // AuthCreateCommand
        .mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
        .mockResolvedValueOnce(undefined); // completeSagaInstance

      await saga.handle(event);

      // Verify saga instance creation
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaInstanceCreateCommand),
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaInstanceChangeStatusCommand),
      );

      // Verify user creation
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserCreateCommand),
      );

      // Verify auth creation
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(AuthCreateCommand),
      );

      // Verify saga completion
      const completeCalls = mockCommandBus.execute.mock.calls.filter(
        (call) => call[0] instanceof SagaInstanceChangeStatusCommand,
      );
      expect(completeCalls.length).toBeGreaterThan(0);
    });

    it('should complete registration successfully with tenant', async () => {
      const event = createEvent('Test Tenant');

      // Mock saga instance creation
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockResolvedValueOnce(userId) // UserCreateCommand
        .mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 2
        .mockResolvedValueOnce(undefined) // update step 2 to RUNNING
        .mockResolvedValueOnce(authId) // AuthCreateCommand
        .mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 3
        .mockResolvedValueOnce(undefined) // update step 3 to RUNNING
        .mockResolvedValueOnce(tenantId) // TenantCreateCommand
        .mockResolvedValueOnce(undefined) // update step 3 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 4
        .mockResolvedValueOnce(undefined) // update step 4 to RUNNING
        .mockResolvedValueOnce(tenantMemberId) // TenantMemberAddCommand
        .mockResolvedValueOnce(undefined) // update step 4 to COMPLETED
        .mockResolvedValueOnce(undefined); // completeSagaInstance

      await saga.handle(event);

      // Verify tenant creation
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantCreateCommand),
      );

      // Verify tenant member creation
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberAddCommand),
      );
    });

    it('should execute compensation actions when user creation fails', async () => {
      const event = createEvent();
      const error = new Error('User creation failed');

      // Mock saga instance creation and user creation failure
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockRejectedValueOnce(error) // UserCreateCommand fails
        .mockResolvedValueOnce(undefined) // update step 1 to FAILED
        .mockResolvedValueOnce(undefined); // failSagaInstance

      await expect(saga.handle(event)).rejects.toThrow(error);

      // Verify saga instance is marked as failed
      const failCalls = mockCommandBus.execute.mock.calls.filter(
        (call) => call[0] instanceof SagaInstanceChangeStatusCommand,
      );
      expect(failCalls.length).toBeGreaterThan(0);
    });

    it('should execute compensation actions when auth creation fails', async () => {
      const event = createEvent();
      const error = new Error('Auth creation failed');

      // Mock saga instance creation, user creation success, auth creation failure
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockResolvedValueOnce(userId) // UserCreateCommand
        .mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 2
        .mockResolvedValueOnce(undefined) // update step 2 to RUNNING
        .mockRejectedValueOnce(error) // AuthCreateCommand fails
        .mockResolvedValueOnce(undefined) // update step 2 to FAILED
        .mockResolvedValueOnce(undefined) // UserDeleteCommand (compensation)
        .mockResolvedValueOnce(undefined); // failSagaInstance

      await expect(saga.handle(event)).rejects.toThrow(error);

      // Verify compensation: user deletion
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserDeleteCommand),
      );
    });

    it('should execute compensation actions when tenant creation fails', async () => {
      const event = createEvent('Test Tenant');
      const error = new Error('Tenant creation failed');

      // Mock saga instance creation, user and auth creation success, tenant creation failure
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockResolvedValueOnce(userId) // UserCreateCommand
        .mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 2
        .mockResolvedValueOnce(undefined) // update step 2 to RUNNING
        .mockResolvedValueOnce(authId) // AuthCreateCommand
        .mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 3
        .mockResolvedValueOnce(undefined) // update step 3 to RUNNING
        .mockRejectedValueOnce(error) // TenantCreateCommand fails
        .mockResolvedValueOnce(undefined) // update step 3 to FAILED
        .mockResolvedValueOnce(undefined) // AuthDeleteCommand (compensation)
        .mockResolvedValueOnce(undefined) // UserDeleteCommand (compensation)
        .mockResolvedValueOnce(undefined); // failSagaInstance

      await expect(saga.handle(event)).rejects.toThrow(error);

      // Verify compensation actions were called
      const deleteCalls = mockCommandBus.execute.mock.calls.filter(
        (call) =>
          call[0] instanceof AuthDeleteCommand ||
          call[0] instanceof UserDeleteCommand,
      );

      expect(deleteCalls.length).toBe(2);

      // Verify order: AuthDelete should be called before UserDelete (reverse order)
      const authDeleteIndex = mockCommandBus.execute.mock.calls.findIndex(
        (call) => call[0] instanceof AuthDeleteCommand,
      );
      const userDeleteIndex = mockCommandBus.execute.mock.calls.findIndex(
        (call) => call[0] instanceof UserDeleteCommand,
      );
      expect(authDeleteIndex).toBeLessThan(userDeleteIndex);
    });

    it('should execute compensation actions when tenant member creation fails', async () => {
      const event = createEvent('Test Tenant');
      const error = new Error('Tenant member creation failed');

      // Mock saga instance creation, all steps success except tenant member
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockResolvedValueOnce(userId) // UserCreateCommand
        .mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 2
        .mockResolvedValueOnce(undefined) // update step 2 to RUNNING
        .mockResolvedValueOnce(authId) // AuthCreateCommand
        .mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 3
        .mockResolvedValueOnce(undefined) // update step 3 to RUNNING
        .mockResolvedValueOnce(tenantId) // TenantCreateCommand
        .mockResolvedValueOnce(undefined) // update step 3 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 4
        .mockResolvedValueOnce(undefined) // update step 4 to RUNNING
        .mockRejectedValueOnce(error) // TenantMemberAddCommand fails
        .mockResolvedValueOnce(undefined) // update step 4 to FAILED
        .mockResolvedValueOnce(undefined) // TenantDeleteCommand (compensation)
        .mockResolvedValueOnce(undefined) // AuthDeleteCommand (compensation)
        .mockResolvedValueOnce(undefined) // UserDeleteCommand (compensation)
        .mockResolvedValueOnce(undefined); // failSagaInstance

      await expect(saga.handle(event)).rejects.toThrow(error);

      // Verify compensation actions were called
      const deleteCalls = mockCommandBus.execute.mock.calls.filter(
        (call) =>
          call[0] instanceof TenantDeleteCommand ||
          call[0] instanceof AuthDeleteCommand ||
          call[0] instanceof UserDeleteCommand,
      );

      expect(deleteCalls.length).toBe(3);

      // Verify order: TenantDelete -> AuthDelete -> UserDelete (reverse order)
      const tenantDeleteIndex = mockCommandBus.execute.mock.calls.findIndex(
        (call) => call[0] instanceof TenantDeleteCommand,
      );
      const authDeleteIndex = mockCommandBus.execute.mock.calls.findIndex(
        (call) => call[0] instanceof AuthDeleteCommand,
      );
      const userDeleteIndex = mockCommandBus.execute.mock.calls.findIndex(
        (call) => call[0] instanceof UserDeleteCommand,
      );
      expect(tenantDeleteIndex).toBeLessThan(authDeleteIndex);
      expect(authDeleteIndex).toBeLessThan(userDeleteIndex);
    });

    it('should execute compensation actions in reverse order', async () => {
      const event = createEvent('Test Tenant');
      const error = new Error('Tenant member creation failed');

      const compensationOrder: string[] = [];

      // Mock saga instance creation, all steps success except tenant member
      mockCommandBus.execute
        .mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
        .mockResolvedValueOnce(undefined) // changeStatus to RUNNING
        .mockResolvedValueOnce(sagaStepId) // create step 1
        .mockResolvedValueOnce(undefined) // update step 1 to RUNNING
        .mockResolvedValueOnce(userId) // UserCreateCommand
        .mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 2
        .mockResolvedValueOnce(undefined) // update step 2 to RUNNING
        .mockResolvedValueOnce(authId) // AuthCreateCommand
        .mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 3
        .mockResolvedValueOnce(undefined) // update step 3 to RUNNING
        .mockResolvedValueOnce(tenantId) // TenantCreateCommand
        .mockResolvedValueOnce(undefined) // update step 3 to COMPLETED
        .mockResolvedValueOnce(sagaStepId) // create step 4
        .mockResolvedValueOnce(undefined) // update step 4 to RUNNING
        .mockRejectedValueOnce(error) // TenantMemberAddCommand fails
        .mockResolvedValueOnce(undefined) // update step 4 to FAILED
        .mockImplementationOnce((command) => {
          // Track compensation order
          if (command instanceof TenantDeleteCommand) {
            compensationOrder.push('tenant');
          }
          return Promise.resolve(undefined);
        })
        .mockImplementationOnce((command) => {
          if (command instanceof AuthDeleteCommand) {
            compensationOrder.push('auth');
          }
          return Promise.resolve(undefined);
        })
        .mockImplementationOnce((command) => {
          if (command instanceof UserDeleteCommand) {
            compensationOrder.push('user');
          }
          return Promise.resolve(undefined);
        })
        .mockResolvedValueOnce(undefined); // failSagaInstance

      await expect(saga.handle(event)).rejects.toThrow(error);

      // Verify compensation order is reverse (tenant -> auth -> user)
      expect(compensationOrder).toEqual(['tenant', 'auth', 'user']);
    });
  });
});
