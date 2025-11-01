import { IUserCreateCommandDto } from '@/user-context/users/application/dtos/commands/user-create/user-create-command.dto';

/**
 * Data Transfer Object for updating a user via command layer.
 *
 * @interface IUserUpdateCommandDto
 * @property {string} id - The id of the user to update.
 * @extends Partial<IUserCreateCommandDto>
 */
export interface IUserUpdateCommandDto extends Partial<IUserCreateCommandDto> {
  id: string;
  status?: string;
}
