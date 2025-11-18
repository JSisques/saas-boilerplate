import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { PrismaService } from '@/shared/infrastructure/database/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthWriteDatabaseCheckService {
  private readonly logger = new Logger(HealthWriteDatabaseCheckService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Checks if the write database (Prisma/PostgreSQL) is connected and accessible.
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
      // Using $queryRaw with SELECT 1 is a lightweight way to check connectivity
      await this.prismaService.$queryRaw`SELECT 1`;

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
