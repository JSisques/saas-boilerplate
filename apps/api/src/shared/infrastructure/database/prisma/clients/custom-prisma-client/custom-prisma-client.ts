import { filterSoftDeletedExtension } from '@/shared/infrastructure/database/prisma/extensions/prisma-filter-soft-delete/prisma-filter-soft-delete.extension';
import { prismaSoftDeleteManyExtension } from '@/shared/infrastructure/database/prisma/extensions/prisma-soft-delete-many/prisma-soft-delete-many.extension';
import { softDeleteExtension } from '@/shared/infrastructure/database/prisma/extensions/prisma-soft-delete/prisma-soft-delete.extension';
import { PrismaClient } from '@prisma/client';

// Function to give us a prismaClient with extensions we want
export const customPrismaClient = (prismaClient: PrismaClient) => {
  return prismaClient
    .$extends(softDeleteExtension) // Here we add our created extensions
    .$extends(prismaSoftDeleteManyExtension)
    .$extends(filterSoftDeletedExtension);
};

// Create a type to our function
export type CustomPrismaClient = ReturnType<typeof customPrismaClient>;

// Our Custom Prisma Client with the client set to the customPrismaClient with extension
export class PrismaClientExtended extends PrismaClient {
  private _customPrismaClient: CustomPrismaClient | null = null;

  private get extendedClient(): CustomPrismaClient {
    if (!this._customPrismaClient) {
      this._customPrismaClient = customPrismaClient(this);
    }

    return this._customPrismaClient;
  }

  // Override to get the extended client
  get client(): CustomPrismaClient {
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
