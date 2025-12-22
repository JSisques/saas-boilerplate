import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate/user-aggregate.factory';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserTypeormEntity } from '@/user-context/users/infrastructure/database/typeorm/entities/user-typeorm.entity';
import { UserTypeOrmMapper } from '@/user-context/users/infrastructure/database/typeorm/mappers/user-typeorm.mapper';

describe('UserTypeOrmMapper', () => {
  let mapper: UserTypeOrmMapper;
  let mockUserAggregateFactory: jest.Mocked<UserAggregateFactory>;

  beforeEach(() => {
    mockUserAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<UserAggregateFactory>;

    mapper = new UserTypeOrmMapper(mockUserAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new UserTypeormEntity();
      typeormEntity.id = userId;
      typeormEntity.userName = 'johndoe';
      typeormEntity.name = 'John';
      typeormEntity.lastName = 'Doe';
      typeormEntity.bio = 'Software developer';
      typeormEntity.avatarUrl = 'https://example.com/avatar.jpg';
      typeormEntity.role = UserRoleEnum.USER;
      typeormEntity.status = UserStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

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

      const result = mapper.toDomainEntity(typeormEntity);

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

    it('should convert TypeORM entity to domain entity with null optional properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new UserTypeormEntity();
      typeormEntity.id = userId;
      typeormEntity.userName = 'johndoe';
      typeormEntity.name = null;
      typeormEntity.lastName = null;
      typeormEntity.bio = null;
      typeormEntity.avatarUrl = null;
      typeormEntity.role = UserRoleEnum.USER;
      typeormEntity.status = UserStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

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

      const result = mapper.toDomainEntity(typeormEntity);

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

    it('should convert TypeORM entity with ADMIN role and INACTIVE status', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new UserTypeormEntity();
      typeormEntity.id = userId;
      typeormEntity.userName = 'johndoe';
      typeormEntity.name = 'John';
      typeormEntity.lastName = 'Doe';
      typeormEntity.bio = null;
      typeormEntity.avatarUrl = null;
      typeormEntity.role = UserRoleEnum.ADMIN;
      typeormEntity.status = UserStatusEnum.INACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

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

      const result = mapper.toDomainEntity(typeormEntity);

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

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
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

      const result = mapper.toTypeormEntity(userAggregate);

      expect(result).toBeInstanceOf(UserTypeormEntity);
      expect(result.id).toBe(userId);
      expect(result.userName).toBe('johndoe');
      expect(result.name).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.bio).toBe('Software developer');
      expect(result.avatarUrl).toBe('https://example.com/avatar.jpg');
      expect(result.role).toBe(UserRoleEnum.USER);
      expect(result.status).toBe(UserStatusEnum.ACTIVE);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(userAggregate.toPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert domain entity to TypeORM entity with null optional properties', () => {
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

      const result = mapper.toTypeormEntity(userAggregate);

      expect(result).toBeInstanceOf(UserTypeormEntity);
      expect(result.id).toBe(userId);
      expect(result.userName).toBe('johndoe');
      expect(result.name).toBeNull();
      expect(result.lastName).toBeNull();
      expect(result.bio).toBeNull();
      expect(result.avatarUrl).toBeNull();
      expect(result.role).toBe(UserRoleEnum.USER);
      expect(result.status).toBe(UserStatusEnum.ACTIVE);
      expect(result.deletedAt).toBeNull();
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

      const result = mapper.toTypeormEntity(userAggregate);

      expect(result).toBeInstanceOf(UserTypeormEntity);
      expect(result.id).toBe(userId);
      expect(result.role).toBe(UserRoleEnum.ADMIN);
      expect(result.status).toBe(UserStatusEnum.INACTIVE);
      expect(result.deletedAt).toBeNull();
    });
  });
});
