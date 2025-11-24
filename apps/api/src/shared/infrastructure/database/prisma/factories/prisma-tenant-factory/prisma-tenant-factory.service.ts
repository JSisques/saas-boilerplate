import { PrismaClientExtended } from '@/shared/infrastructure/database/prisma/clients/custom-prisma-client/custom-prisma-client';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaTenantFactory implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaTenantFactory.name);
  private readonly tenantClients = new Map<string, PrismaClientExtended>();

  /**
   * Get or create a Prisma client instance for a specific tenant
   * @param tenantId - The tenant ID
   * @param databaseUrl - The database connection URL for the tenant
   * @returns PrismaClientExtended instance for the tenant
   */
  async getTenantClient(
    tenantId: string,
    databaseUrl: string,
  ): Promise<PrismaClientExtended> {
    // Check if client already exists for this tenant
    if (this.tenantClients.has(tenantId)) {
      const existingClient = this.tenantClients.get(tenantId)!;

      // Verify the connection is still valid
      try {
        await existingClient.$queryRaw`SELECT 1`;
        return existingClient;
      } catch (error) {
        this.logger.warn(
          `Connection for tenant ${tenantId} is invalid, recreating...`,
        );
        this.logger.error(
          `Error connecting to tenant database ${tenantId}: ${error}`,
        );
        // Disconnect and remove invalid client
        await existingClient.$disconnect().catch(() => {});
        this.tenantClients.delete(tenantId);
      }
    }

    // Create new client instance
    this.logger.log(`Creating Prisma client for tenant: ${tenantId}`);
    const client = new PrismaClientExtended({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // Connect to the database
    try {
      await client.$connect();
      this.tenantClients.set(tenantId, client);
      this.logger.log(
        `Prisma client created and connected for tenant: ${tenantId}`,
      );
      return client;
    } catch (error) {
      this.logger.error(
        `Failed to connect to tenant database ${tenantId}: ${error}`,
      );
      await client.$disconnect().catch(() => {});
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
      this.logger.log(`Removing Prisma client for tenant: ${tenantId}`);
      await client.$disconnect().catch(() => {});
      this.tenantClients.delete(tenantId);
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
    this.logger.log(`Disconnecting all tenant Prisma clients...`);
    const disconnectPromises = Array.from(this.tenantClients.values()).map(
      (client) => client.$disconnect().catch(() => {}),
    );
    await Promise.all(disconnectPromises);
    this.tenantClients.clear();
    this.logger.log(`All tenant Prisma clients disconnected`);
  }

  async onModuleDestroy() {
    await this.disconnectAll();
  }
}
