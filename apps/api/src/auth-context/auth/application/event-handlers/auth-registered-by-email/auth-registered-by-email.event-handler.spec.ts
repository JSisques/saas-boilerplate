import { AuthRegisteredByEmailEventHandler } from '@/auth-context/auth/application/event-handlers/auth-registered-by-email/auth-registered-by-email.event-handler';
import { AuthViewModelFactory } from '@/auth-context/auth/domain/factories/auth-view-model/auth-view-model.factory';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthRegisteredByEmailEvent } from '@/shared/domain/events/auth/auth-registered-by-email/auth-registered-by-email.event';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';

describe('AuthRegisteredByEmailEventHandler', () => {
  let handler: AuthRegisteredByEmailEventHandler;
  let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;
  let mockAuthViewModelFactory: jest.Mocked<AuthViewModelFactory>;

  beforeEach(() => {
    mockAuthReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthReadRepository>;

    mockAuthViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<AuthViewModelFactory>;

    handler = new AuthRegisteredByEmailEventHandler(
      mockAuthReadRepository,
      mockAuthViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save auth view model when event is handled', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const authPrimitives: AuthPrimitives = {
        id: authId,
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new AuthRegisteredByEmailEvent(
        {
          aggregateId: authId,
          aggregateType: 'AuthAggregate',
          eventType: 'AuthRegisteredByEmailEvent',
        },
        authPrimitives,
      );

      const mockViewModel = new AuthViewModel({
        id: authId,
        userId: authPrimitives.userId,
        email: authPrimitives.email,
        emailVerified: authPrimitives.emailVerified,
        lastLoginAt: authPrimitives.lastLoginAt,
        password: authPrimitives.password,
        phoneNumber: authPrimitives.phoneNumber,
        provider: authPrimitives.provider,
        providerId: authPrimitives.providerId,
        twoFactorEnabled: authPrimitives.twoFactorEnabled,
        createdAt: authPrimitives.createdAt,
        updatedAt: authPrimitives.updatedAt,
      });

      mockAuthViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockAuthReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockAuthViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        authPrimitives,
      );
      expect(mockAuthViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(1);
      expect(mockAuthReadRepository.save).toHaveBeenCalledWith(mockViewModel);
      expect(mockAuthReadRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});

