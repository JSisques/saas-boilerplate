import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserPrismaDto } from '@/user-context/users/infrastructure/database/prisma/dtos/user-prisma.dto';
import { UserPrismaMapper } from '@/user-context/users/infrastructure/database/prisma/mappers/user-prisma.mapper';
import { UserPrismaRepository } from '@/user-context/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import {
  StatusEnum as PrismaStatusEnum,
  UserRoleEnum as PrismaUserRoleEnum,
} from '@prisma/client';

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;
  let mockPrismaService: any;
  let mockUserPrismaMapper: jest.Mocked<UserPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      user: {
        findUnique: mockFindUnique,
        upsert: mockUpsert,
        delete: mockDelete,
      },
    };

    mockUserPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<UserPrismaMapper>;

    repository = new UserPrismaRepository(
      mockPrismaService,
      mockUserPrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user aggregate when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const prismaData: UserPrismaDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
      };

      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
        },
        false,
      );

      mockFindUnique.mockResolvedValue(prismaData);
      mockUserPrismaMapper.toDomainEntity.mockReturnValue(userAggregate);

      const result = await repository.findById(userId);

      expect(result).toBe(userAggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockUserPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(userId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByUserName', () => {
    it('should return user aggregate when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userName = 'johndoe';
      const prismaData: UserPrismaDto = {
        id: userId,
        userName,
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
      };

      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject(userName),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
        },
        false,
      );

      mockFindUnique.mockResolvedValue(prismaData);
      mockUserPrismaMapper.toDomainEntity.mockReturnValue(userAggregate);

      const result = await repository.findByUserName(userName);

      expect(result).toBe(userAggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(mockUserPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockUserPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when user does not exist', async () => {
      const userName = 'johndoe';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findByUserName(userName);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(mockUserPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save user aggregate and return saved aggregate', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
        },
        false,
      );

      const prismaData: UserPrismaDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
      };

      const savedPrismaData: UserPrismaDto = {
        ...prismaData,
        name: 'John',
        lastName: 'Doe',
      };

      const savedUserAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
        },
        false,
      );

      mockUserPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockUserPrismaMapper.toDomainEntity.mockReturnValue(savedUserAggregate);

      const result = await repository.save(userAggregate);

      expect(result).toBe(savedUserAggregate);
      expect(mockUserPrismaMapper.toPrismaData).toHaveBeenCalledWith(
        userAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: userId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockUserPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });

    it('should handle upsert operation for existing user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.ADMIN),
          status: new UserStatusValueObject(UserStatusEnum.INACTIVE),
        },
        false,
      );

      const prismaData: UserPrismaDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.ADMIN,
        status: PrismaStatusEnum.INACTIVE,
      };

      mockUserPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(prismaData);
      mockUserPrismaMapper.toDomainEntity.mockReturnValue(userAggregate);

      const result = await repository.save(userAggregate);

      expect(result).toBe(userAggregate);
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: userId },
        update: prismaData,
        create: prismaData,
      });
    });
  });

  describe('delete', () => {
    it('should delete user and return true', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
      });

      const result = await repository.delete(userId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('User not found');

      mockDelete.mockRejectedValue(error);

      await expect(repository.delete(userId)).rejects.toThrow(error);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
