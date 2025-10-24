import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
  description: 'The operator to filter by',
});

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'The direction to sort by',
});
