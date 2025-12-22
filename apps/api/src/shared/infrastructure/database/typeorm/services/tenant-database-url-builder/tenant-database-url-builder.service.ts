import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service to build tenant database URLs dynamically from environment variables
 * This ensures credentials are never stored in the database
 */
@Injectable()
export class TenantDatabaseUrlBuilderService {
  private readonly logger = new Logger(TenantDatabaseUrlBuilderService.name);
  constructor(private readonly configService: ConfigService) {}

  /**
   * Build a complete database URL dynamically from environment variables
   * @param databaseName - The database name (stored in databaseUrl field)
   * @returns Complete database connection URL with credentials from .env
   */
  buildDatabaseUrl(databaseName: string): string {
    this.logger.log(`Building database URL for database: ${databaseName}`);
    const username =
      this.configService.get<string>('POSTGRES_USERNAME') ||
      this.configService.get<string>('POSTGRES_USER') ||
      'postgres';
    const password = this.configService.get<string>('POSTGRES_PASSWORD') || '';
    const host =
      this.configService.get<string>('POSTGRES_HOST') ||
      this.configService.get<string>('DATABASE_HOST') ||
      'localhost';
    const port =
      this.configService.get<string>('POSTGRES_PORT') ||
      this.configService.get<string>('DATABASE_PORT') ||
      '5432';

    // Get master database URL to extract additional settings (like SSL)
    const masterDatabaseUrl =
      this.configService.get<string>('DATABASE_URL') || '';

    try {
      const masterUrl = new URL(masterDatabaseUrl);
      // Preserve query parameters (like ?sslmode=require)
      const queryString = masterUrl.search || '';
      return `postgresql://${username}:${password}@${host}:${port}/${databaseName}${queryString}`;
    } catch (error) {
      this.logger.error(`Failed to build database URL: ${error}`);
      return `postgresql://${username}:${password}@${host}:${port}/${databaseName}`;
    }
  }
}
