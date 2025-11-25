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
   * Build a complete MongoDB connection URL dynamically from environment variables
   * @param databaseName - The database name (stored in databaseName field)
   * @returns Complete MongoDB connection URL with credentials from .env
   */
  buildDatabaseUrl(databaseName: string): string {
    this.logger.log(`Building MongoDB URL for database: ${databaseName}`);

    // Get master database URL to extract connection string format
    const masterDatabaseUrl =
      this.configService.get<string>('MONGODB_URI') || '';

    try {
      // If master URL is provided, try to parse it and build tenant URL
      if (masterDatabaseUrl) {
        // Try to parse as URL (mongodb:// or mongodb+srv://)
        try {
          const url = new URL(masterDatabaseUrl);
          const protocol = url.protocol.replace(':', ''); // Remove colon
          const host = url.hostname;
          const port = url.port || (protocol === 'mongodb+srv' ? '' : '27017');

          // Build new URL with tenant database name
          let tenantUrl = `${protocol}://`;

          // Add credentials if present
          if (url.username && url.password) {
            tenantUrl += `${url.username}:${url.password}@`;
          }

          // Add host
          tenantUrl += host;

          // Add port if not using SRV
          if (protocol !== 'mongodb+srv' && port) {
            tenantUrl += `:${port}`;
          }

          // Add database name
          tenantUrl += `/${databaseName}`;

          // Preserve query parameters (like authSource, ssl, etc.)
          if (url.search) {
            tenantUrl += url.search;
          } else {
            // Default authSource if not present
            tenantUrl += '?authSource=admin';
          }

          return tenantUrl;
        } catch (urlError) {
          // If URL parsing fails, try to extract components manually
          this.logger.warn(
            `Failed to parse master URL as URL object: ${urlError}`,
          );
        }
      }

      // Fallback: build URL from individual environment variables
      const username =
        this.configService.get<string>('MONGODB_USERNAME') ||
        this.configService.get<string>('MONGODB_USER') ||
        '';
      const password = this.configService.get<string>('MONGODB_PASSWORD') || '';
      const host =
        this.configService.get<string>('MONGODB_HOST') || 'localhost';
      const port = this.configService.get<string>('MONGODB_PORT') || '27017';

      if (username && password) {
        return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
      }
      return `mongodb://${host}:${port}/${databaseName}`;
    } catch (error) {
      this.logger.error(`Failed to build MongoDB URL: ${error}`);
      // Final fallback
      return `mongodb://localhost:27017/${databaseName}`;
    }
  }
}
