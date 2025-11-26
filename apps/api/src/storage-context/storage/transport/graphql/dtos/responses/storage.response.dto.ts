import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('StorageResponseDto')
export class StorageResponseDto {
  @Field(() => String, { description: 'The storage ID' })
  id: string;

  @Field(() => String, { description: 'The file name' })
  fileName: string;

  @Field(() => Number, { description: 'The file size in bytes' })
  fileSize: number;

  @Field(() => String, { description: 'The MIME type' })
  mimeType: string;

  @Field(() => String, { description: 'The storage provider' })
  provider: string;

  @Field(() => String, { description: 'The file URL' })
  url: string;

  @Field(() => String, { description: 'The file path' })
  path: string;

  @Field(() => Date, { description: 'The creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'The update date' })
  updatedAt: Date;
}

@ObjectType('PaginatedStorageResultDto')
export class PaginatedStorageResultDto extends BasePaginatedResultDto {
  @Field(() => [StorageResponseDto], { description: 'The storage items' })
  items: StorageResponseDto[];
}
