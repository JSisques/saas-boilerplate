import { IUserCreateDto } from "@/user-context/users/domain/dtos/entities/user-create/user-create.dto";

/**
 * Data Transfer Object for updating a user.
 *
 * Allows partial updating of a user entity, excluding the user's immutable identifier (`id`).
 * @type IUserUpdateDto
 * @extends Partial<Omit<IUserCreateDto, 'id'>>
 */
export type IUserUpdateDto = Partial<Omit<IUserCreateDto, "id">>;
