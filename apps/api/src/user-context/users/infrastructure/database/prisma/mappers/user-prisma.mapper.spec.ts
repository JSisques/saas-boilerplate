import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate/user-aggregate.factory';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserPrismaDto } from '@/user-context/users/infrastructure/database/prisma/dtos/user-prisma.dto';
import { UserPrismaMapper } from '@/user-context/users/infrastructure/database/prisma/mappers/user-prisma.mapper';
import {
  StatusEnum as PrismaStatusEnum,
  UserRoleEnum as PrismaUserRoleEnum,
} from '@prisma/client';

describe('UserPrismaMapper', () => {
  let mapper: UserPrismaMapper;
  let mockUserAggregateFactory: jest.Mocked<UserAggregateFactory>;

  beforeEach(() => {
    mockUserAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<UserAggregateFactory>;

    mapper = new UserPrismaMapper(mockUserAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: UserPrismaDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const mockUserAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockUserAggregateFactory.fromPrimitives.mockReturnValue(
        mockUserAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockUserAggregate);
      expect(mockUserAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockUserAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert Prisma data to domain entity with null optional properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: UserPrismaDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const mockUserAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockUserAggregateFactory.fromPrimitives.mockReturnValue(
        mockUserAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockUserAggregate);
      expect(mockUserAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert Prisma data with ADMIN role and INACTIVE status', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: UserPrismaDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.ADMIN,
        status: PrismaStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const mockUserAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.ADMIN),
          status: new UserStatusValueObject(UserStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockUserAggregateFactory.fromPrimitives.mockReturnValue(
        mockUserAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockUserAggregate);
      expect(mockUserAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      // Mock toPrimitives to return expected data
      jest.spyOn(userAggregate, 'toPrimitives').mockReturnValue({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toPrismaData(userAggregate);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
      expect(userAggregate.toPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert domain entity to Prisma data with null optional properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      jest.spyOn(userAggregate, 'toPrimitives').mockReturnValue({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toPrismaData(userAggregate);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.USER,
        status: PrismaStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert domain entity with ADMIN role and INACTIVE status', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.ADMIN),
          status: new UserStatusValueObject(UserStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      jest.spyOn(userAggregate, 'toPrimitives').mockReturnValue({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toPrismaData(userAggregate);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: PrismaUserRoleEnum.ADMIN,
        status: PrismaStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });
  });
});
