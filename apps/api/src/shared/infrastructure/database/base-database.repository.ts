import { Logger } from '@nestjs/common';
import { Criteria } from '@shared/domain/entities/criteria';

export class BaseDatabaseRepository {
  protected logger: Logger;

  constructor() {}

  /**
   * Builds a database query from a criteria
   *
   * @param criteria - The criteria to build the query from
   * @returns The database query
   */
  async calculatePagination(criteria: Criteria): Promise<{
    page: number;
    limit: number;
    skip: number;
  }> {
    const page = criteria.pagination.page || 1;
    const limit = criteria.pagination.perPage || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }
}
