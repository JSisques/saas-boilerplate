import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoMasterService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoMasterService.name);
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    this.logger.log(`🚀 Initializing MongoDB Master`);

    const mongoUrl = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE;

    try {
      this.client = new MongoClient(mongoUrl, {
        authSource: 'admin',
      });
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.logger.log(`🚀 MongoDB Master connected successfully`);
    } catch (error) {
      this.logger.error(`🚀 Error connecting to MongoDB Master: ${error}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log(`🚀 MongoDB Master disconnected`);
  }

  getDatabase(): Db {
    this.logger.log(`🚀 Getting MongoDB Master database`);
    return this.db;
  }

  getCollection(collectionName: string) {
    this.logger.log(`🚀 Getting MongoDB Master collection ${collectionName}`);
    return this.db.collection(collectionName);
  }
}
