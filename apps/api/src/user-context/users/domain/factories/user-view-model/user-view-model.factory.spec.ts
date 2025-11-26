import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserViewModelFactory } from '@/user-context/users/domain/factories/user-view-model/user-view-model.factory';
import { UserPrimitives } from '@/user-context/users/domain/primitives/user.primitives';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';

describe('UserViewModelFactory', () => {
  let factory: UserViewModelFactory;

  beforeEach(() => {
    factory = new UserViewModelFactory();
  });

  describe('create', () => {
    it('should create a UserViewModel from a DTO with all fields', () => {
      const now = new Date();

      const dto: IUserCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(UserViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.userName).toBe(dto.userName);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.lastName).toBe(dto.lastName);
      expect(viewModel.role).toBe(dto.role);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.bio).toBe(dto.bio);
      expect(viewModel.avatarUrl).toBe(dto.avatarUrl);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a UserViewModel from a DTO with null fields', () => {
      const now = new Date();

      const dto: IUserCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'johndoe',
        name: null,
        lastName: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        bio: null,
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(UserViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.userName).toBe(dto.userName);
      expect(viewModel.name).toBeNull();
      expect(viewModel.lastName).toBeNull();
      expect(viewModel.bio).toBeNull();
      expect(viewModel.avatarUrl).toBeNull();
      expect(viewModel.createdAt).toBe(dto.createdAt);
      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a UserViewModel from primitives with all fields', () => {
      const now = new Date();

      const primitives: UserPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(UserViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.userName).toBe(primitives.userName);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.lastName).toBe(primitives.lastName);
      expect(viewModel.role).toBe(primitives.role);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.bio).toBe(primitives.bio);
      expect(viewModel.avatarUrl).toBe(primitives.avatarUrl);
      expect(viewModel.createdAt).toBe(primitives.createdAt);
      expect(viewModel.updatedAt).toBe(primitives.updatedAt);
    });

    it('should create a UserViewModel from primitives with null fields', () => {
      const now = new Date();

      const primitives: UserPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'johndoe',
        name: null,
        lastName: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.BLOCKED,
        bio: null,
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(UserViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.userName).toBe(primitives.userName);
      expect(viewModel.name).toBeNull();
      expect(viewModel.lastName).toBeNull();
      expect(viewModel.bio).toBeNull();
      expect(viewModel.avatarUrl).toBeNull();
      expect(viewModel.role).toBe(primitives.role);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.createdAt).toBe(now);
      expect(viewModel.updatedAt).toBe(now);
    });

    it('should set createdAt and updatedAt to current date', () => {
      const now = new Date();

      const primitives: UserPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(viewModel.updatedAt.getTime());
    });
  });

  describe('fromAggregate', () => {
    it('should create a UserViewModel from aggregate with all fields', () => {
      const now = new Date();

      const aggregate = new UserAggregate(
        {
          id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userName: new UserUserNameValueObject('johndoe'),
          name: new UserNameValueObject('John'),
          lastName: new UserLastNameValueObject('Doe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          bio: new UserBioValueObject('Software developer'),
          avatarUrl: new UserAvatarUrlValueObject(
            'https://example.com/avatar.jpg',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(UserViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.userName).toBe(aggregate.userName.value);
      expect(viewModel.name).toBe(aggregate.name?.value);
      expect(viewModel.lastName).toBe(aggregate.lastName?.value);
      expect(viewModel.role).toBe(aggregate.role.value);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.bio).toBe(aggregate.bio?.value);
      expect(viewModel.avatarUrl).toBe(aggregate.avatarUrl?.value);
      expect(viewModel.createdAt).toBe(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toBe(aggregate.updatedAt.value);
    });

    it('should create a UserViewModel from aggregate with null fields', () => {
      const now = new Date();

      const aggregate = new UserAggregate(
        {
          id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userName: new UserUserNameValueObject('johndoe'),
          name: null,
          lastName: null,
          role: new UserRoleValueObject(UserRoleEnum.ADMIN),
          status: new UserStatusValueObject(UserStatusEnum.INACTIVE),
          bio: null,
          avatarUrl: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(UserViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.userName).toBe(aggregate.userName.value);
      expect(viewModel.name).toBeNull();
      expect(viewModel.lastName).toBeNull();
      expect(viewModel.bio).toBeNull();
      expect(viewModel.avatarUrl).toBeNull();
      expect(viewModel.role).toBe(aggregate.role.value);
      expect(viewModel.status).toBe(aggregate.status.value);
    });

    it('should set createdAt and updatedAt to current date', () => {
      const now = new Date();

      const aggregate = new UserAggregate(
        {
          id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userName: new UserUserNameValueObject('johndoe'),
          name: new UserNameValueObject('John'),
          lastName: new UserLastNameValueObject('Doe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(viewModel.updatedAt.getTime());
    });

    it('should handle optional fields that are null correctly', () => {
      const now = new Date();

      const aggregate = new UserAggregate(
        {
          id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.name).toBeNull();
      expect(viewModel.lastName).toBeNull();
      expect(viewModel.bio).toBeNull();
      expect(viewModel.avatarUrl).toBeNull();
      expect(viewModel.createdAt).toBe(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toBe(aggregate.updatedAt.value);
    });
  });
});
