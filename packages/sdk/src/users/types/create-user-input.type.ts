import { UserRole } from './user-role.type.js';
import { UserStatus } from './user-status.type.js';

export type CreateUserInput = {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  lastName?: string;
  userName?: string;
  role: UserRole;
  status: UserStatus;
};


