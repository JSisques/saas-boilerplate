import { PrismaClient } from '@/prisma/tenant/client';
import { filterSoftDeletedExtension } from '@/shared/infrastructure/database/prisma/extensions/prisma-filter-soft-delete/prisma-filter-soft-delete.extension';
import { prismaSoftDeleteManyExtension } from '@/shared/infrastructure/database/prisma/extensions/prisma-soft-delete-many/prisma-soft-delete-many.extension';
import { softDeleteExtension } from '@/shared/infrastructure/database/prisma/extensions/prisma-soft-delete/prisma-soft-delete.extension';

// Function to give us a prismaClient with extensions we want
export const customPrismaTenantClient = (prismaClient: PrismaClient) => {
  return prismaClient
    .$extends(softDeleteExtension) // Here we add our created extensions
    .$extends(prismaSoftDeleteManyExtension)
    .$extends(filterSoftDeletedExtension);
};

// Create a type to our function
export type CustomPrismaTenantClient = ReturnType<
  typeof customPrismaTenantClient
>;

// Our Custom Prisma Client with the client set to the customPrismaClient with extension
export class PrismaTenantClientExtended extends PrismaClient {
  private _customPrismaClient: CustomPrismaTenantClient | null = null;

  private get extendedClient(): CustomPrismaTenantClient {
    if (!this._customPrismaClient) {
      this._customPrismaClient = customPrismaTenantClient(this);
    }

    return this._customPrismaClient;
  }

  // Override to get the extended client
  get client(): CustomPrismaTenantClient {
    return this.extendedClient;
  }

  // Proxy all model access through the extended client
  // This ensures that all queries use the extended client with soft delete filters
  constructor(...args: ConstructorParameters<typeof PrismaClient>) {
    super(...args);

    // Proxy model access to extended client
    return new Proxy(this, {
      get: (target, prop) => {
        // Return extended client methods for model access
        if (prop in target.extendedClient && prop !== 'client') {
          return (target.extendedClient as any)[prop];
        }
        return (target as any)[prop];
      },
    }) as this;
  }
}
