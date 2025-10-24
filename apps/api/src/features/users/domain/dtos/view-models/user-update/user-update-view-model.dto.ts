import { IUserCreateViewModelDto } from '@/features/users/domain/dtos/view-models/user-create/user-create-view-model.dto';

/**
 * Data Transfer Object for updating a user view model.
 *
 * @interface IUserUpdateViewModelDto
 * @property {string} name - The name of the user.
 * @property {string} bio - The bio of the user.
 * @property {string} avatar - The avatar of the user.
 */
export interface IUserUpdateViewModelDto
  extends Partial<
    Omit<IUserCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
  > {}
