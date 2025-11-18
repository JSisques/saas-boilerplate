import { Criteria } from '@/shared/domain/entities/criteria';
import { BaseDatabaseRepository } from './base-database.repository';

describe('BaseDatabaseRepository', () => {
  let repository: BaseDatabaseRepository;

  beforeEach(() => {
    repository = new BaseDatabaseRepository();
  });

  describe('calculatePagination', () => {
    it('should calculate pagination with default values', async () => {
      const criteria = new Criteria();

      const result = await repository.calculatePagination(criteria);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
    });

    it('should calculate pagination with custom page and perPage', async () => {
      const criteria = new Criteria([], [], { page: 3, perPage: 20 });

      const result = await repository.calculatePagination(criteria);

      expect(result.page).toBe(3);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(40); // (3 - 1) * 20
    });

    it('should calculate pagination for first page', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 5 });

      const result = await repository.calculatePagination(criteria);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(5);
      expect(result.skip).toBe(0);
    });

    it('should calculate pagination for second page', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 15 });

      const result = await repository.calculatePagination(criteria);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(15);
      expect(result.skip).toBe(15); // (2 - 1) * 15
    });

    it('should handle large page numbers', async () => {
      const criteria = new Criteria([], [], { page: 100, perPage: 50 });

      const result = await repository.calculatePagination(criteria);

      expect(result.page).toBe(100);
      expect(result.limit).toBe(50);
      expect(result.skip).toBe(4950); // (100 - 1) * 50
    });
  });
});
