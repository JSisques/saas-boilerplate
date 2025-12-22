import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthWriteDatabaseCheckService {
  private readonly logger = new Logger(HealthWriteDatabaseCheckService.name);

  constructor(private readonly typeormMasterService: TypeormMasterService) {}

  /**
   * Checks if the write database (TypeORM/PostgreSQL) is connected and accessible.
   *
   * Executes a simple query to verify the database connection.
   * Returns OK if the connection is successful, ERROR otherwise.
   *
   * @returns {Promise<HealthStatusEnum>} The status of the write database connection.
   */
  async execute(): Promise<HealthStatusEnum> {
    this.logger.log('Checking write database connection');

    try {
      // Execute a simple query to verify the database connection
      // Using query with SELECT 1 is a lightweight way to check connectivity
      await this.typeormMasterService.getDataSource().query('SELECT 1');

      this.logger.log('Write database connection is healthy');
      return HealthStatusEnum.OK;
    } catch (error) {
      this.logger.error(
        `Write database connection check failed: ${error.message}`,
      );
      return HealthStatusEnum.ERROR;
    }
  }
}
