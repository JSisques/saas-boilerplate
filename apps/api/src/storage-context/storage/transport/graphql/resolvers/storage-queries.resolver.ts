import { Criteria } from '@/shared/domain/entities/criteria';
import { StorageFindByCriteriaQuery } from '@/storage-context/storage/application/queries/storage-find-by-criteria/storage-find-by-criteria.query';
import { StorageFindByIdQuery } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query';
import { StorageFindByCriteriaRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-find-by-criteria.request.dto';
import { StorageFindByIdRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-find-by-id.request.dto';
import {
  PaginatedStorageResultDto,
  StorageResponseDto,
} from '@/storage-context/storage/transport/graphql/dtos/responses/storage.response.dto';
import { StorageGraphQLMapper } from '@/storage-context/storage/transport/graphql/mappers/storage.mapper';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class StorageQueryResolver {
  private readonly logger = new Logger(StorageQueryResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly storageGraphQLMapper: StorageGraphQLMapper,
  ) {}

  @Query(() => StorageResponseDto, { nullable: true })
  async storageFindById(
    @Args('input') input: StorageFindByIdRequestDto,
  ): Promise<StorageResponseDto | null> {
    this.logger.log(`Finding storage by id: ${input.id}`);

    const storage = await this.queryBus.execute(
      new StorageFindByIdQuery({ id: input.id }),
    );

    return storage ? this.storageGraphQLMapper.toResponseDto(storage) : null;
  }

  @Query(() => PaginatedStorageResultDto)
  async storageFindByCriteria(
    @Args('input', { nullable: true }) input?: StorageFindByCriteriaRequestDto,
  ): Promise<PaginatedStorageResultDto> {
    this.logger.log(`Finding storages by criteria: ${JSON.stringify(input)}`);

    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    const result = await this.queryBus.execute(
      new StorageFindByCriteriaQuery({ criteria }),
    );

    return this.storageGraphQLMapper.toPaginatedResponseDto(result);
  }
}
