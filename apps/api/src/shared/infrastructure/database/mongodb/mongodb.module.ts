import { Global, Module } from '@nestjs/common';
import { MongoService } from '@shared/infrastructure/database/mongodb/mongo.service';

@Global()
@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
