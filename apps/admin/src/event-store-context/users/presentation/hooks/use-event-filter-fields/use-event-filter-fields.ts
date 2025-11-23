import { EventFiltersEnum } from '@/event-store-context/users/domain/enums/event-filters/event-filters.enum';
import { FilterField } from '@repo/shared/presentation/components/organisms/dynamic-filters';

export const useEventFilterFields = (): FilterField[] => {
  return [
    {
      key: EventFiltersEnum.EVENT_TYPE,
      label: 'Event Type',
      type: 'text',
    },
    {
      key: EventFiltersEnum.AGGREGATE_TYPE,
      label: 'Aggregate Type',
      type: 'text',
    },
    {
      key: EventFiltersEnum.AGGREGATE_ID,
      label: 'Aggregate ID',
      type: 'text',
    },
    {
      key: EventFiltersEnum.FROM,
      label: 'From',
      type: 'date',
    },
    {
      key: EventFiltersEnum.TO,
      label: 'To',
      type: 'date',
    },
  ];
};
