import { FeatureFiltersEnum } from '@/feature-context/features/presentation/enums/feature-filters.enum';
import { FEATURE_STATUSES } from '@repo/sdk';
import { FilterField } from '@repo/shared/presentation/components/organisms/dynamic-filters';

export const useFeatureFilterFields = (): FilterField[] => {
  return [
    {
      key: FeatureFiltersEnum.STATUS,
      label: 'Status',
      type: 'enum',
      enumOptions: FEATURE_STATUSES.map((status: string) => ({
        label: status,
        value: status,
      })),
    },
    {
      key: FeatureFiltersEnum.KEY,
      label: 'Key',
      type: 'text',
    },
    {
      key: FeatureFiltersEnum.NAME,
      label: 'Name',
      type: 'text',
    },
    {
      key: FeatureFiltersEnum.DESCRIPTION,
      label: 'Description',
      type: 'text',
    },
  ];
};
