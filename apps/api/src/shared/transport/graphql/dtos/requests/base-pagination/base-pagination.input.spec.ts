import { BasePaginationInput } from './base-pagination.input';

describe('BasePaginationInput', () => {
  it('should be defined', () => {
    expect(BasePaginationInput).toBeDefined();
  });

  it('should create a pagination input with page and perPage', () => {
    const pagination = new BasePaginationInput();
    pagination.page = 1;
    pagination.perPage = 10;

    expect(pagination.page).toBe(1);
    expect(pagination.perPage).toBe(10);
  });

  it('should accept different page values', () => {
    const pagination = new BasePaginationInput();
    pagination.page = 5;
    pagination.perPage = 20;

    expect(pagination.page).toBe(5);
    expect(pagination.perPage).toBe(20);
  });

  it('should accept large page numbers', () => {
    const pagination = new BasePaginationInput();
    pagination.page = 100;
    pagination.perPage = 50;

    expect(pagination.page).toBe(100);
    expect(pagination.perPage).toBe(50);
  });

  it('should accept different perPage values', () => {
    const pagination = new BasePaginationInput();
    pagination.page = 1;
    pagination.perPage = 25;

    expect(pagination.perPage).toBe(25);
  });
});
