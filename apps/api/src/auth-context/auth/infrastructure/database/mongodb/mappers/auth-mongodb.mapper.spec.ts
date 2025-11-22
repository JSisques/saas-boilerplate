import { AuthViewModelFactory } from '@/auth-context/auth/domain/factories/auth-view-model/auth-view-model.factory';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthMongoDBMapper } from '@/auth-context/auth/infrastructure/database/mongodb/mappers/auth-mongodb.mapper';
import { AuthMongoDbDto } from '@/auth-context/auth/infrastructure/database/mongodb/dtos/auth-mongodb.dto';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';

describe('AuthMongoDBMapper', () => {
  let mapper: AuthMongoDBMapper;
  let mockAuthViewModelFactory: jest.Mocked<AuthViewModelFactory>;

  beforeEach(() => {
    mockAuthViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<AuthViewModelFactory>;

    mapper = new AuthMongoDBMapper(mockAuthViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const mongoData: AuthMongoDbDto = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const mockViewModel = new AuthViewModel({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        phoneNumber: '+1234567890',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });

      mockAuthViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoData);

      expect(result).toBe(mockViewModel);
      expect(mockAuthViewModelFactory.create).toHaveBeenCalledWith({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockAuthViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document with null optional properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const mongoData: AuthMongoDbDto = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: false,
        phoneNumber: null,
        lastLoginAt: null,
        password: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      };

      const mockViewModel = new AuthViewModel({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });

      mockAuthViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoData);

      expect(result).toBe(mockViewModel);
      expect(mockAuthViewModelFactory.create).toHaveBeenCalledWith({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: false,
        phoneNumber: null,
        lastLoginAt: null,
        password: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const viewModel = new AuthViewModel({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        phoneNumber: '+1234567890',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert view model with null optional properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const viewModel = new AuthViewModel({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: false,
        phoneNumber: null,
        lastLoginAt: null,
        password: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });
    });
  });
});

