import { UserPrimitives } from '@/features/users/domain/primitives/user.primitives';

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly data: Partial<Omit<UserPrimitives, 'id'>>,
  ) {}
}
