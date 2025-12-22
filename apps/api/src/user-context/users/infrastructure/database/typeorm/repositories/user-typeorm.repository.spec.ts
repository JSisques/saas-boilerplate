import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { UserTypeormEntity } from '@/user-context/users/infrastructure/database/typeorm/entities/user-typeorm.entity';
import { UserTypeOrmMapper } from '@/user-context/users/infrastructure/database/typeorm/mappers/user-typeorm.mapper';
import { UserTypeormRepository } from '@/user-context/users/infrastructure/database/typeorm/repositories/user-typeorm.repository';
import { Repository } from 'typeorm';

describe('UserTypeormRepository', () => {
  let repository: UserTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockUserTypeormMapper: jest.Mocked<UserTypeOrmMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<UserTypeormEntity>>;
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
    } as unknown as jest.Mocked<Repository<UserTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockUserTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<UserTypeOrmMapper>;

    repository = new UserTypeormRepository(
      mockTypeormMasterService,
      mockUserTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user aggregate when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new UserTypeormEntity();
      typeormEntity.id = userId;
      typeormEntity.userName = 'johndoe';
      typeormEntity.name = 'John';
      typeormEntity.lastName = 'Doe';
      typeormEntity.bio = null;
      typeormEntity.avatarUrl = null;
      typeormEntity.role = UserRoleEnum.USER;
      typeormEntity.status = UserStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockUserTypeormMapper.toDomainEntity.mockReturnValue(userAggregate);

      const result = await repository.findById(userId);

      expect(result).toBe(userAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockUserTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(userId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByUserName', () => {
    it('should return user aggregate when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userName = 'johndoe';
      const now = new Date();

      const typeormEntity = new UserTypeormEntity();
      typeormEntity.id = userId;
      typeormEntity.userName = userName;
      typeormEntity.name = 'John';
      typeormEntity.lastName = 'Doe';
      typeormEntity.bio = null;
      typeormEntity.avatarUrl = null;
      typeormEntity.role = UserRoleEnum.USER;
      typeormEntity.status = UserStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const userAggregate = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject(userName),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockUserTypeormMapper.toDomainEntity.mockReturnValue(userAggregate);

      const result = await repository.findByUserName(userName);

      expect(result).toBe(userAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(mockUserTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockUserTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when user does not exist', async () => {
      const userName = 'johndoe';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findByUserName(userName);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(mockUserTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should create new user when user does not exist', async () => {
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

      const typeormEntity = new UserTypeormEntity();
      typeormEntity.id = userId;
      typeormEntity.userName = 'johndoe';
      typeormEntity.role = UserRoleEnum.USER;
      typeormEntity.status = UserStatusEnum.ACTIVE;

      const savedTypeormEntity = new UserTypeormEntity();
      savedTypeormEntity.id = userId;
      savedTypeormEntity.userName = 'johndoe';
      savedTypeormEntity.name = 'John';
      savedTypeormEntity.lastName = 'Doe';
      savedTypeormEntity.role = UserRoleEnum.USER;
      savedTypeormEntity.status = UserStatusEnum.ACTIVE;

      const savedUserAggregate = new UserAggregate(
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

      mockUserTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockFindOne.mockResolvedValue(null); // User does not exist
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockUserTypeormMapper.toDomainEntity.mockReturnValue(savedUserAggregate);

      const result = await repository.save(userAggregate);

      expect(result).toBe(savedUserAggregate);
      expect(mockUserTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        userAggregate,
      );
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockUserTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
    });

    it('should update existing user when user exists', async () => {
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

      const existingTypeormEntity = new UserTypeormEntity();
      existingTypeormEntity.id = userId;
      existingTypeormEntity.userName = 'johndoe';
      existingTypeormEntity.role = UserRoleEnum.USER;
      existingTypeormEntity.status = UserStatusEnum.ACTIVE;

      const updatedTypeormEntity = new UserTypeormEntity();
      updatedTypeormEntity.id = userId;
      updatedTypeormEntity.userName = 'johndoe';
      updatedTypeormEntity.role = UserRoleEnum.ADMIN;
      updatedTypeormEntity.status = UserStatusEnum.INACTIVE;

      const newTypeormEntity = new UserTypeormEntity();
      newTypeormEntity.id = userId;
      newTypeormEntity.userName = 'johndoe';
      newTypeormEntity.role = UserRoleEnum.ADMIN;
      newTypeormEntity.status = UserStatusEnum.INACTIVE;

      const savedUserAggregate = new UserAggregate(
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

      mockUserTypeormMapper.toTypeormEntity.mockReturnValue(newTypeormEntity);
      mockFindOne.mockResolvedValue(existingTypeormEntity);
      mockSave.mockResolvedValue(updatedTypeormEntity);
      mockUserTypeormMapper.toDomainEntity.mockReturnValue(savedUserAggregate);

      const result = await repository.save(userAggregate);

      expect(result).toBe(savedUserAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockSave).toHaveBeenCalledWith(existingTypeormEntity);
      expect(mockUserTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        updatedTypeormEntity,
      );
    });
  });

  describe('delete', () => {
    it('should soft delete user and return true', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(userId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(userId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(userId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(userId);
    });

    it('should handle delete errors correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('User not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(userId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(userId);
    });
  });
});
