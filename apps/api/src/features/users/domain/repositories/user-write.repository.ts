import { UserAggregate } from '@/features/users/domain/aggregates/user.aggregate';

export const USER_WRITE_REPOSITORY_TOKEN = Symbol('UserWriteRepository');

export interface UserWriteRepository {
  findById(id: string): Promise<UserAggregate | null>;
  findByUserName(userName: string): Promise<UserAggregate | null>;
  save(user: UserAggregate): Promise<UserAggregate>;
  delete(id: string): Promise<boolean>;
}
