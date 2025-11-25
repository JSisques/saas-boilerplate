import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoTenantFactory implements OnModuleDestroy {
  private readonly logger = new Logger(MongoTenantFactory.name);
  private readonly tenantClients = new Map<string, MongoClient>();
  private readonly tenantDatabases = new Map<string, Db>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Get or create a MongoDB client instance for a specific tenant
   * @param tenantId - The tenant ID
   * @param databaseUrl - The database connection URL for the tenant
   * @param databaseName - The database name for the tenant
   * @returns Db instance for the tenant
   */
  async getTenantDatabase(
    tenantId: string,
    databaseUrl: string,
    databaseName: string,
  ): Promise<Db> {
    // Check if database already exists for this tenant
    if (this.tenantDatabases.has(tenantId)) {
      const existingClient = this.tenantClients.get(tenantId)!;
      const existingDb = this.tenantDatabases.get(tenantId)!;

      // Verify the connection is still valid
      try {
        await existingDb.admin().ping();
        return existingDb;
      } catch (error) {
        this.logger.warn(
          `Connection for tenant ${tenantId} is invalid, recreating...`,
        );
        this.logger.error(
          `Error connecting to tenant database ${tenantId}: ${error}`,
        );
        // Close and remove invalid client
        await existingClient.close().catch(() => {});
        this.tenantClients.delete(tenantId);
        this.tenantDatabases.delete(tenantId);
      }
    }

    // Create new client instance with connection pool configuration
    this.logger.log(`Creating MongoDB client for tenant: ${tenantId}`);

    // Connection pool configuration for tenant databases
    const maxPoolSize = parseInt(
      this.configService.get<string>('MONGODB_TENANT_MAX_POOL_SIZE') ||
        this.configService.get<string>('MONGODB_MAX_POOL_SIZE') ||
        '10',
      10,
    );
    const minPoolSize = parseInt(
      this.configService.get<string>('MONGODB_TENANT_MIN_POOL_SIZE') ||
        this.configService.get<string>('MONGODB_MIN_POOL_SIZE') ||
        '2',
      10,
    );
    const maxIdleTimeMS = parseInt(
      this.configService.get<string>('MONGODB_TENANT_MAX_IDLE_TIME_MS') ||
        this.configService.get<string>('MONGODB_MAX_IDLE_TIME_MS') ||
        '30000',
      10,
    );
    const waitQueueTimeoutMS = parseInt(
      this.configService.get<string>('MONGODB_TENANT_WAIT_QUEUE_TIMEOUT_MS') ||
        this.configService.get<string>('MONGODB_WAIT_QUEUE_TIMEOUT_MS') ||
        '0',
      10,
    );

    const client = new MongoClient(databaseUrl, {
      authSource: 'admin',
      maxPoolSize, // Maximum number of connections in the pool per tenant
      minPoolSize, // Minimum number of connections in the pool per tenant
      maxIdleTimeMS, // Maximum time a connection can remain idle
      waitQueueTimeoutMS, // Maximum time to wait for a connection (0 = no limit)
    });

    // Connect to the database
    try {
      await client.connect();
      const db = client.db(databaseName);
      this.tenantClients.set(tenantId, client);
      this.tenantDatabases.set(tenantId, db);
      this.logger.log(
        `MongoDB client created and connected for tenant: ${tenantId} (pool: min=${minPoolSize}, max=${maxPoolSize})`,
      );
      return db;
    } catch (error) {
      this.logger.error(
        `Failed to connect to tenant database ${tenantId}: ${error}`,
      );
      await client.close().catch(() => {});
      throw error;
    }
  }

  /**
   * Remove a tenant client from the cache
   * @param tenantId - The tenant ID
   */
  async removeTenantClient(tenantId: string): Promise<void> {
    const client = this.tenantClients.get(tenantId);
    if (client) {
      this.logger.log(`Removing MongoDB client for tenant: ${tenantId}`);
      await client.close().catch(() => {});
      this.tenantClients.delete(tenantId);
      this.tenantDatabases.delete(tenantId);
    }
  }

  /**
   * Get all active tenant IDs
   * @returns Array of tenant IDs with active connections
   */
  getActiveTenantIds(): string[] {
    return Array.from(this.tenantClients.keys());
  }

  /**
   * Disconnect all tenant clients
   */
  async disconnectAll(): Promise<void> {
    this.logger.log(`Disconnecting all tenant MongoDB clients...`);
    const disconnectPromises = Array.from(this.tenantClients.values()).map(
      (client) => client.close().catch(() => {}),
    );
    await Promise.all(disconnectPromises);
    this.tenantClients.clear();
    this.tenantDatabases.clear();
    this.logger.log(`All tenant MongoDB clients disconnected`);
  }

  async onModuleDestroy() {
    await this.disconnectAll();
  }
}
