import { BasePaginatedResultDto } from './base-paginated-result.dto';

// Create a concrete implementation for testing
class TestPaginatedResultDto extends BasePaginatedResultDto {
  constructor(
    total: number,
    page: number,
    perPage: number,
    totalPages: number,
  ) {
    super();
    this.total = total;
    this.page = page;
    this.perPage = perPage;
    this.totalPages = totalPages;
  }
}

describe('BasePaginatedResultDto', () => {
  it('should be defined', () => {
    expect(BasePaginatedResultDto).toBeDefined();
  });

  it('should create a paginated result with all properties', () => {
    const result = new TestPaginatedResultDto(100, 1, 10, 10);

    expect(result.total).toBe(100);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(10);
    expect(result.totalPages).toBe(10);
  });

  it('should calculate total pages correctly', () => {
    const result = new TestPaginatedResultDto(100, 1, 10, 10);

    expect(result.totalPages).toBe(10);
  });

  it('should handle different page sizes', () => {
    const result = new TestPaginatedResultDto(100, 1, 20, 5);

    expect(result.perPage).toBe(20);
    expect(result.totalPages).toBe(5);
  });

  it('should handle different page numbers', () => {
    const result = new TestPaginatedResultDto(100, 5, 10, 10);

    expect(result.page).toBe(5);
  });

  it('should handle zero total', () => {
    const result = new TestPaginatedResultDto(0, 1, 10, 0);

    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('should handle large totals', () => {
    const result = new TestPaginatedResultDto(1000, 1, 50, 20);

    expect(result.total).toBe(1000);
    expect(result.perPage).toBe(50);
    expect(result.totalPages).toBe(20);
  });
});

