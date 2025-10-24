import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoService.name);
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    this.logger.log(`🚀 Initializing MongoDB`);

    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DATABASE || 'nestjs-ddd';

    try {
      this.client = new MongoClient(mongoUrl, {
        authSource: 'admin',
      });
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.logger.log(`🚀 MongoDB connected successfully`);
    } catch (error) {
      this.logger.error(`🚀 Error connecting to MongoDB: ${error}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log(`🚀 MongoDB disconnected`);
  }

  getDatabase(): Db {
    this.logger.log(`🚀 Getting MongoDB database`);
    return this.db;
  }

  getCollection(collectionName: string) {
    this.logger.log(`🚀 Getting MongoDB collection ${collectionName}`);
    return this.db.collection(collectionName);
  }
}
