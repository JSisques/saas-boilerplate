import type {
  FindByCriteriaInput,
  PaginatedResult,
} from '@/shared/types/index';

export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export type UserResponse = {
  id: string;
  userName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  avatarUrl?: string;
  bio?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserFindByIdInput = {
  id: string;
};

export type CreateUserInput = {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  lastName?: string;
  userName?: string;
  role: UserRole;
  status: UserStatus;
};

export type UpdateUserInput = {
  id: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  lastName?: string;
  userName?: string;
  role?: UserRole;
  status?: UserStatus;
};

export type DeleteUserInput = {
  id: string;
};

export type UserFindByCriteriaInput = FindByCriteriaInput;
export type PaginatedUserResult = PaginatedResult<UserResponse>;
