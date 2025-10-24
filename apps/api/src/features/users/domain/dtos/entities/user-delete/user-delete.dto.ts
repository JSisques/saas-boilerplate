import { IUserCreateDto } from '@/features/users/domain/dtos/entities/user-create/user-create.dto';

/**
 * Data Transfer Object for deleting a user.
 *
 * Allows deleting a user entity by specifying only the user's immutable identifier (`id`).
 * @interface IUserDeleteDto
 * @property {string} id - The immutable identifier of the user to delete.
 */
export interface IUserDeleteDto extends Pick<IUserCreateDto, 'id'> {}
