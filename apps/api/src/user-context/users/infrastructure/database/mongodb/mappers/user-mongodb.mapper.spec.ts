import { UserViewModelFactory } from '@/user-context/users/domain/factories/user-view-model/user-view-model.factory';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserMongoDBMapper } from '@/user-context/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper';
import { UserMongoDbDto } from '@/user-context/users/infrastructure/database/mongodb/dtos/user-mongodb.dto';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';

describe('UserMongoDBMapper', () => {
  let mapper: UserMongoDBMapper;
  let mockUserViewModelFactory: jest.Mocked<UserViewModelFactory>;

  beforeEach(() => {
    mockUserViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<UserViewModelFactory>;

    mapper = new UserMongoDBMapper(mockUserViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: UserMongoDbDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockUserViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockUserViewModelFactory.create).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
      expect(mockUserViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document to view model with null optional properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: UserMongoDbDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockUserViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockUserViewModelFactory.create).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert MongoDB document with ADMIN role and INACTIVE status', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: UserMongoDbDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockUserViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockUserViewModelFactory.create).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB data with all properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert view model to MongoDB data with null optional properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert view model with ADMIN role and INACTIVE status', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      });
    });
  });
});

