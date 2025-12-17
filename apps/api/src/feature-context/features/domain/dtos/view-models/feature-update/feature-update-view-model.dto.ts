import { IFeatureCreateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-create/feature-create-view-model.dto';

/**
 * Feature update view model Data Transfer Object.
 * All properties are optional except for the id which cannot be changed.
 *
 * @interface IFeatureUpdateViewModelDto
 */
export type IFeatureUpdateViewModelDto = Partial<
  Omit<IFeatureCreateViewModelDto, 'id'>
>;
