import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { MongoService } from '@/shared/infrastructure/database/mongodb/mongo.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthReadDatabaseCheckService {
  private readonly logger = new Logger(HealthReadDatabaseCheckService.name);

  constructor(private readonly mongoService: MongoService) {}

  /**
   * Checks if the read database (MongoDB) is connected and accessible.
   *
   * Executes a simple ping command to verify the database connection.
   * Returns OK if the connection is successful, ERROR otherwise.
   *
   * @returns {Promise<HealthStatusEnum>} The status of the read database connection.
   */
  async execute(): Promise<HealthStatusEnum> {
    this.logger.log('Checking read database connection');

    try {
      // Execute a simple ping command to verify the database connection
      // Using admin().ping() is a lightweight way to check MongoDB connectivity
      const db = this.mongoService.getDatabase();
      await db.admin().ping();

      this.logger.log('Read database connection is healthy');
      return HealthStatusEnum.OK;
    } catch (error) {
      this.logger.error(
        `Read database connection check failed: ${error.message}`,
      );
      return HealthStatusEnum.ERROR;
    }
  }
}
