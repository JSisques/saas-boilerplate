import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';

/**
 * Data Transfer Object for updating a auth.
 *
 * Allows partial updating of a auth entity, excluding the auth's immutable identifier (`id`).
 * @interface IAuthUpdateDto
 * @extends Partial<Omit<IAuthCreateDto, 'id'>>
 */
export interface IAuthUpdateDto
  extends Partial<Omit<IAuthCreateDto, 'id' | 'userId'>> {}
