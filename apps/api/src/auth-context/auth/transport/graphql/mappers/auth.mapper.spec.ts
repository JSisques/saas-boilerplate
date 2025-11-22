import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthGraphQLMapper } from '@/auth-context/auth/transport/graphql/mappers/auth.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('AuthGraphQLMapper', () => {
  let mapper: AuthGraphQLMapper;

  beforeEach(() => {
    mapper = new AuthGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert AuthViewModel to AuthResponseDto with all properties', () => {
      const now = new Date();
      const viewModel = new AuthViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: now,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert AuthViewModel with null optional properties', () => {
      const now = new Date();
      const viewModel = new AuthViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        emailVerified: false,
        lastLoginAt: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert PaginatedResult to PaginatedAuthResultDto', () => {
      const now = new Date();
      const viewModels: AuthViewModel[] = [
        new AuthViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test1@example.com',
          emailVerified: true,
          lastLoginAt: now,
          password: '$2b$12$hashedpassword',
          phoneNumber: null,
          provider: AuthProviderEnum.LOCAL,
          providerId: null,
          twoFactorEnabled: false,
          createdAt: now,
          updatedAt: now,
        }),
        new AuthViewModel({
          id: '223e4567-e89b-12d3-a456-426614174002',
          userId: '323e4567-e89b-12d3-a456-426614174003',
          email: 'test2@example.com',
          emailVerified: false,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: AuthProviderEnum.GOOGLE,
          providerId: 'google-123',
          twoFactorEnabled: true,
          createdAt: now,
          updatedAt: now,
        }),
      ];

      const paginatedResult = new PaginatedResult<AuthViewModel>(
        viewModels,
        2,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0]).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test1@example.com',
        emailVerified: true,
        lastLoginAt: now,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });
      expect(result.items[1]).toEqual({
        id: '223e4567-e89b-12d3-a456-426614174002',
        userId: '323e4567-e89b-12d3-a456-426614174003',
        email: 'test2@example.com',
        emailVerified: false,
        lastLoginAt: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should handle empty paginated result', () => {
      const paginatedResult = new PaginatedResult<AuthViewModel>([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should handle paginated result with multiple pages', () => {
      const now = new Date();
      const viewModels: AuthViewModel[] = Array.from({ length: 5 }, (_, i) => {
        return new AuthViewModel({
          id: `${i}-123e4567-e89b-12d3-a456-426614174000`,
          userId: `${i}-123e4567-e89b-12d3-a456-426614174001`,
          email: `test${i}@example.com`,
          emailVerified: i % 2 === 0,
          lastLoginAt: i % 2 === 0 ? now : null,
          password: null,
          phoneNumber: null,
          provider: AuthProviderEnum.LOCAL,
          providerId: null,
          twoFactorEnabled: false,
          createdAt: now,
          updatedAt: now,
        });
      });

      const paginatedResult = new PaginatedResult<AuthViewModel>(
        viewModels,
        25,
        2,
        5,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
    });
  });
});
