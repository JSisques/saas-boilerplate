import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { BaseFilterInput } from '../base-filter/base-filter.input';
import { BasePaginationInput } from '../base-pagination/base-pagination.input';
import { BaseSortInput } from '../base-sort/base-sort.input';
import { BaseFindByCriteriaInput } from './base-find-by-criteria.input';

describe('BaseFindByCriteriaInput', () => {
  it('should be defined', () => {
    expect(BaseFindByCriteriaInput).toBeDefined();
  });

  it('should create a criteria input with empty arrays by default', () => {
    const criteria = new BaseFindByCriteriaInput();

    expect(criteria.filters).toBeUndefined();
    expect(criteria.sorts).toBeUndefined();
    expect(criteria.pagination).toBeUndefined();
  });

  it('should accept filters array', () => {
    const filter: BaseFilterInput = {
      field: 'status',
      operator: FilterOperator.EQUALS,
      value: 'active',
    };

    const criteria = new BaseFindByCriteriaInput();
    criteria.filters = [filter];

    expect(criteria.filters).toHaveLength(1);
    expect(criteria.filters[0]).toEqual(filter);
  });

  it('should accept multiple filters', () => {
    const filter1: BaseFilterInput = {
      field: 'status',
      operator: FilterOperator.EQUALS,
      value: 'active',
    };
    const filter2: BaseFilterInput = {
      field: 'age',
      operator: FilterOperator.GREATER_THAN,
      value: '18',
    };

    const criteria = new BaseFindByCriteriaInput();
    criteria.filters = [filter1, filter2];

    expect(criteria.filters).toHaveLength(2);
    expect(criteria.filters[0]).toEqual(filter1);
    expect(criteria.filters[1]).toEqual(filter2);
  });

  it('should accept sorts array', () => {
    const sort: BaseSortInput = {
      field: 'name',
      direction: SortDirection.ASC,
    };

    const criteria = new BaseFindByCriteriaInput();
    criteria.sorts = [sort];

    expect(criteria.sorts).toHaveLength(1);
    expect(criteria.sorts[0]).toEqual(sort);
  });

  it('should accept multiple sorts', () => {
    const sort1: BaseSortInput = {
      field: 'name',
      direction: SortDirection.ASC,
    };
    const sort2: BaseSortInput = {
      field: 'createdAt',
      direction: SortDirection.DESC,
    };

    const criteria = new BaseFindByCriteriaInput();
    criteria.sorts = [sort1, sort2];

    expect(criteria.sorts).toHaveLength(2);
    expect(criteria.sorts[0]).toEqual(sort1);
    expect(criteria.sorts[1]).toEqual(sort2);
  });

  it('should accept pagination', () => {
    const pagination: BasePaginationInput = {
      page: 1,
      perPage: 10,
    };

    const criteria = new BaseFindByCriteriaInput();
    criteria.pagination = pagination;

    expect(criteria.pagination).toEqual(pagination);
    expect(criteria.pagination.page).toBe(1);
    expect(criteria.pagination.perPage).toBe(10);
  });

  it('should accept all properties together', () => {
    const filter: BaseFilterInput = {
      field: 'status',
      operator: FilterOperator.EQUALS,
      value: 'active',
    };
    const sort: BaseSortInput = {
      field: 'name',
      direction: SortDirection.ASC,
    };
    const pagination: BasePaginationInput = {
      page: 2,
      perPage: 20,
    };

    const criteria = new BaseFindByCriteriaInput();
    criteria.filters = [filter];
    criteria.sorts = [sort];
    criteria.pagination = pagination;

    expect(criteria.filters).toHaveLength(1);
    expect(criteria.sorts).toHaveLength(1);
    expect(criteria.pagination).toEqual(pagination);
  });
});
