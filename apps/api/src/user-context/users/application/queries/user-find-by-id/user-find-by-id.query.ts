import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserFindByIdQueryDto } from '@/user-context/users/application/dtos/queries/user-find-by-id/user-find-by-id-query.dto';

export class UserFindByIdQuery {
  readonly id: UserUuidValueObject;

  constructor(props: IUserFindByIdQueryDto) {
    this.id = new UserUuidValueObject(props.id);
  }
}
