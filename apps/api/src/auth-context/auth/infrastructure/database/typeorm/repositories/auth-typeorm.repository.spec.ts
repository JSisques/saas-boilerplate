import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthTypeormEntity } from '@/auth-context/auth/infrastructure/database/typeorm/entities/auth-typeorm.entity';
import { AuthTypeormMapper } from '@/auth-context/auth/infrastructure/database/typeorm/mappers/auth-typeorm.mapper';
import { AuthTypeormRepository } from '@/auth-context/auth/infrastructure/database/typeorm/repositories/auth-typeorm.repository';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('AuthTypeormRepository', () => {
  let repository: AuthTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockAuthTypeormMapper: jest.Mocked<AuthTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<AuthTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<AuthTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockAuthTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<AuthTypeormMapper>;

    repository = new AuthTypeormRepository(
      mockTypeormMasterService,
      mockAuthTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return auth aggregate when auth exists', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const typeormEntity = new AuthTypeormEntity();
      typeormEntity.id = authId;
      typeormEntity.userId = userId;
      typeormEntity.email = 'test@example.com';
      typeormEntity.emailVerified = true;
      typeormEntity.provider = AuthProviderEnum.LOCAL;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const authAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockAuthTypeormMapper.toDomainEntity.mockReturnValue(authAggregate);

      const result = await repository.findById(authId);

      expect(result).toBe(authAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: authId },
      });
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when auth does not exist', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(authId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: authId },
      });
      expect(mockAuthTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return auth aggregate when auth exists', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const email = 'test@example.com';
      const now = new Date();

      const typeormEntity = new AuthTypeormEntity();
      typeormEntity.id = authId;
      typeormEntity.userId = userId;
      typeormEntity.email = email;
      typeormEntity.emailVerified = true;
      typeormEntity.provider = AuthProviderEnum.LOCAL;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const authAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockAuthTypeormMapper.toDomainEntity.mockReturnValue(authAggregate);

      const result = await repository.findByEmail(email);

      expect(result).toBe(authAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when auth does not exist', async () => {
      const email = 'test@example.com';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockAuthTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return auth aggregate when auth exists', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const typeormEntity = new AuthTypeormEntity();
      typeormEntity.id = authId;
      typeormEntity.userId = userId;
      typeormEntity.email = 'test@example.com';
      typeormEntity.emailVerified = true;
      typeormEntity.provider = AuthProviderEnum.LOCAL;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const authAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockAuthTypeormMapper.toDomainEntity.mockReturnValue(authAggregate);

      const result = await repository.findByUserId(userId);

      expect(result).toBe(authAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when auth does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174001';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findByUserId(userId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockAuthTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save auth aggregate and return saved aggregate', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const authAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      const typeormEntity = new AuthTypeormEntity();
      typeormEntity.id = authId;
      typeormEntity.userId = userId;
      typeormEntity.provider = AuthProviderEnum.LOCAL;

      const savedTypeormEntity = new AuthTypeormEntity();
      savedTypeormEntity.id = authId;
      savedTypeormEntity.userId = userId;
      savedTypeormEntity.email = 'test@example.com';
      savedTypeormEntity.provider = AuthProviderEnum.LOCAL;

      const savedAuthAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      mockAuthTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockAuthTypeormMapper.toDomainEntity.mockReturnValue(savedAuthAggregate);

      const result = await repository.save(authAggregate);

      expect(result).toBe(savedAuthAggregate);
      expect(mockAuthTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        authAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockAuthTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete auth and return true', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(authId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(authId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when auth does not exist', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(authId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(authId);
    });

    it('should handle delete errors correctly', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Auth not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(authId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(authId);
    });
  });
});
