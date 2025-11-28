import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles.guard';
import { TenantGuard } from '@/auth-context/auth/infrastructure/guards/tenant.guard';
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
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER)
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
