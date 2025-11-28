import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';

/**
 * Data Transfer Object for deleting a auth.
 *
 * Allows deleting a auth entity by specifying only the auth's immutable identifier (`id`).
 * @type IAuthDeleteDto
 * @property {string} id - The immutable identifier of the auth to delete.
 */
export type IAuthDeleteDto = Pick<IAuthCreateDto, 'id'>;
