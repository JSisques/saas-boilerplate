import { AuthLoggedInByEmailEventHandler } from '@/auth-context/auth/application/event-handlers/auth-logged-in-by-email/auth-logged-in-by-email.event-handler';
import { AssertAuthViewModelExsistsService } from '@/auth-context/auth/application/services/assert-auth-view-model-exsists/assert-auth-view-model-exsists.service';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthReadRepository } from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthLoggedInByEmailEvent } from '@/shared/domain/events/auth/auth-logged-in-by-email/auth-logged-in-by-email.event';

describe('AuthLoggedInByEmailEventHandler', () => {
  let handler: AuthLoggedInByEmailEventHandler;
  let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;
  let mockAssertAuthViewModelExsistsService: jest.Mocked<AssertAuthViewModelExsistsService>;

  beforeEach(() => {
    mockAuthReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthReadRepository>;

    mockAssertAuthViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertAuthViewModelExsistsService>;

    handler = new AuthLoggedInByEmailEventHandler(
      mockAuthReadRepository,
      mockAssertAuthViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save auth view model when event is handled', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: authId,
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: new Date(),
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new AuthLoggedInByEmailEvent(
        {
          aggregateId: authId,
          aggregateType: 'AuthAggregate',
          eventType: 'AuthLoggedInByEmailEvent',
        },
        eventData,
      );

      const mockViewModel = new AuthViewModel({
        id: authId,
        userId: eventData.userId,
        email: eventData.email,
        emailVerified: eventData.emailVerified,
        lastLoginAt: null,
        password: eventData.password,
        phoneNumber: eventData.phoneNumber,
        provider: eventData.provider,
        providerId: eventData.providerId,
        twoFactorEnabled: eventData.twoFactorEnabled,
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      });

      const updateSpy = jest.spyOn(mockViewModel, 'update');

      mockAssertAuthViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );
      mockAuthReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertAuthViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(authId);
      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockAuthReadRepository.save).toHaveBeenCalledWith(mockViewModel);
      expect(mockAuthReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });
  });
});
