import { FindAuthsByCriteriaQueryHandler } from '@/auth-context/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query-handler';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Criteria } from '@/shared/domain/entities/criteria';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { FindAuthsByCriteriaQuery } from './find-auths-by-criteria.query';

describe('FindAuthsByCriteriaQueryHandler', () => {
  let handler: FindAuthsByCriteriaQueryHandler;
  let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;

  beforeEach(() => {
    mockAuthReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthReadRepository>;

    handler = new FindAuthsByCriteriaQueryHandler(mockAuthReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated auth view models', async () => {
      const criteria = new Criteria();
      const query = new FindAuthsByCriteriaQuery(criteria);

      const mockAuthViewModel1 = new AuthViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test1@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockAuthViewModel2 = new AuthViewModel({
        id: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        email: 'test2@example.com',
        emailVerified: true,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const expectedResult = new PaginatedResult<AuthViewModel>(
        [mockAuthViewModel1, mockAuthViewModel2],
        2,
        1,
        10,
      );

      mockAuthReadRepository.findByCriteria.mockResolvedValue(expectedResult);

      const result = await handler.execute(query);

      expect(result).toEqual(expectedResult);
      expect(mockAuthReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockAuthReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no auths found', async () => {
      const criteria = new Criteria();
      const query = new FindAuthsByCriteriaQuery(criteria);

      const expectedResult = new PaginatedResult<AuthViewModel>([], 0, 1, 10);

      mockAuthReadRepository.findByCriteria.mockResolvedValue(expectedResult);

      const result = await handler.execute(query);

      expect(result).toEqual(expectedResult);
      expect(mockAuthReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });
  });
});

