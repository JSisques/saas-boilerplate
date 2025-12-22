import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeormTenantFactory implements OnModuleDestroy {
  private readonly logger = new Logger(TypeormTenantFactory.name);
  private readonly tenantDataSources = new Map<string, DataSource>();

  /**
   * Get or create a TypeORM DataSource instance for a specific tenant
   * @param tenantId - The tenant ID
   * @param databaseUrl - The database connection URL for the tenant
   * @returns DataSource instance for the tenant
   */
  async getTenantDataSource(
    tenantId: string,
    databaseUrl: string,
  ): Promise<DataSource> {
    // Check if DataSource already exists for this tenant
    if (this.tenantDataSources.has(tenantId)) {
      const existingDataSource = this.tenantDataSources.get(tenantId)!;

      // Verify the connection is still valid
      try {
        if (existingDataSource.isInitialized) {
          await existingDataSource.query('SELECT 1');
          return existingDataSource;
        } else {
          // Reinitialize if not initialized
          await existingDataSource.initialize();
          return existingDataSource;
        }
      } catch (error) {
        this.logger.warn(
          `Connection for tenant ${tenantId} is invalid, recreating...`,
        );
        this.logger.error(
          `Error connecting to tenant database ${tenantId}: ${error}`,
        );
        // Destroy and remove invalid DataSource
        if (existingDataSource.isInitialized) {
          await existingDataSource.destroy().catch(() => {});
        }
        this.tenantDataSources.delete(tenantId);
      }
    }

    // Create new DataSource instance
    this.logger.log(`Creating TypeORM DataSource for tenant: ${tenantId}`);
    const dataSourceOptions: DataSourceOptions = {
      type: 'postgres',
      url: databaseUrl,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    };

    const dataSource = new DataSource(dataSourceOptions);

    // Initialize the DataSource
    try {
      await dataSource.initialize();
      this.tenantDataSources.set(tenantId, dataSource);
      this.logger.log(
        `TypeORM DataSource created and connected for tenant: ${tenantId}`,
      );
      return dataSource;
    } catch (error) {
      this.logger.error(
        `Failed to connect to tenant database ${tenantId}: ${error}`,
      );
      if (dataSource.isInitialized) {
        await dataSource.destroy().catch(() => {});
      }
      throw error;
    }
  }

  /**
   * Remove a tenant DataSource from the cache
   * @param tenantId - The tenant ID
   */
  async removeTenantDataSource(tenantId: string): Promise<void> {
    const dataSource = this.tenantDataSources.get(tenantId);
    if (dataSource) {
      this.logger.log(`Removing TypeORM DataSource for tenant: ${tenantId}`);
      if (dataSource.isInitialized) {
        await dataSource.destroy().catch(() => {});
      }
      this.tenantDataSources.delete(tenantId);
    }
  }

  /**
   * Get all active tenant IDs
   * @returns Array of tenant IDs with active connections
   */
  getActiveTenantIds(): string[] {
    return Array.from(this.tenantDataSources.keys());
  }

  /**
   * Disconnect all tenant DataSources
   */
  async disconnectAll(): Promise<void> {
    this.logger.log(`Disconnecting all tenant TypeORM DataSources...`);
    const disconnectPromises = Array.from(this.tenantDataSources.values()).map(
      (dataSource) => {
        if (dataSource.isInitialized) {
          return dataSource.destroy().catch(() => {});
        }
        return Promise.resolve();
      },
    );
    await Promise.all(disconnectPromises);
    this.tenantDataSources.clear();
    this.logger.log(`All tenant TypeORM DataSources disconnected`);
  }

  async onModuleDestroy() {
    await this.disconnectAll();
  }
}
