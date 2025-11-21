import { PrismaClientExtended } from '@/shared/infrastructure/database/prisma/clients/custom-prisma-client/custom-prisma-client';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClientExtended
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log(`🚀 Initializing Prisma`);

    try {
      await this.$connect();
      this.logger.log(`🚀 Prisma connected successfully`);
    } catch (error) {
      this.logger.error(`🚀 Error connecting to Prisma: ${error}`);
    }
  }

  async onModuleDestroy() {
    this.logger.log(`🚀 Disconnecting Prisma`);

    try {
      await this.$disconnect();
      this.logger.log(`🚀 Prisma disconnected successfully`);
    } catch (error) {
      this.logger.error(`🚀 Error disconnecting from Prisma: ${error}`);
    }
  }
}
