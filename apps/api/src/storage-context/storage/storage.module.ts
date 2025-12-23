import { SharedModule } from '@/shared/shared.module';
import { StorageDeleteFileCommandHandler } from '@/storage-context/storage/application/commands/storage-delete-file/storage-delete-file.command-handler';
import { StorageDownloadFileCommandHandler } from '@/storage-context/storage/application/commands/storage-download-file/storage-download-file.command-handler';
import { StorageUploadFileCommandHandler } from '@/storage-context/storage/application/commands/storage-upload-file/storage-upload-file.command-handler';
import { StorageFileDeletedEventHandler } from '@/storage-context/storage/application/event-handlers/storage-file-deleted/storage-file-deleted.event-handler';
import { StorageUploadedEventHandler } from '@/storage-context/storage/application/event-handlers/storage-uploaded/storage-uploaded.event-handler';
import { StorageFindByCriteriaQueryHandler } from '@/storage-context/storage/application/queries/storage-find-by-criteria/storage-find-by-criteria.query-handler';
import { StorageFindByIdQueryHandler } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query-handler';
import { StorageViewModelFindByIdQueryHandler } from '@/storage-context/storage/application/queries/storage-view-model-find-by-id/storage-view-model-find-by-id.query-handler';
import { AssertStorageExsistsService } from '@/storage-context/storage/application/services/assert-storage-exsits/assert-storage-exsits.service';
import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import { STORAGE_READ_REPOSITORY_TOKEN } from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { STORAGE_WRITE_REPOSITORY_TOKEN } from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageMongoDBMapper } from '@/storage-context/storage/infrastructure/database/mongodb/mappers/storage-mongodb.mapper';
import { StorageMongoRepository } from '@/storage-context/storage/infrastructure/database/mongodb/repositories/storage-mongodb.repository';
import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { StorageTypeormMapper } from '@/storage-context/storage/infrastructure/database/typeorm/mappers/storage-typeorm.mapper';
import { StorageTypeormRepository } from '@/storage-context/storage/infrastructure/database/typeorm/repositories/storage-typeorm.repository';
import { S3StorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/s3/s3-storage-provider.service';
import { ServerRouteStorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/server-route/server-route-storage-provider.service';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { SupabaseStorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/supabase/supabase-storage-provider.service';
import { StorageGraphQLMapper } from '@/storage-context/storage/transport/graphql/mappers/storage.mapper';
import { StorageMutationsResolver } from '@/storage-context/storage/transport/graphql/resolvers/storage-mutations.resolver';
import { StorageQueryResolver } from '@/storage-context/storage/transport/graphql/resolvers/storage-queries.resolver';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [StorageQueryResolver, StorageMutationsResolver];

const SERVICES = [
  S3StorageProviderService,
  SupabaseStorageProviderService,
  ServerRouteStorageProviderService,
  StorageProviderFactoryService,
  AssertStorageExsistsService,
  AssertStorageViewModelExsistsService,
];

const QUERY_HANDLERS = [
  StorageFindByIdQueryHandler,
  StorageFindByCriteriaQueryHandler,
  StorageViewModelFindByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  StorageUploadFileCommandHandler,
  StorageDownloadFileCommandHandler,
  StorageDeleteFileCommandHandler,
];

const EVENT_HANDLERS = [
  StorageUploadedEventHandler,
  StorageFileDeletedEventHandler,
];

const FACTORIES = [StorageAggregateFactory, StorageViewModelFactory];

const MAPPERS = [
  StorageTypeormMapper,
  StorageMongoDBMapper,
  StorageGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: STORAGE_WRITE_REPOSITORY_TOKEN,
    useClass: StorageTypeormRepository,
  },
  {
    provide: STORAGE_READ_REPOSITORY_TOKEN,
    useClass: StorageMongoRepository,
  },
];

const ENTITIES = [StorageTypeormEntity];

@Module({
  imports: [SharedModule, HttpModule, TypeOrmModule.forFeature(ENTITIES)],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...REPOSITORIES,
    ...FACTORIES,
    ...MAPPERS,
  ],
})
export class StorageModule implements OnModuleInit {
  private readonly logger = new Logger(StorageModule.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const storageProvider =
      (this.configService
        .get<StorageProviderEnum>('STORAGE_PROVIDER')
        .toUpperCase() as StorageProviderEnum) || StorageProviderEnum.S3;
    this.logger.log(`📦 Storage Provider: ${storageProvider}`);
  }
}
