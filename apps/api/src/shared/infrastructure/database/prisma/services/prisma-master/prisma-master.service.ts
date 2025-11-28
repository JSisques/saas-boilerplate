import { PrismaClientExtended } from '@/shared/infrastructure/database/prisma/clients/custom-prisma-client/custom-prisma-client';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class PrismaMasterService
  extends PrismaClientExtended
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaMasterService.name);

  async onModuleInit() {
    this.logger.log(`🚀 Initializing Prisma Master`);

    try {
      await this.client.$connect();
      this.logger.log(`🚀 Prisma Master connected successfully`);
    } catch (error) {
      this.logger.error(`🚀 Error connecting to Prisma Master: ${error}`);
    }
  }

  async onModuleDestroy() {
    this.logger.log(`🚀 Disconnecting Prisma Master`);

    try {
      await this.client.$disconnect();
      this.logger.log(`🚀 Prisma Master disconnected successfully`);
    } catch (error) {
      this.logger.error(`🚀 Error disconnecting from Prisma Master: ${error}`);
    }
  }
}
