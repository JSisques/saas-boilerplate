import { IAuthCreateViewModelDto } from '@/auth/domain/dtos/view-models/auth-create/auth-create-view-model.dto';

/**
 * Data Transfer Object for updating a auth view model.
 *
 * @interface IAuthUpdateViewModelDto
 * @property {string} email - The email of the auth.
 * @property {boolean} emailVerified - The email verified of the auth.
 * @property {Date | null} lastLoginAt - The last login at of the auth.
 * @property {string | null} passwordHash - The password hash of the auth.
 * @property {string | null} phoneNumber - The phone number of the auth.
 * @property {string} provider - The provider of the auth.
 * @property {string | null} providerId - The provider id of the auth.
 * @property {boolean} twoFactorEnabled - The two factor enabled of the auth.
 */
export interface IAuthUpdateViewModelDto
  extends Partial<
    Omit<IAuthCreateViewModelDto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  > {}
