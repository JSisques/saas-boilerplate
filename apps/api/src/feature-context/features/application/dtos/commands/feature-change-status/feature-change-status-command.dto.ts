import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';

/**
 * Data Transfer Object for changing a feature status via command layer.
 *
 * @interface IFeatureChangeStatusCommandDto
 * @property {string} id - The id of the feature to change status.
 * @property {FeatureStatusEnum} status - The new status to set.
 */
export interface IFeatureChangeStatusCommandDto {
  id: string;
  status: FeatureStatusEnum;
}
