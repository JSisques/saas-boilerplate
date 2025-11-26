import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoMasterService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoMasterService.name);
  private client: MongoClient;
  private db: Db;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log(`🚀 Initializing MongoDB Master`);

    const mongoUrl = this.configService.get<string>('MONGODB_URI');
    const dbName = this.configService.get<string>('MONGODB_DATABASE');

    try {
      // Connection pool configuration
      const maxPoolSize = parseInt(
        this.configService.get<string>('MONGODB_MAX_POOL_SIZE') || '10',
        10,
      );
      const minPoolSize = parseInt(
        this.configService.get<string>('MONGODB_MIN_POOL_SIZE') || '2',
        10,
      );
      const maxIdleTimeMS = parseInt(
        this.configService.get<string>('MONGODB_MAX_IDLE_TIME_MS') || '30000',
        10,
      );
      const waitQueueTimeoutMS = parseInt(
        this.configService.get<string>('MONGODB_WAIT_QUEUE_TIMEOUT_MS') || '0',
        10,
      );

      this.client = new MongoClient(mongoUrl, {
        authSource: 'admin',
        maxPoolSize, // Maximum number of connections in the pool
        minPoolSize, // Minimum number of connections in the pool
        maxIdleTimeMS, // Maximum time a connection can remain idle
        waitQueueTimeoutMS, // Maximum time to wait for a connection (0 = no limit)
      });
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.logger.log(
        `🚀 MongoDB Master connected successfully (pool: min=${minPoolSize}, max=${maxPoolSize})`,
      );
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
