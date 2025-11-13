import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import {
  PaginatedStorageResultDto,
  StorageResponseDto,
} from '@/storage-context/storage/transport/graphql/dtos/responses/storage.response.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageGraphQLMapper {
  private readonly logger = new Logger(StorageGraphQLMapper.name);

  toResponseDto(storage: StorageViewModel): StorageResponseDto {
    this.logger.log(
      `Mapping storage view model to response dto: ${storage.id}`,
    );
    return {
      id: storage.id,
      fileName: storage.fileName,
      fileSize: storage.fileSize,
      mimeType: storage.mimeType,
      provider: storage.provider,
      url: storage.url,
      path: storage.path,
      createdAt: storage.createdAt,
      updatedAt: storage.updatedAt,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<StorageViewModel>,
  ): PaginatedStorageResultDto {
    this.logger.log(
      `Mapping paginated storage result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((storage) =>
        this.toResponseDto(storage),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
