import { MongoService } from '@/shared/infrastructure/database/mongodb/mongo.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
