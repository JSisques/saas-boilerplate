import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthPrismaDto } from '@/auth-context/auth/infrastructure/database/prisma/dtos/auth-prisma.dto';
import { AuthPrismaMapper } from '@/auth-context/auth/infrastructure/database/prisma/mappers/auth-prisma.mapper';
import { AuthPrismaRepository } from '@/auth-context/auth/infrastructure/database/prisma/repositories/auth-prisma.repository';
import { AuthProviderEnum } from '@/prisma/master/client';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AuthPrismaRepository', () => {
  let repository: AuthPrismaRepository;
  let mockPrismaService: any;
  let mockAuthPrismaMapper: jest.Mocked<AuthPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockFindFirst: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockFindFirst = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      client: {
        auth: {
          findUnique: mockFindUnique,
          findFirst: mockFindFirst,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    };

    mockAuthPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<AuthPrismaMapper>;

    repository = new AuthPrismaRepository(
      mockPrismaService,
      mockAuthPrismaMapper,
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

      const prismaData: AuthPrismaDto = {
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

      mockFindFirst.mockResolvedValue(prismaData);
      mockAuthPrismaMapper.toDomainEntity.mockReturnValue(authAggregate);

      const result = await repository.findById(authId);

      expect(result).toBe(authAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: authId },
      });
      expect(mockAuthPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockAuthPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when auth does not exist', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findById(authId);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: authId },
      });
      expect(mockAuthPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return auth aggregate when auth exists by email', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const email = 'test@example.com';
      const now = new Date();

      const prismaData: AuthPrismaDto = {
        id: authId,
        userId: userId,
        email: email,
        emailVerified: true,
        phoneNumber: null,
        lastLoginAt: null,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

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

      mockFindFirst.mockResolvedValue(prismaData);
      mockAuthPrismaMapper.toDomainEntity.mockReturnValue(authAggregate);

      const result = await repository.findByEmail(email);

      expect(result).toBe(authAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockAuthPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
    });

    it('should return null when auth does not exist by email', async () => {
      const email = 'nonexistent@example.com';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockAuthPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return auth aggregate when auth exists by user id', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const prismaData: AuthPrismaDto = {
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

      mockFindFirst.mockResolvedValue(prismaData);
      mockAuthPrismaMapper.toDomainEntity.mockReturnValue(authAggregate);

      const result = await repository.findByUserId(userId);

      expect(result).toBe(authAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockAuthPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
    });

    it('should return null when auth does not exist by user id', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByUserId(userId);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockAuthPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
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

      const prismaData: AuthPrismaDto = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: null,
        lastLoginAt: null,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData: AuthPrismaDto = {
        ...prismaData,
        updatedAt: now,
      };

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

      mockAuthPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockAuthPrismaMapper.toDomainEntity.mockReturnValue(savedAuthAggregate);

      const result = await repository.save(authAggregate);

      expect(result).toBe(savedAuthAggregate);
      expect(mockAuthPrismaMapper.toPrismaData).toHaveBeenCalledWith(
        authAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: authId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockAuthPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });
  });

  describe('delete', () => {
    it('should delete auth and return true', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue({});

      const result = await repository.delete(authId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: authId },
      });
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
