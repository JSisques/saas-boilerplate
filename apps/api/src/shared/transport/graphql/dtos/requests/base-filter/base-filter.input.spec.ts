import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { BaseFilterInput } from './base-filter.input';

describe('BaseFilterInput', () => {
  it('should be defined', () => {
    expect(BaseFilterInput).toBeDefined();
  });

  it('should create a filter input with all properties', () => {
    const filter = new BaseFilterInput();
    filter.field = 'status';
    filter.operator = FilterOperator.EQUALS;
    filter.value = 'active';

    expect(filter.field).toBe('status');
    expect(filter.operator).toBe(FilterOperator.EQUALS);
    expect(filter.value).toBe('active');
  });

  it('should accept different filter operators', () => {
    const filter = new BaseFilterInput();
    filter.field = 'name';
    filter.operator = FilterOperator.LIKE;
    filter.value = 'test';

    expect(filter.operator).toBe(FilterOperator.LIKE);
  });

  it('should accept IN operator', () => {
    const filter = new BaseFilterInput();
    filter.field = 'id';
    filter.operator = FilterOperator.IN;
    filter.value = '123';

    expect(filter.operator).toBe(FilterOperator.IN);
  });

  it('should accept GREATER_THAN operator', () => {
    const filter = new BaseFilterInput();
    filter.field = 'age';
    filter.operator = FilterOperator.GREATER_THAN;
    filter.value = '18';

    expect(filter.operator).toBe(FilterOperator.GREATER_THAN);
  });

  it('should accept LESS_THAN operator', () => {
    const filter = new BaseFilterInput();
    filter.field = 'age';
    filter.operator = FilterOperator.LESS_THAN;
    filter.value = '65';

    expect(filter.operator).toBe(FilterOperator.LESS_THAN);
  });

  it('should accept GREATER_THAN_OR_EQUAL operator', () => {
    const filter = new BaseFilterInput();
    filter.field = 'age';
    filter.operator = FilterOperator.GREATER_THAN_OR_EQUAL;
    filter.value = '18';

    expect(filter.operator).toBe(FilterOperator.GREATER_THAN_OR_EQUAL);
  });

  it('should accept LESS_THAN_OR_EQUAL operator', () => {
    const filter = new BaseFilterInput();
    filter.field = 'age';
    filter.operator = FilterOperator.LESS_THAN_OR_EQUAL;
    filter.value = '65';

    expect(filter.operator).toBe(FilterOperator.LESS_THAN_OR_EQUAL);
  });

  it('should accept NOT_EQUALS operator', () => {
    const filter = new BaseFilterInput();
    filter.field = 'status';
    filter.operator = FilterOperator.NOT_EQUALS;
    filter.value = 'inactive';

    expect(filter.operator).toBe(FilterOperator.NOT_EQUALS);
  });
});

