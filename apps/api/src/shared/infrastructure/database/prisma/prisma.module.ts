import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaMasterService],
  exports: [PrismaMasterService],
})
export class PrismaModule {}
