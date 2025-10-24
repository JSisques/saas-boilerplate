import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { registerEnumType } from '@nestjs/graphql';
import { RoleEnum, StatusEnum } from '@prisma/client';

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
  description: 'The operator to filter by',
});

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'The direction to sort by',
});

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
  description: 'The role of the user',
});

registerEnumType(StatusEnum, {
  name: 'StatusEnum',
  description: 'The status of the user',
});
