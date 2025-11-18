import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { BaseSortInput } from './base-sort.input';

describe('BaseSortInput', () => {
  it('should be defined', () => {
    expect(BaseSortInput).toBeDefined();
  });

  it('should create a sort input with field and direction', () => {
    const sort = new BaseSortInput();
    sort.field = 'name';
    sort.direction = SortDirection.ASC;

    expect(sort.field).toBe('name');
    expect(sort.direction).toBe(SortDirection.ASC);
  });

  it('should accept ASC direction', () => {
    const sort = new BaseSortInput();
    sort.field = 'createdAt';
    sort.direction = SortDirection.ASC;

    expect(sort.direction).toBe(SortDirection.ASC);
  });

  it('should accept DESC direction', () => {
    const sort = new BaseSortInput();
    sort.field = 'updatedAt';
    sort.direction = SortDirection.DESC;

    expect(sort.direction).toBe(SortDirection.DESC);
  });

  it('should accept different field names', () => {
    const sort = new BaseSortInput();
    sort.field = 'email';
    sort.direction = SortDirection.ASC;

    expect(sort.field).toBe('email');
  });
});

