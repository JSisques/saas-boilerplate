import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [MongoMasterService],
  exports: [MongoMasterService],
})
export class MongoModule {}
