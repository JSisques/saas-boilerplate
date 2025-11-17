import { UserRole } from './user-role.type.js';
import { UserStatus } from './user-status.type.js';

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
