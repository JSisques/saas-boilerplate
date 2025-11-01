import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';

export const AUTH_WRITE_REPOSITORY_TOKEN = Symbol('AuthWriteRepository');

export interface AuthWriteRepository {
  findById(id: string): Promise<AuthAggregate | null>;
  findByEmail(email: string): Promise<AuthAggregate | null>;
  findByUserId(userId: string): Promise<AuthAggregate | null>;
  save(auth: AuthAggregate): Promise<AuthAggregate>;
  delete(id: string): Promise<boolean>;
}
