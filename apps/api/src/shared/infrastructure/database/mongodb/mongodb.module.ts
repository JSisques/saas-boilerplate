import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
