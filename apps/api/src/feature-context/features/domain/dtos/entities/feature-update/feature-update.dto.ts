import { IFeatureCreateDto } from '@/feature-context/features/domain/dtos/entities/feature-create/feature-create.dto';

/**
 * Interface representing the structure required to update a feature entity.
 * All properties are optional except for the id which cannot be changed.
 *
 * @interface IFeatureUpdateDto
 */
export type IFeatureUpdateDto = Partial<Omit<IFeatureCreateDto, 'id'>>;
