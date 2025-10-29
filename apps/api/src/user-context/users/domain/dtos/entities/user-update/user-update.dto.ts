import { IUserCreateDto } from '@/user-context/users/domain/dtos/entities/user-create/user-create.dto';

/**
 * Data Transfer Object for updating a user.
 *
 * Allows partial updating of a user entity, excluding the user's immutable identifier (`id`).
 * @interface IUserUpdateDto
 * @extends Partial<Omit<IUserCreateDto, 'id'>>
 */
export interface IUserUpdateDto extends Partial<Omit<IUserCreateDto, 'id'>> {}
